<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class Vendor extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $keyType = 'string'; // Set the key type to UUID
    public $incrementing = false; // Disable auto-incrementing
   
    public static function booted()
    {
        static::creating(function($model)
        {
            $model->id = Str::uuid();
            // $model->is_active = '1';
        });
    }

    protected $fillable = [
        'vendor_email',
        'password',
        'vendor_type',
        'vendor_roc_number',
        'vendor_company_name',
        'vendor_contact_person',
        'vendor_contact_person_phone',
        'vendor_phone',
        'vendor_address',
        'is_active',
        'is_banned',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    // Tell Laravel to use vendor_email as the username field
    public function getAuthIdentifierName()
    {
        return 'vendor_email';
    }

    // Override the username method for authentication
    public function username()
    {
        return 'vendor_email';
    }
}
