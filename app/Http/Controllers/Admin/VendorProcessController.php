<?php

namespace App\Http\Controllers\Admin;

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
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\LaravelPdf\Facades\Pdf;
use function Spatie\LaravelPdf\Support\pdf;
use Spatie\LaravelPdf\Enums\Format;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

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
        // dd($request->all());
        $validated = $request->validate([
            'vendor_application_id' => 'required|exists:vendor_applications,id',
            'application_status' => 'required|in:approved,rejected',
        ]);

        // dd($validated);

        $application = VendorApplication::findOrFail($validated['vendor_application_id']);
        $application->application_status = $validated['application_status'];
        $application->application_approved_rejected_by = Auth::id();
        $application->application_approved_rejected_date = now();
        $application->save();
        // dd($application->vendor_id);

        $vendor_detail = VendorDetails::where('vendor_account_id', $application->vendor_id)->firstOrFail();
        $vendor_detail->is_approved = match($application->application_status) {
            'approved' => 1,
            'rejected' => 2,
        };
        $vendor_detail->save();

        $vendor_details_json = json_encode(VendorDetails::find($vendor_detail->id));

        //generate cert
        $certificate = new VendorCertificate();
        $certificate->vendor_id = $application->vendor_id;
        $certificate->cert_start_date = now()->toDateString();
        $certificate->cert_end_date = now()->addYear(2)->toDateString();
        $certificate->cert_validity_period = '2';
        $certificate->cert_data_snapshot = $application->application_data_snapshot;
        $certificate->cert_status = 'approved';
        
        $certificate->save();

        // dd($certificate->id);

        //cert area
       

        try {
            //generate and save pdf
            $vendor_json = json_decode($certificate->cert_data_snapshot, true);
            $cert_url = "https://evendor.on-pasb.com/v/cert/" . $certificate->id;
            $qrCode = QrCode::size(100)->generate($cert_url);
            
            // save pdf to private/vendor/certificates/
            $pdfPath = 'app/private/vendor/certificates/' . $certificate->id . '.pdf';
            
            // Ensure directory exists
            $directory = storage_path('app/private/vendor/certificates');
            if (!file_exists($directory)) {
                mkdir($directory, 0755, true);
            }

            Pdf::view('pdf.vendor_cert', ['certificate' => $certificate, 'vendor_json' => $vendor_json, 'qrCode' => $qrCode])->format(Format::A4)->save(storage_path($pdfPath));

            //save path
            $cert = VendorCertificate::findOrFail($certificate->id);
            $cert->cert_pdf_address = $pdfPath;
            $cert->save();



        } catch (\Exception $e) {
            // Handle PDF generation errors
            return redirect()->route('vendor-approval.index')->with('error', 'Failed to generate certificate PDF: ' . $e->getMessage());
        }



        return redirect()->route('vendor-approval.index')->with('success', 'Vendor status updated successfully.');
    }

    public function approveVendorTest()
    {
        $certificate = VendorCertificate::first();
        $vendor_json = json_decode($certificate->cert_data_snapshot, true);
        $cert_url = "https://evendor.on-pasb.com/v/cert/" . $certificate->id;
        $qrCode = QrCode::size(100)->generate($cert_url);
        return pdf()
        ->view('pdf.vendor_cert', ['certificate' => $certificate, 'vendor_json' => $vendor_json, 'qrCode' => $qrCode])
        ->format(Format::A4)
        ->name('vendor_certificate.pdf');


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
