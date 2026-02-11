<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use App\Models\Vendor;
use App\Models\VendorDetails;
use App\Models\VendorApplication;
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

class VendorProcessController extends Controller
{
    public function showVendorApprovalPage(): Response
    {

        $unapproved_vendors = VendorApplication::where('application_status', 'pending')->get();
        // dd($unapproved_vendors);

        return Inertia::render('Admin/VendorApproval/VendorApprovalIndex', [
            'unapproved_vendors' => $unapproved_vendors,
            // 'status' => session('status'),
        ]);
    }

    public function showVendorApprovalView($vendor_id): Response
    {
        // dd($vendor_id);
        
            $unapproved_vendor = VendorApplication::where('vendor_id', $vendor_id)->first();
            // dd($unapproved_vendor);

            if (!$unapproved_vendor) {
                abort(404);
            }

            // Decode the JSON snapshot
            $snapshot = json_decode($unapproved_vendor->application_data_snapshot, true);
            // dd($snapshot['vendor_bank_account_statement_address']);

            // Debug to check data
            // dd($snapshot['vendor_name']);

            // Create signed temporary URLs (valid for 30 minutes)
            $bank_statements_attachment_url = isset($snapshot['vendor_bank_account_statement_address']) 
                ? URL::temporarySignedRoute('admin.vendor.file', now()->addMinutes(30), ['path' => base64_encode($snapshot['vendor_bank_account_statement_address'])]) 
                : null;
            $MOF_attachment_url = isset($snapshot['vendor_MOF_attachment_address']) 
                ? URL::temporarySignedRoute('admin.vendor.file', now()->addMinutes(30), ['path' => base64_encode($snapshot['vendor_MOF_attachment_address'])]) 
                : null;
            $CIDB_attachment_url = isset($snapshot['vendor_CIDB_attachment_address']) 
                ? URL::temporarySignedRoute('admin.vendor.file', now()->addMinutes(30), ['path' => base64_encode($snapshot['vendor_CIDB_attachment_address'])]) 
                : null;
            $PKK_attachment_url = isset($snapshot['vendor_PKK_attachment_address']) 
                ? URL::temporarySignedRoute('admin.vendor.file', now()->addMinutes(30), ['path' => base64_encode($snapshot['vendor_PKK_attachment_address'])]) 
                : null;
            $MPOB_attachment_url = isset($snapshot['vendor_MPOB_attachment_address'])
                ? URL::temporarySignedRoute('admin.vendor.file', now()->addMinutes(30), ['path' => base64_encode($snapshot['vendor_MPOB_attachment_address'])]) 
                : null;
            
                // dd($MPOB_attachment_url);

            return Inertia::render('Admin/VendorApproval/VendorApprovalView', [
                'unapproved_vendor' => $unapproved_vendor,
                'snapshot' => $snapshot,
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
