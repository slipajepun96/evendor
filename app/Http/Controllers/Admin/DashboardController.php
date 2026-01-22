<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use App\Models\Vendor;
use App\Models\VendorDetails;
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

class DashboardController extends Controller
{
    public function adminDashboard(): Response
    {

        $unapproved_vendors = VendorDetails::where('is_approved','0')->where('is_active', '1')->get();
        $approved_vendors = VendorDetails::where('is_approved','1')->where('is_active', '1')->get();
        
        return Inertia::render('Dashboard', [
            'unapproved_vendors' => $unapproved_vendors,
            'approved_vendors' => $approved_vendors,
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
                        Storage::disk('public')->delete($vendor->vendor_bank_account_statement_address);
                    }
                    $validated['vendor_bank_account_statement_address'] = $request->file('vendor_bank_account_statement_address')
                        ->store('vendor/bank_statements', 'public');
                }

                if ($request->hasFile('vendor_MOF_attachment_address')) {
                    if ($vendor->vendor_MOF_attachment_address) {
                        Storage::disk('public')->delete($vendor->vendor_MOF_attachment_address);
                    }
                    $validated['vendor_MOF_attachment_address'] = $request->file('vendor_MOF_attachment_address')
                        ->store('vendor/mof_certificates', 'public');
                }

                if ($request->hasFile('vendor_PKK_attachment_address')) {
                    if ($vendor->vendor_PKK_attachment_address) {
                        Storage::disk('public')->delete($vendor->vendor_PKK_attachment_address);
                    }
                    $validated['vendor_PKK_attachment_address'] = $request->file('vendor_PKK_attachment_address')
                        ->store('vendor/pkk_certificates', 'public');
                }

                if ($request->hasFile('vendor_CIDB_attachment_address')) {
                    if ($vendor->vendor_CIDB_attachment_address) {
                        Storage::disk('public')->delete($vendor->vendor_CIDB_attachment_address);
                    }
                    $validated['vendor_CIDB_attachment_address'] = $request->file('vendor_CIDB_attachment_address')
                        ->store('vendor/cidb_certificates', 'public');
                }

                if ($request->hasFile('vendor_MPOB_attachment_address')) {
                    if ($vendor->vendor_MPOB_attachment_address) {
                        Storage::disk('public')->delete($vendor->vendor_MPOB_attachment_address);
                    }
                    $validated['vendor_MPOB_attachment_address'] = $request->file('vendor_MPOB_attachment_address')
                        ->store('vendor/mpob_licenses', 'public');
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
                        Storage::disk('public')->delete($validated[$field]);
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
}

