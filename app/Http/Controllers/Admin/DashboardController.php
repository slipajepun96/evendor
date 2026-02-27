<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use App\Models\Vendor;
use App\Models\VendorDetails;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\VendorCertificate;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
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

    public function viewVendorDetails($vendor_id): Response
    {
        // dd($vendor_id);
        $vendor = VendorCertificate::where('vendor_id', $vendor_id)->first();
        // dd($vendor);

        if (!$vendor) {
            abort(404);
        }

        // Decode the JSON snapshot
        $snapshot = json_decode($vendor->cert_data_snapshot, true);
        // dd($snapshot);
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

        return Inertia::render('Admin/Vendor/VendorView', [
            'vendor' => $vendor,
            'snapshot' => $snapshot,
            'bank_statements_attachment_url' => $bank_statements_attachment_url,
            'MOF_attachment_url' => $MOF_attachment_url,
            'CIDB_attachment_url' => $CIDB_attachment_url,
            'PKK_attachment_url' => $PKK_attachment_url,
            'MPOB_attachment_url' => $MPOB_attachment_url,
        ]);
        
    }


}

