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


}

