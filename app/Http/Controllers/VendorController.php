<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use App\Models\Vendor;
use App\Models\VendorDetails;
use App\Models\VendorApplication;
use App\Models\VendorCertificate;
use App\Models\VendorBoard;
use App\Models\ProcurementList;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Inertia\Response;

class VendorController extends Controller
{
    public function indexPage()
    {
        $open_procurements = ProcurementList::where('procurement_open_date', '<=', now())
            ->where('procurement_close_date', '>=', now())
            ->orderBy('procurement_close_date', 'asc')
            ->get();

        return Inertia::render('Welcome', [
            'openProcurements' => $open_procurements,
        ]);
    }

    public function showLoginForm()
    {
        return redirect('/');
    }

    public function vendorLogin(Request $request)
    {
        $request->validate([
            'vendor_email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Attempt to authenticate the vendor
        if (Auth::guard('vendor')->attempt([
            'vendor_email' => $request->vendor_email,
            'password' => $request->password
        ], $request->boolean('remember'))) {
            $request->session()->regenerate();

            return redirect()->intended(route('vendor.dashboard', absolute: false));
        }

        return back()->withErrors([
            'error' => 'Alamat e-mel atau kata laluan anda salah. Sila semak semula dan cuba lagi',
        ])->onlyInput('vendor_email');
    }

    public function vendorRegister(Request $request): RedirectResponse
    {
        $request->validate([
            'vendor_contact_person' => 'required|string|max:255',
            'vendor_email' => 'required|string|lowercase|email|max:255|unique:vendors,vendor_email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $vendor = Vendor::create([
            'vendor_contact_person' => $request->vendor_contact_person,
            'vendor_email' => $request->vendor_email,
            'password' => $request->password, // Auto-hashed by model cast
        ]);

        event(new Registered($vendor));

        Auth::guard('vendor')->login($vendor);

        return redirect(route('vendor.dashboard', absolute: false));
    }

    public function vendorLogout(Request $request): RedirectResponse
    {
        Auth::guard('vendor')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    public function vendorDashboard(): Response
    {

        $vendor = Auth::guard('vendor')->user()->vendor_contact_person;

        $vendor_details = VendorDetails::where('vendor_account_id', Auth::guard('vendor')->user()->id)->first();
        // $vendor_application = VendorApplication::where('vendor_id', Auth::guard('vendor')->user()->id)->first();
        $vendor_applications = VendorApplication::where('vendor_id', Auth::guard('vendor')->user()->id)->orderBy('created_at', 'desc')->get();
        $vendor_active_cert = VendorCertificate::where('vendor_id', Auth::guard('vendor')->user()->id)->where('cert_status', 'approved')->where('created_at', '>=', now()->subYears(2))->where('created_at', '<=', now())->first();
        $vendor_active_cert_suspended = VendorCertificate::where('vendor_id', Auth::guard('vendor')->user()->id)->where('cert_status', 'suspended')->where('created_at', '>=', now()->subYears(2))->where('created_at', '<=', now())->first();
        $open_procurements = ProcurementList::where('procurement_open_date', '<=', now())
            ->where('procurement_close_date', '>=', now())
            ->orderBy('procurement_close_date', 'asc')
            ->get();


        return Inertia::render('Vendor-Area/VendorDashboard', [
            'vendor' => $vendor,
            'vendor_details' => $vendor_details,
            'vendor_applications' => $vendor_applications,
            'vendor_active_cert' => $vendor_active_cert,
            'openProcurements' => $open_procurements,
            'vendor_active_cert_suspended' => $vendor_active_cert_suspended,
        ]);
    }

    public function showVendorCompleteRegistrationForm(): Response
    {
        return Inertia::render('Vendor-Area/Form/VendorCompleteRegistrationForm');
    }

    public function uploadTempFile(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'field' => 'required|string|alpha_dash',
        ]);

        $path = $request->file('file')->store('vendor/temp', 'local');

        return response()->json(['path' => $path]);
    }

    public function viewTempFile(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse|\Illuminate\Http\Response
    {
        $path = $request->query('path', '');

        if ($path === '' || str_contains($path, '..')) {
            abort(403);
        }

        $isTempUpload = str_starts_with($path, 'vendor/temp/');
        $isOwnedVendorFile = false;

        if (!$isTempUpload) {
            // vendor can have multiple VendorDetails rows (one per submitted application), check all of them
            // note: ->id() returns vendor_email (see Vendor::getAuthIdentifierName), use ->user()->id for the UUID
            $vendor_details_records = VendorDetails::where('vendor_account_id', Auth::guard('vendor')->user()->id)->get();
            $ownedPaths = $vendor_details_records->flatMap(fn ($vendor_details) => array_filter([
                $vendor_details->vendor_SSM_attachment_address,
                $vendor_details->vendor_bank_account_statement_address,
                $vendor_details->vendor_MOF_attachment_address,
                $vendor_details->vendor_PKK_attachment_address,
                $vendor_details->vendor_CIDB_attachment_address,
                $vendor_details->vendor_MPOB_attachment_address,
            ]));
            $isOwnedVendorFile = $ownedPaths->contains($path);
        }

        if (!$isTempUpload && !$isOwnedVendorFile) {
            abort(403);
        }

        if (!Storage::disk('local')->exists($path)) {
            abort(404);
        }

        $mime = Storage::disk('local')->mimeType($path);

        return Storage::disk('local')->response($path, null, [
            'Content-Type' => $mime,
            'Content-Disposition' => 'inline',
        ]);
    }

    public function saveVendorCompleteRegistrationForm(Request $request): RedirectResponse
    {
        $vendor = Auth::guard('vendor')->user()->id;
        // dd($request->all());
        try {
            $validated = $request->validate([
                'vendor_type' => 'required|string',
                'vendor_company_type' => 'nullable|string',
                'vendor_id_num' => 'required|string',//no syarikat etc
                'vendor_id_num_2' => 'nullable|string', //no syarikat lama
                'vendor_email' => 'required|string|email',
                'vendor_name' => 'required|string',
                'vendor_contact_person' => 'required|string',
                'vendor_contact_person_phone' => 'required|numeric',
                'vendor_contact_person_designation' => 'required|string',
                'vendor_contact_person_email' => 'required|string',
                'vendor_phone' => 'required|string',
                'vendor_address' => 'required|string',
                'vendor_website' => 'nullable|string',
                'vendor_tax_identification_num' => 'nullable|string',
                'vendor_sst_number' => 'nullable|string',
                'vendor_establishment_date' => 'required|date',
                'vendor_current_establishment_cert_expiry_date' => 'nullable|date',
                'vendor_capital_1' => 'nullable|numeric',
                'vendor_capital_2' => 'nullable|numeric',
                'vendor_bumiputera_ownership_percent' => 'nullable|numeric|max:100',
                'vendor_non_bumiputera_ownership_percent' => 'nullable|numeric|max:100',
                'vendor_SSM_start_date' => 'nullable|date',
                'vendor_SSM_expiry_date' => 'nullable|date',
                'vendor_SSM_attachment_address' => 'nullable|string',
                'vendor_bank_name' => 'required|string',
                'vendor_bank_account_number' => 'required|string',
                'vendor_bank_entity_registration_num' => 'nullable|string',
                'vendor_bank_account_statement_address' => 'required|string',
                'vendor_MOF_reg_num' => 'nullable|string',
                'vendor_MOF_start_date' => 'nullable|date',
                'vendor_MOF_expiry_date' => 'nullable|date',
                'vendor_MOF_attachment_address' => 'nullable|string',
                'vendor_PKK_reg_num' => 'nullable|string',
                'vendor_PKK_start_date' => 'nullable|date',
                'vendor_PKK_end_date' => 'nullable|date',
                'vendor_PKK_class' => 'nullable|string',
                'vendor_PKK_head' => 'nullable|string',
                'vendor_PKK_attachment_address' => 'nullable|string',
                'vendor_CIDB_reg_num' => 'nullable|string',
                'vendor_CIDB_start_date' => 'nullable|date',
                'vendor_CIDB_end_date' => 'nullable|date',
                'vendor_CIDB_B_cat_grade' => 'nullable|string',
                'vendor_CIDB_CE_cat_grade' => 'nullable|string',
                'vendor_CIDB_ME_cat_grade' => 'nullable|string',
                'vendor_CIDB_attachment_address' => 'nullable|string',
                'vendor_MPOB_license_num' => 'nullable|string',
                'vendor_MPOB_start_date' => 'nullable|date',
                'vendor_MPOB_end_date' => 'nullable|date',
                'vendor_MPOB_license_category' => 'nullable|string',
                'vendor_MPOB_attachment_address' => 'nullable|string',
                'boardDirectors' => 'nullable|array',
            ]);
            

            DB::beginTransaction();
            
            try {
                $vendor = Auth::guard('vendor')->user();
                // dd($vendor);
                
                // Handle file uploads - move from temp to permanent storage
                if ($request->input('vendor_SSM_attachment_address')) {
                    $tempPath = $request->input('vendor_SSM_attachment_address');
                    if (str_starts_with($tempPath, 'vendor/temp/')) {
                        if ($vendor->vendor_SSM_attachment_address) {
                            Storage::disk('local')->delete($vendor->vendor_SSM_attachment_address);
                        }
                        $newPath = 'vendor/ssm_certificates/' . basename($tempPath);
                        Storage::disk('local')->move($tempPath, $newPath);
                        $validated['vendor_SSM_attachment_address'] = $newPath;
                    }
                }
                                
                if ($request->input('vendor_bank_account_statement_address')) {
                    $tempPath = $request->input('vendor_bank_account_statement_address');
                    if (str_starts_with($tempPath, 'vendor/temp/')) {
                        if ($vendor->vendor_bank_account_statement_address) {
                            Storage::disk('local')->delete($vendor->vendor_bank_account_statement_address);
                        }
                        $newPath = 'vendor/bank_statements/' . basename($tempPath);
                        Storage::disk('local')->move($tempPath, $newPath);
                        $validated['vendor_bank_account_statement_address'] = $newPath;
                    }
                }

                if ($request->input('vendor_MOF_attachment_address')) {
                    $tempPath = $request->input('vendor_MOF_attachment_address');
                    if (str_starts_with($tempPath, 'vendor/temp/')) {
                        if ($vendor->vendor_MOF_attachment_address) {
                            Storage::disk('local')->delete($vendor->vendor_MOF_attachment_address);
                        }
                        $newPath = 'vendor/mof_certificates/' . basename($tempPath);
                        Storage::disk('local')->move($tempPath, $newPath);
                        $validated['vendor_MOF_attachment_address'] = $newPath;
                    }
                }

                if ($request->input('vendor_PKK_attachment_address')) {
                    $tempPath = $request->input('vendor_PKK_attachment_address');
                    if (str_starts_with($tempPath, 'vendor/temp/')) {
                        if ($vendor->vendor_PKK_attachment_address) {
                            Storage::disk('local')->delete($vendor->vendor_PKK_attachment_address);
                        }
                        $newPath = 'vendor/pkk_certificates/' . basename($tempPath);
                        Storage::disk('local')->move($tempPath, $newPath);
                        $validated['vendor_PKK_attachment_address'] = $newPath;
                    }
                }

                if ($request->input('vendor_CIDB_attachment_address')) {
                    $tempPath = $request->input('vendor_CIDB_attachment_address');
                    if (str_starts_with($tempPath, 'vendor/temp/')) {
                        if ($vendor->vendor_CIDB_attachment_address) {
                            Storage::disk('local')->delete($vendor->vendor_CIDB_attachment_address);
                        }
                        $newPath = 'vendor/cidb_certificates/' . basename($tempPath);
                        Storage::disk('local')->move($tempPath, $newPath);
                        $validated['vendor_CIDB_attachment_address'] = $newPath;
                    }
                }

                if ($request->input('vendor_MPOB_attachment_address')) {
                    $tempPath = $request->input('vendor_MPOB_attachment_address');
                    if (str_starts_with($tempPath, 'vendor/temp/')) {
                        if ($vendor->vendor_MPOB_attachment_address) {
                            Storage::disk('local')->delete($vendor->vendor_MPOB_attachment_address);
                        }
                        $newPath = 'vendor/mpob_licenses/' . basename($tempPath);
                        Storage::disk('local')->move($tempPath, $newPath);
                        $validated['vendor_MPOB_attachment_address'] = $newPath;
                    }
                }

                //add vendor details

                $vendor_details = new VendorDetails();
                $vendor_details->vendor_type = $validated['vendor_type'];
                $vendor_details->vendor_company_type = $validated['vendor_company_type'];
                $vendor_details->vendor_id_num = $validated['vendor_id_num'];
                $vendor_details->vendor_id_num_2 = $validated['vendor_id_num_2'];
                $vendor_details->vendor_name = $validated['vendor_name'];
                $vendor_details->vendor_email = $validated['vendor_email'];
                $vendor_details->vendor_contact_person = $validated['vendor_contact_person'];
                $vendor_details->vendor_contact_person_phone = $validated['vendor_contact_person_phone'];
                $vendor_details->vendor_contact_person_designation = $validated['vendor_contact_person_designation'];
                $vendor_details->vendor_contact_person_email = $validated['vendor_contact_person_email'];
                $vendor_details->vendor_phone = $validated['vendor_phone'];
                $vendor_details->vendor_address = $validated['vendor_address'];
                $vendor_details->vendor_website = $validated['vendor_website'];
                $vendor_details->vendor_SSM_attachment_address = $validated['vendor_SSM_attachment_address'];
                $vendor_details->vendor_tax_identification_num = $validated['vendor_tax_identification_num'];
                $vendor_details->vendor_sst_number = $validated['vendor_sst_number'];
                $vendor_details->vendor_establishment_date = $validated['vendor_establishment_date'];
                $vendor_details->vendor_current_establishment_cert_expiry_date = $validated['vendor_current_establishment_cert_expiry_date'];
                $vendor_details->vendor_capital_1 = $validated['vendor_capital_1'];
                $vendor_details->vendor_capital_2 = $validated['vendor_capital_2'];
                $vendor_details->vendor_bumiputera_ownership_percent = $validated['vendor_bumiputera_ownership_percent'];
                $vendor_details->vendor_non_bumiputera_ownership_percent = $validated['vendor_non_bumiputera_ownership_percent'];
                $vendor_details->vendor_bank_name = $validated['vendor_bank_name'];
                $vendor_details->vendor_bank_account_number = $validated['vendor_bank_account_number'];
                $vendor_details->vendor_bank_entity_registration_num = $validated['vendor_bank_entity_registration_num'];
                $vendor_details->vendor_bank_account_statement_address = $validated['vendor_bank_account_statement_address'];
                $vendor_details->vendor_MOF_reg_num = $validated['vendor_MOF_reg_num'];
                $vendor_details->vendor_MOF_start_date = $validated['vendor_MOF_start_date'];
                $vendor_details->vendor_MOF_expiry_date = $validated['vendor_MOF_expiry_date'];
                $vendor_details->vendor_MOF_attachment_address = $validated['vendor_MOF_attachment_address'];
                $vendor_details->vendor_SSM_start_date = $validated['vendor_SSM_start_date'];
                $vendor_details->vendor_SSM_expiry_date = $validated['vendor_SSM_expiry_date'];
                $vendor_details->vendor_SSM_attachment_address = $validated['vendor_SSM_attachment_address'];
                $vendor_details->vendor_PKK_reg_num = $validated['vendor_PKK_reg_num'];
                $vendor_details->vendor_PKK_start_date = $validated['vendor_PKK_start_date'];
                $vendor_details->vendor_PKK_end_date = $validated['vendor_PKK_end_date'];
                $vendor_details->vendor_PKK_class = $validated['vendor_PKK_class'];
                $vendor_details->vendor_PKK_head = $validated['vendor_PKK_head'];
                $vendor_details->vendor_PKK_attachment_address = $validated['vendor_PKK_attachment_address'];
                $vendor_details->vendor_CIDB_reg_num = $validated['vendor_CIDB_reg_num'];
                $vendor_details->vendor_CIDB_start_date = $validated['vendor_CIDB_start_date'];
                $vendor_details->vendor_CIDB_end_date = $validated['vendor_CIDB_end_date'];
                $vendor_details->vendor_CIDB_B_cat_grade = $validated['vendor_CIDB_B_cat_grade'];
                $vendor_details->vendor_CIDB_CE_cat_grade = $validated['vendor_CIDB_CE_cat_grade'];
                $vendor_details->vendor_CIDB_ME_cat_grade = $validated['vendor_CIDB_ME_cat_grade'];
                $vendor_details->vendor_CIDB_attachment_address = $validated['vendor_CIDB_attachment_address'];
                $vendor_details->vendor_MPOB_license_num = $validated['vendor_MPOB_license_num'];
                $vendor_details->vendor_MPOB_start_date = $validated['vendor_MPOB_start_date'];
                $vendor_details->vendor_MPOB_end_date = $validated['vendor_MPOB_end_date'];
                $vendor_details->vendor_MPOB_license_category = $validated['vendor_MPOB_license_category'];
                $vendor_details->vendor_MPOB_attachment_address = $validated['vendor_MPOB_attachment_address'];

                // $vendor_details->fill($validated);
                $vendor_details->vendor_account_id = $vendor->id;
                $vendor_details->save();

                // save board directors / pemilik
                if (isset($validated['boardDirectors']) && is_array($validated['boardDirectors'])) {
                    foreach($validated['boardDirectors'] as $director)
                    {
                        $vendor_board = new VendorBoard();
                        $vendor_board->vendor_board_vendor_id = $vendor->id;
                        $vendor_board->vendor_board_name = $director['vendor_board_name'] ?? null;
                        $vendor_board->vendor_board_ic_num = $director['vendor_board_ic_num'] ?? null;
                        $vendor_board->vendor_board_phone_num = $director['vendor_board_phone_num'] ?? null;
                        $vendor_board->vendor_board_citizenship = $director['vendor_board_citizenship'] ?? null;
                        $vendor_board->vendor_board_ethnic = $director['vendor_board_ethnic'] ?? null;
                        $vendor_board->vendor_board_position = $director['vendor_board_position'] ?? null;
                        $vendor_board->vendor_board_address = $director['vendor_board_address'] ?? null;
                        $vendor_board->vendor_board_actual_outside_jobs = $director['vendor_board_actual_outside_jobs'] ?? null;
                        $vendor_board->save();
                    }
                }

                DB::commit();
                
                return redirect()->route('vendor.dashboard')
                    ->with('success', 'Registration completed successfully!');
                    
            } catch (\Exception $e) {
                DB::rollBack();
                
                // Delete uploaded files on error
                $fileFields = [
                    'vendor_bank_account_statement_address',
                    'vendor_SSM_attachment_address',
                    'vendor_MOF_attachment_address',
                    'vendor_PKK_attachment_address',
                    'vendor_CIDB_attachment_address',
                    'vendor_MPOB_attachment_address'
                ];
                
                foreach ($fileFields as $field) {
                    if (isset($validated[$field])) {
                        Storage::disk('local')->delete($validated[$field]);
                    }
                }
                
                throw $e;
            }


        } catch (\Exception $e) {
            \Log::error('Validation/Processing error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            dd($e->getMessage());
            return redirect()->back()
                ->withErrors(['error' => $e->getMessage()])
                ->with('error', 'An error occurred while processing the transactions')
                ->withInput();
        }

    }

    public function showVendorProfileUpdateForm($vendor_id):Response
    {
        $vendor_details = VendorDetails::where('vendor_account_id', Auth::guard('vendor')->user()->id)->where('id',$vendor_id)->first();
        $vendor_board = VendorBoard::where('vendor_board_vendor_id','=',$vendor_details->vendor_account_id)->get();
       
        return Inertia::render('Vendor-Area/Form/VendorUpdateProfileForm', [
            'vendor_details' => $vendor_details,
            'vendor_board' => $vendor_board,
        ]);
    }

    public function confirmUpdateProfile(Request $request): RedirectResponse
    {
        session(['vendor_cert_id_to_deactivate' => $request->input('vendor_cert_id')]);
        return redirect()->route('vendor.complete-registration');
    }

    public function deleteBoardMember(string $board_id): RedirectResponse
    {
        $board_member = VendorBoard::where('id', $board_id)
            ->where('vendor_board_vendor_id', Auth::guard('vendor')->user()->id)
            ->firstOrFail();

        $board_member->delete();

        return redirect()->back()->with('success', 'Ahli lembaga telah dipadam berjaya.');
    }

    public function saveVendorProfileUpdateForm(Request $request): RedirectResponse
    {
        $vendor = Auth::guard('vendor')->user()->id;
        // dd($request->all());
        try {
            $validated = $request->validate([
                'vendor_type' => 'required|string',
                'vendor_company_type' => 'nullable|string',
                'vendor_id_num' => 'required|string',//no syarikat etc
                'vendor_id_num_2' => 'nullable|string', //no syarikat lama
                'vendor_email' => 'required|string|email',
                'vendor_name' => 'required|string',
                'vendor_contact_person' => 'required|string',
                'vendor_contact_person_phone' => 'required|numeric',
                'vendor_contact_person_designation' => 'required|string',
                'vendor_contact_person_email' => 'required|string',
                'vendor_phone' => 'required|string',
                'vendor_address' => 'required|string',
                'vendor_website' => 'nullable|string',
                'vendor_tax_identification_num' => 'nullable|string',
                'vendor_sst_number' => 'nullable|string',
                'vendor_establishment_date' => 'required|date',
                'vendor_current_establishment_cert_expiry_date' => 'nullable|date',
                'vendor_capital_1' => 'nullable|numeric',
                'vendor_capital_2' => 'nullable|numeric',
                'vendor_bumiputera_ownership_percent' => 'nullable|numeric|max:100',
                'vendor_non_bumiputera_ownership_percent' => 'nullable|numeric|max:100',
                'vendor_SSM_start_date' => 'nullable|date',
                'vendor_SSM_expiry_date' => 'nullable|date',
                'vendor_SSM_attachment_address' => 'nullable|string',
                'vendor_bank_name' => 'required|string',
                'vendor_bank_account_number' => 'required|string',
                'vendor_bank_entity_registration_num' => 'nullable|string',
                'vendor_bank_account_statement_address' => 'required|string',
                'vendor_MOF_reg_num' => 'nullable|string',
                'vendor_MOF_start_date' => 'nullable|date',
                'vendor_MOF_expiry_date' => 'nullable|date',
                'vendor_MOF_attachment_address' => 'nullable|string',
                'vendor_PKK_reg_num' => 'nullable|string',
                'vendor_PKK_start_date' => 'nullable|date',
                'vendor_PKK_end_date' => 'nullable|date',
                'vendor_PKK_class' => 'nullable|string',
                'vendor_PKK_head' => 'nullable|string',
                'vendor_PKK_attachment_address' => 'nullable|string',
                'vendor_CIDB_reg_num' => 'nullable|string',
                'vendor_CIDB_start_date' => 'nullable|date',
                'vendor_CIDB_end_date' => 'nullable|date',
                'vendor_CIDB_B_cat_grade' => 'nullable|string',
                'vendor_CIDB_CE_cat_grade' => 'nullable|string',
                'vendor_CIDB_ME_cat_grade' => 'nullable|string',
                'vendor_CIDB_attachment_address' => 'nullable|string',
                'vendor_MPOB_license_num' => 'nullable|string',
                'vendor_MPOB_start_date' => 'nullable|date',
                'vendor_MPOB_end_date' => 'nullable|date',
                'vendor_MPOB_license_category' => 'nullable|string',
                'vendor_MPOB_attachment_address' => 'nullable|string',
                'boardDirectors' => 'nullable|array',
            ]);
            

            DB::beginTransaction();
            
            try {
                $vendor = Auth::guard('vendor')->user();
                // dd($vendor);
                
                // Handle file uploads - move from temp to permanent storage
                if ($request->input('vendor_SSM_attachment_address')) {
                    $tempPath = $request->input('vendor_SSM_attachment_address');
                    if (str_starts_with($tempPath, 'vendor/temp/')) {
                        if ($vendor->vendor_SSM_attachment_address) {
                            Storage::disk('local')->delete($vendor->vendor_SSM_attachment_address);
                        }
                        $newPath = 'vendor/ssm_certificates/' . basename($tempPath);
                        Storage::disk('local')->move($tempPath, $newPath);
                        $validated['vendor_SSM_attachment_address'] = $newPath;
                    }
                }
                                
                if ($request->input('vendor_bank_account_statement_address')) {
                    $tempPath = $request->input('vendor_bank_account_statement_address');
                    if (str_starts_with($tempPath, 'vendor/temp/')) {
                        if ($vendor->vendor_bank_account_statement_address) {
                            Storage::disk('local')->delete($vendor->vendor_bank_account_statement_address);
                        }
                        $newPath = 'vendor/bank_statements/' . basename($tempPath);
                        Storage::disk('local')->move($tempPath, $newPath);
                        $validated['vendor_bank_account_statement_address'] = $newPath;
                    }
                }

                if ($request->input('vendor_MOF_attachment_address')) {
                    $tempPath = $request->input('vendor_MOF_attachment_address');
                    if (str_starts_with($tempPath, 'vendor/temp/')) {
                        if ($vendor->vendor_MOF_attachment_address) {
                            Storage::disk('local')->delete($vendor->vendor_MOF_attachment_address);
                        }
                        $newPath = 'vendor/mof_certificates/' . basename($tempPath);
                        Storage::disk('local')->move($tempPath, $newPath);
                        $validated['vendor_MOF_attachment_address'] = $newPath;
                    }
                }

                if ($request->input('vendor_PKK_attachment_address')) {
                    $tempPath = $request->input('vendor_PKK_attachment_address');
                    if (str_starts_with($tempPath, 'vendor/temp/')) {
                        if ($vendor->vendor_PKK_attachment_address) {
                            Storage::disk('local')->delete($vendor->vendor_PKK_attachment_address);
                        }
                        $newPath = 'vendor/pkk_certificates/' . basename($tempPath);
                        Storage::disk('local')->move($tempPath, $newPath);
                        $validated['vendor_PKK_attachment_address'] = $newPath;
                    }
                }

                if ($request->input('vendor_CIDB_attachment_address')) {
                    $tempPath = $request->input('vendor_CIDB_attachment_address');
                    if (str_starts_with($tempPath, 'vendor/temp/')) {
                        if ($vendor->vendor_CIDB_attachment_address) {
                            Storage::disk('local')->delete($vendor->vendor_CIDB_attachment_address);
                        }
                        $newPath = 'vendor/cidb_certificates/' . basename($tempPath);
                        Storage::disk('local')->move($tempPath, $newPath);
                        $validated['vendor_CIDB_attachment_address'] = $newPath;
                    }
                }

                if ($request->input('vendor_MPOB_attachment_address')) {
                    $tempPath = $request->input('vendor_MPOB_attachment_address');
                    if (str_starts_with($tempPath, 'vendor/temp/')) {
                        if ($vendor->vendor_MPOB_attachment_address) {
                            Storage::disk('local')->delete($vendor->vendor_MPOB_attachment_address);
                        }
                        $newPath = 'vendor/mpob_licenses/' . basename($tempPath);
                        Storage::disk('local')->move($tempPath, $newPath);
                        $validated['vendor_MPOB_attachment_address'] = $newPath;
                    }
                }

                //add vendor details

                // $vendor_details = new VendorDetails();
                

                $vendor_details = VendorDetails::where('id','=',$request->id)->firstOrFail();
                $vendor_details->vendor_type = $validated['vendor_type'];
                $vendor_details->vendor_company_type = $validated['vendor_company_type'];
                $vendor_details->vendor_id_num = $validated['vendor_id_num'];
                $vendor_details->vendor_id_num_2 = $validated['vendor_id_num_2'];
                $vendor_details->vendor_name = $validated['vendor_name'];
                $vendor_details->vendor_email = $validated['vendor_email'];
                $vendor_details->vendor_contact_person = $validated['vendor_contact_person'];
                $vendor_details->vendor_contact_person_phone = $validated['vendor_contact_person_phone'];
                $vendor_details->vendor_contact_person_designation = $validated['vendor_contact_person_designation'];
                $vendor_details->vendor_contact_person_email = $validated['vendor_contact_person_email'];
                $vendor_details->vendor_phone = $validated['vendor_phone'];
                $vendor_details->vendor_address = $validated['vendor_address'];
                $vendor_details->vendor_website = $validated['vendor_website'];
                $vendor_details->vendor_SSM_attachment_address = $validated['vendor_SSM_attachment_address'];
                $vendor_details->vendor_tax_identification_num = $validated['vendor_tax_identification_num'];
                $vendor_details->vendor_sst_number = $validated['vendor_sst_number'];
                $vendor_details->vendor_establishment_date = $validated['vendor_establishment_date'];
                $vendor_details->vendor_current_establishment_cert_expiry_date = $validated['vendor_current_establishment_cert_expiry_date'];
                $vendor_details->vendor_capital_1 = $validated['vendor_capital_1'];
                $vendor_details->vendor_capital_2 = $validated['vendor_capital_2'];
                $vendor_details->vendor_bumiputera_ownership_percent = $validated['vendor_bumiputera_ownership_percent'];
                $vendor_details->vendor_non_bumiputera_ownership_percent = $validated['vendor_non_bumiputera_ownership_percent'];
                $vendor_details->vendor_bank_name = $validated['vendor_bank_name'];
                $vendor_details->vendor_bank_account_number = $validated['vendor_bank_account_number'];
                $vendor_details->vendor_bank_entity_registration_num = $validated['vendor_bank_entity_registration_num'];
                $vendor_details->vendor_bank_account_statement_address = $validated['vendor_bank_account_statement_address'];
                $vendor_details->vendor_MOF_reg_num = $validated['vendor_MOF_reg_num'];
                $vendor_details->vendor_MOF_start_date = $validated['vendor_MOF_start_date'];
                $vendor_details->vendor_MOF_expiry_date = $validated['vendor_MOF_expiry_date'];
                $vendor_details->vendor_MOF_attachment_address = $validated['vendor_MOF_attachment_address'];
                $vendor_details->vendor_SSM_start_date = $validated['vendor_SSM_start_date'];
                $vendor_details->vendor_SSM_expiry_date = $validated['vendor_SSM_expiry_date'];
                $vendor_details->vendor_SSM_attachment_address = $validated['vendor_SSM_attachment_address'];
                $vendor_details->vendor_PKK_reg_num = $validated['vendor_PKK_reg_num'];
                $vendor_details->vendor_PKK_start_date = $validated['vendor_PKK_start_date'];
                $vendor_details->vendor_PKK_end_date = $validated['vendor_PKK_end_date'];
                $vendor_details->vendor_PKK_class = $validated['vendor_PKK_class'];
                $vendor_details->vendor_PKK_head = $validated['vendor_PKK_head'];
                $vendor_details->vendor_PKK_attachment_address = $validated['vendor_PKK_attachment_address'];
                $vendor_details->vendor_CIDB_reg_num = $validated['vendor_CIDB_reg_num'];
                $vendor_details->vendor_CIDB_start_date = $validated['vendor_CIDB_start_date'];
                $vendor_details->vendor_CIDB_end_date = $validated['vendor_CIDB_end_date'];
                $vendor_details->vendor_CIDB_B_cat_grade = $validated['vendor_CIDB_B_cat_grade'];
                $vendor_details->vendor_CIDB_CE_cat_grade = $validated['vendor_CIDB_CE_cat_grade'];
                $vendor_details->vendor_CIDB_ME_cat_grade = $validated['vendor_CIDB_ME_cat_grade'];
                $vendor_details->vendor_CIDB_attachment_address = $validated['vendor_CIDB_attachment_address'];
                $vendor_details->vendor_MPOB_license_num = $validated['vendor_MPOB_license_num'];
                $vendor_details->vendor_MPOB_start_date = $validated['vendor_MPOB_start_date'];
                $vendor_details->vendor_MPOB_end_date = $validated['vendor_MPOB_end_date'];
                $vendor_details->vendor_MPOB_license_category = $validated['vendor_MPOB_license_category'];
                $vendor_details->vendor_MPOB_attachment_address = $validated['vendor_MPOB_attachment_address'];

                // $vendor_details->fill($validated);
                $vendor_details->vendor_account_id = $vendor->id;
                $vendor_details->save();

                // dd($request->vendor_id);
                //remove all board dulu
                $vendor_board = VendorBoard::where('vendor_board_vendor_id','=',$request->vendor_id)->delete();

                // save board directors / pemilik
                if (isset($validated['boardDirectors']) && is_array($validated['boardDirectors'])) {
                    foreach($validated['boardDirectors'] as $director)
                    {
                        $vendor_board = new VendorBoard();
                        $vendor_board->vendor_board_vendor_id = $vendor->id;
                        $vendor_board->vendor_board_name = $director['vendor_board_name'] ?? null;
                        $vendor_board->vendor_board_ic_num = $director['vendor_board_ic_num'] ?? null;
                        $vendor_board->vendor_board_phone_num = $director['vendor_board_phone_num'] ?? null;
                        $vendor_board->vendor_board_citizenship = $director['vendor_board_citizenship'] ?? null;
                        $vendor_board->vendor_board_ethnic = $director['vendor_board_ethnic'] ?? null;
                        $vendor_board->vendor_board_position = $director['vendor_board_position'] ?? null;
                        $vendor_board->vendor_board_address = $director['vendor_board_address'] ?? null;
                        $vendor_board->vendor_board_actual_outside_jobs = $director['vendor_board_actual_outside_jobs'] ?? null;
                        $vendor_board->save();
                    }
                }

                $vendor_active_cert = VendorCertificate::where('vendor_id', Auth::guard('vendor')->user()->id)->where('cert_status', 'approved')->where('created_at', '>=', now()->subYears(2))->where('created_at', '<=', now())->first();
                if($vendor_active_cert)
                {
                    $vendor_active_cert->cert_status = 'expired';
                    $vendor_active_cert->save();

                    // profile changed after approval invalidates the old application, so vendor must re-apply
                    VendorApplication::where('vendor_id', Auth::guard('vendor')->user()->id)
                        ->where('application_status', 'approved')
                        ->update(['application_status' => 'expired']);
                }

                DB::commit();
                
                return redirect()->route('vendor.dashboard')
                    ->with('success', 'Kemaskini berjaya disimpan!');
                    
            } catch (\Exception $e) {
                DB::rollBack();
                
                // $fileFields = [
                //     'vendor_bank_account_statement_address',
                //     'vendor_SSM_attachment_address',
                //     'vendor_MOF_attachment_address',
                //     'vendor_PKK_attachment_address',
                //     'vendor_CIDB_attachment_address',
                //     'vendor_MPOB_attachment_address'
                // ];
                
                // foreach ($fileFields as $field) {
                //     if (isset($validated[$field])) {
                //         Storage::disk('local')->delete($validated[$field]);
                //     }
                // }
                
                throw $e;
            }


        } catch (\Exception $e) {
            \Log::error('Validation/Processing error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            dd($e->getMessage());
            return redirect()->back()
                ->withErrors(['error' => $e->getMessage()])
                ->with('error', 'An error occurred while processing the transactions')
                ->withInput();
        }

    }

    public function submitVendorApplication(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'vendor_details_id' => 'required|string',
            'vendor_id' => 'required|string',
        ]);


        $vendor_details_json = json_encode(VendorDetails::find($validated['vendor_details_id']));
        // dd($vendor_details_json);

        $vendor_application = new VendorApplication();
        $vendor_application->vendor_details_id = $validated['vendor_details_id'];
        $vendor_application->vendor_id = $validated['vendor_id'];
        $vendor_application->application_date = now();
        $vendor_application->application_status = 'pending';
        $vendor_application->application_data_snapshot = $vendor_details_json;
        $vendor_application->save();
            // 'application_date',
            // 'application_status',
            // 'application_approved_rejected_date',
            // 'application_rejected_reason',
            // 'application_approved_rejected_by',
            // 'application_approved_remark',
            // 'application_cert_uuid',
            // 'application_cert_address',
            // 'application_data_snapshot',

        return redirect()->route('vendor.dashboard')->with('success', 'Vendor application submitted successfully!');
    }

    public function downloadVendorCert($vendor_id)
    {
        $vendor_cert = VendorCertificate::where('vendor_id', $vendor_id)->where('cert_status', 'approved')->where('created_at', '>=', now()->subYears(2))->where('created_at', '<=', now())->first();

        if($vendor_cert)
        {
            try{
                $vendor_cert = VendorCertificate::where('vendor_id', $vendor_id)->firstOrFail();
            
                $address = str_replace('app/private/', '', $vendor_cert->cert_pdf_address);

                
                if (!Storage::disk('local')->exists($address)) {
                    abort(404, 'Certificate file not found at: ' . $address);
                }
                // dd(Storage::disk('local')->download($address, 'vendor-certificate.pdf'));

                // return Storage::disk('local')->download('test.pdf');
                // return Storage::download('test.pdf');
                return Storage::disk('local')->download($address, 'vendor-certificate.pdf');
                
            } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
                abort(404, 'Vendor certificate record not found');
            } catch (\Exception $e) {
                \Log::error('Certificate download error:', [
                    'vendor_id' => $vendor_id,
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                abort(500, 'Error downloading certificate: ' . $e->getMessage());
            } 
        }
        else {
            abort(404, 'Vendor certificate not found or not approved');
        }
            
        

        // dd($vendor_id);
    }


    public function checkVendorCert($cert_id)
    {
        $certDetails = VendorCertificate::find($cert_id);

        return Inertia::render('Public/CheckCert', [
            'certExists' => $certDetails ? true : false,
            'cert_id' => $cert_id,
            'certDetails' => $certDetails,
        ]);
    }

    public function viewVendorProfile($vendor_id)
    {
        try {
                $vendor = Auth::guard('vendor')->user();
                
                $vendor_detail = VendorDetails::where('vendor_account_id','=',$vendor_id)->where('vendor_account_id','=',$vendor->id)->firstOrFail();
                $boardDirectors = VendorBoard::where('vendor_board_vendor_id','=',$vendor_id)->get();

                $bank_statements_attachment_url = isset($vendor_detail->vendor_bank_account_statement_address) 
                    ? URL::temporarySignedRoute('vendor.view-vendor.file', now()->addMinutes(30), ['path' => base64_encode($vendor_detail->vendor_bank_account_statement_address)]) 
                    : null;
                $MOF_attachment_url = isset($vendor_detail->vendor_MOF_attachment_address) 
                    ? URL::temporarySignedRoute('vendor.view-vendor.file', now()->addMinutes(30), ['path' => base64_encode($vendor_detail->vendor_MOF_attachment_address)]) 
                    : null;
                $CIDB_attachment_url = isset($vendor_detail->vendor_CIDB_attachment_address) 
                    ? URL::temporarySignedRoute('vendor.view-vendor.file', now()->addMinutes(30), ['path' => base64_encode($vendor_detail->vendor_CIDB_attachment_address)]) 
                    : null;
                $PKK_attachment_url = isset($vendor_detail->vendor_PKK_attachment_address) 
                    ? URL::temporarySignedRoute('vendor.view-vendor.file', now()->addMinutes(30), ['path' => base64_encode($vendor_detail->vendor_PKK_attachment_address)]) 
                    : null;
                $MPOB_attachment_url = isset($vendor_detail->vendor_MPOB_attachment_address)
                    ? URL::temporarySignedRoute('vendor.view-vendor.file', now()->addMinutes(30), ['path' => base64_encode($vendor_detail->vendor_MPOB_attachment_address)]) 
                    : null;
                $ssm_attachment_url = isset($vendor_detail->vendor_SSM_attachment_address)
                    ? URL::temporarySignedRoute('vendor.view-vendor.file', now()->addMinutes(30), ['path' => base64_encode($vendor_detail->vendor_SSM_attachment_address)]) 
                    : null;
                
                return Inertia::render('Vendor-Area/VendorViewProfile', [
                    'vendor_detail' => $vendor_detail,
                    // 'snapshot' => $snapshot,
                    'bank_statements_attachment_url' => $bank_statements_attachment_url,
                    'MOF_attachment_url' => $MOF_attachment_url,
                    'CIDB_attachment_url' => $CIDB_attachment_url,
                    'PKK_attachment_url' => $PKK_attachment_url,
                    'MPOB_attachment_url' => $MPOB_attachment_url,
                    'boardDirectors' => $boardDirectors,
                    'ssm_attachment_url' => $ssm_attachment_url,
                ]);
                    
            } catch (\Exception $e) {
            \Log::error('Validation/Processing error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            dd($e->getMessage());
            return redirect()->back()
                ->withErrors(['error' => $e->getMessage()])
                ->with('error', 'An error occurred while processing the transactions')
                ->withInput();
        }
    }

    public function serveVendorFile($path)
    {
        // Decode the file path
        $filePath = base64_decode($path);

        // dd($filePath);

        // Check if file exists in storage
        // dd(Storage::exists($filePath));
        if (!Storage::exists($filePath)) {
            abort(404, 'File not found.');
        }

        $file = Storage::disk('local')->get($filePath);
        $mimeType = Storage::disk('local')->mimeType($filePath);

        // return Storage::download($filePath);
        return response($file, 200)
        ->header('Content-Type', $mimeType)
        ->header('Content-Disposition', 'inline; filename="' . basename($filePath) . '"');
    }

        
}
