<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function viewAdminUsers(): Response
    {

        $users = User::all();


        return Inertia::render('Admin/AdminUser/AdminUserView', [
            'users' => $users,
        ]);
    }
}
