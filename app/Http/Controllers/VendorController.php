<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use App\Models\Vendor;
use App\Models\VendorDetails;
use App\Models\VendorApplication;
use App\Models\VendorCertificate;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class VendorController extends Controller
{
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
            'vendor_email' => 'The provided credentials do not match our records.',
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

        return Inertia::render('Vendor/VendorDashboard', [
            'vendor' => $vendor,
            'vendor_details' => $vendor_details,
            'vendor_applications' => $vendor_applications,
        ]);
    }

    public function showVendorCompleteRegistrationForm(): Response
    {
        return Inertia::render('Vendor/Form/VendorCompleteRegistrationForm');
    }

    public function saveVendorCompleteRegistrationForm(Request $request): RedirectResponse
    {
        $vendor = Auth::guard('vendor')->user()->id;
        // dd($vendor);
        try {
            $validated = $request->validate([
                'vendor_type' => 'required|string',
                'vendor_company_type' => 'nullable|string',
                'vendor_id_num' => 'required|string',//no syarikat etc
                'vendor_email' => 'required|string|email',
                'vendor_name' => 'required|string',
                'vendor_contact_person' => 'required|string',
                'vendor_contact_person_phone' => 'required|numeric',
                'vendor_contact_person_designation' => 'required|string',
                'vendor_phone' => 'required|string',
                'vendor_address' => 'required|string',
                'vendor_website' => 'nullable|string',
                'vendor_tax_identification_num' => 'nullable|string',
                'vendor_sst_number' => 'nullable|string',
                'vendor_establishment_date' => 'required|date',
                'vendor_capital_1' => 'nullable|numeric',
                'vendor_capital_2' => 'nullable|numeric',
                'vendor_bumiputera_ownership_percent' => 'nullable|numeric|max:100',
                'vendor_non_bumiputera_ownership_percent' => 'nullable|numeric|max:100',
                'vendor_SSM_start_date' => 'nullable|date',
                'vendor_SSM_expiry_date' => 'nullable|date',
                'vendor_SSM_attachment_address' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
                'vendor_bank_name' => 'required|string',
                'vendor_bank_account_number' => 'required|string',
                'vendor_bank_entity_registration_num' => 'nullable|string',
                'vendor_bank_account_statement_address' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
                'vendor_MOF_reg_num' => 'nullable|string',
                'vendor_MOF_start_date' => 'nullable|date',
                'vendor_MOF_expiry_date' => 'nullable|date',
                'vendor_MOF_attachment_address' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
                'vendor_PKK_reg_num' => 'nullable|string',
                'vendor_PKK_start_date' => 'nullable|date',
                'vendor_PKK_end_date' => 'nullable|date',
                'vendor_PKK_class' => 'nullable|string',
                'vendor_PKK_head' => 'nullable|string',
                'vendor_PKK_attachment_address' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
                'vendor_CIDB_reg_num' => 'nullable|string',
                'vendor_CIDB_start_date' => 'nullable|date',
                'vendor_CIDB_end_date' => 'nullable|date',
                'vendor_CIDB_B_cat_grade' => 'nullable|string',
                'vendor_CIDB_CE_cat_grade' => 'nullable|string',
                'vendor_CIDB_ME_cat_grade' => 'nullable|string',
                'vendor_CIDB_attachment_address' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
                'vendor_MPOB_license_num' => 'nullable|string',
                'vendor_MPOB_start_date' => 'nullable|date',
                'vendor_MPOB_end_date' => 'nullable|date',
                'vendor_MPOB_license_category' => 'nullable|string',
                'vendor_MPOB_attachment_address' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
                'boardDirectors' => 'nullable|array',
            ]);
            

            DB::beginTransaction();
            
            try {
                $vendor = Auth::guard('vendor')->user();
                // dd($vendor);
                
                // Handle file uploads
                if ($request->hasFile('vendor_bank_account_statement_address')) {
                    // Delete old file if exists
                    if ($vendor->vendor_bank_account_statement_address) {
                        Storage::disk('local')->delete($vendor->vendor_bank_account_statement_address);
                    }
                    $validated['vendor_bank_account_statement_address'] = $request->file('vendor_bank_account_statement_address')
                        ->store('vendor/bank_statements', 'local');
                }

                if ($request->hasFile('vendor_MOF_attachment_address')) {
                    if ($vendor->vendor_MOF_attachment_address) {
                        Storage::disk('local')->delete($vendor->vendor_MOF_attachment_address);
                    }
                    $validated['vendor_MOF_attachment_address'] = $request->file('vendor_MOF_attachment_address')
                        ->store('vendor/mof_certificates', 'local');
                }

                if ($request->hasFile('vendor_PKK_attachment_address')) {
                    if ($vendor->vendor_PKK_attachment_address) {
                        Storage::disk('local')->delete($vendor->vendor_PKK_attachment_address);
                    }
                    $validated['vendor_PKK_attachment_address'] = $request->file('vendor_PKK_attachment_address')
                        ->store('vendor/pkk_certificates', 'local');
                }

                if ($request->hasFile('vendor_CIDB_attachment_address')) {
                    if ($vendor->vendor_CIDB_attachment_address) {
                        Storage::disk('local')->delete($vendor->vendor_CIDB_attachment_address);
                    }
                    $validated['vendor_CIDB_attachment_address'] = $request->file('vendor_CIDB_attachment_address')
                        ->store('vendor/cidb_certificates', 'local');
                }

                if ($request->hasFile('vendor_MPOB_attachment_address')) {
                    if ($vendor->vendor_MPOB_attachment_address) {
                        Storage::disk('local')->delete($vendor->vendor_MPOB_attachment_address);
                    }
                    $validated['vendor_MPOB_attachment_address'] = $request->file('vendor_MPOB_attachment_address')
                        ->store('vendor/mpob_licenses', 'local');
                }

                //add vendor details

                $vendor_details = new VendorDetails();
                $vendor_details->vendor_type = $validated['vendor_type'];
                $vendor_details->vendor_company_type = $validated['vendor_company_type'];
                $vendor_details->vendor_id_num = $validated['vendor_id_num'];
                $vendor_details->vendor_name = $validated['vendor_name'];
                $vendor_details->vendor_email = $validated['vendor_email'];
                $vendor_details->vendor_contact_person = $validated['vendor_contact_person'];
                $vendor_details->vendor_contact_person_phone = $validated['vendor_contact_person_phone'];
                $vendor_details->vendor_contact_person_designation = $validated['vendor_contact_person_designation'];
                $vendor_details->vendor_phone = $validated['vendor_phone'];
                $vendor_details->vendor_address = $validated['vendor_address'];
                $vendor_details->vendor_website = $validated['vendor_website'];
                $vendor_details->vendor_tax_identification_num = $validated['vendor_tax_identification_num'];
                $vendor_details->vendor_sst_number = $validated['vendor_sst_number'];
                $vendor_details->vendor_establishment_date = $validated['vendor_establishment_date'];
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

                // update vendor
                // $vendor->update($validated);

                // Handle board directors
                // if (isset($validated['boardDirectors']) && is_array($validated['boardDirectors'])) {
                //     // Delete existing directors
                //     $vendor->boardDirectors()->delete();
                    
                //     // Create new directors
                //     foreach ($validated['boardDirectors'] as $director) {
                //         $vendor->boardDirectors()->create($director);
                //     }
                // }

                DB::commit();
                
                return redirect()->route('vendor.dashboard')
                    ->with('success', 'Registration completed successfully!');
                    
            } catch (\Exception $e) {
                DB::rollBack();
                
                // Delete uploaded files on error
                $fileFields = [
                    'vendor_bank_account_statement_address',
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
        if($vendor_id && VendorApplication::where('vendor_id', $vendor_id)
            ->where('application_status', 'approved')
            ->where('created_at', '>=', now()->subYears(2))
            ->where('created_at', '<=', now())
            ->exists())
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
            dd('Vendor application not approved or does not exist');
        }
            
        

        // dd($vendor_id);
    }

        
}
