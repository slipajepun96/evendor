<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\VendorProcessController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'adminDashboard'])->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/vendor/view/{vendor_id}', [DashboardController::class, 'viewVendorDetails'])->name('vendor.view');

    //vendor verification
    Route::get('/vendor-approval', [VendorProcessController::class, 'showVendorApprovalPage'])->name('vendor-approval.index');
    Route::get('/vendor-approval/view/{vendor_id}', [VendorProcessController::class, 'showVendorApprovalView'])->name('vendor-approval.view');
    Route::post('/vendor-approval/approve', [VendorProcessController::class, 'approveVendor'])->name('vendor-approval.approve');
    Route::get('/vendor-approval/test-approve-pdf', [VendorProcessController::class, 'approveVendorTest'])->name('vendor-approval.test-approve-pdf');
    Route::get('/vendor-approval/file/{path}', [VendorProcessController::class, 'serveVendorFile'])->middleware('signed')->name('admin.vendor.file');

});

//vendor
Route::middleware('vendor')->group(function () {
    Route::get('/vendor', [VendorController::class, 'vendorDashboard'])->name('vendor.dashboard');
    Route::post('/vendor/submit-application', [VendorController::class, 'submitVendorApplication'])->name('vendor.submit-application');

    Route::get('/vendor/cert/{vendor_id}', [VendorController::class, 'downloadVendorCert'])->name('vendor.download-cert');

    //form
    Route::get('/vendor/complete-registration', [VendorController::class, 'showVendorCompleteRegistrationForm'])->name('vendor.complete-registration');
    Route::post('/vendor/complete-registration', [VendorController::class, 'saveVendorCompleteRegistrationForm'])->name('vendor.complete-registration.save');
});

require __DIR__.'/auth.php';
