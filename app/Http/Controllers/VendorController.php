<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use App\Models\Vendor;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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
        return Inertia::render('Vendor/VendorDashboard');
    }

    public function showVendorCompleteRegistrationForm(): Response
    {
        return Inertia::render('Vendor/Form/VendorCompleteRegistrationForm');
    }
}
