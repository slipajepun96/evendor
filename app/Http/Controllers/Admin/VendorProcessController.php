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

class VendorProcessController extends Controller
{
    public function showVendorApprovalPage(): Response
    {
        $unapproved_vendors = VendorDetails::where('is_approved', '0')->get();

        return Inertia::render('Admin/VendorApproval/VendorApprovalIndex', [
            'unapproved_vendors' => $unapproved_vendors,
            // 'status' => session('status'),
        ]);
    }

    public function showVendorApprovalView($vendor_id): Response
    {
        
            $unapproved_vendor = VendorDetails::where('id', $vendor_id)
                ->where('is_approved', '0')
                ->first();

            $approved_vendor = VendorDetails::where('id', $vendor_id)
                ->where('is_approved', '1')
                ->first();

            if (!$unapproved_vendor) {
                abort(404);
            }

            $bank_statements_attachment_url = $unapproved_vendor->vendor_bank_account_statement_address 
                ? Storage::url($unapproved_vendor->vendor_bank_account_statement_address) 
                : null;
            $MOF_attachment_url = $unapproved_vendor->vendor_MOF_attachment_address 
                ? Storage::url($unapproved_vendor->vendor_MOF_attachment_address) 
                : null;
            $CIDB_attachment_url = $unapproved_vendor->vendor_CIDB_attachment_address 
                ? Storage::url($unapproved_vendor->vendor_CIDB_attachment_address) 
                : null;
            $PKK_attachment_url = $unapproved_vendor->vendor_PKK_attachment_address 
                ? Storage::url($unapproved_vendor->vendor_PKK_attachment_address) 
                : null;
            $MPOB_attachment_url = $unapproved_vendor->vendor_MPOB_attachment_address 
                ? Storage::url($unapproved_vendor->vendor_MPOB_attachment_address) 
                : null;

            return Inertia::render('Admin/VendorApproval/VendorApprovalView', [
                'unapproved_vendor' => $unapproved_vendor,
                'approved_vendor' => $approved_vendor,
                'bank_statements_attachment_url' => $bank_statements_attachment_url,
                'MOF_attachment_url' => $MOF_attachment_url,
                'CIDB_attachment_url' => $CIDB_attachment_url,
                'PKK_attachment_url' => $PKK_attachment_url,
                'MPOB_attachment_url' => $MPOB_attachment_url,
            ]);
       
    }

    public function approveVendor(Request $request) 
    {
        $validated = $request->validate([
            'vendor_id' => 'required|exists:vendor_details,id',
            'status' => 'required|in:approved,rejected',
        ]);

        $vendor = VendorDetails::findOrFail($validated['vendor_id']);
        if($validated['status'] === 'approved')
        {
            $vendor->is_approved = 1 ;
        } else if($validated['status'] === 'rejected') 
        {
            $vendor->is_approved = 2 ;
        }

        $vendor->save();
        return redirect()->route('vendor-approval.index')->with('success', 'Vendor status updated successfully.');
    }
        
}
