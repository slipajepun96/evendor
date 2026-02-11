<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class VendorApplication extends Model
{
    use HasFactory, Notifiable;

    protected $keyType = 'string'; // Set the key type to UUID
    public $incrementing = false; // Disable auto-incrementing
   
    public static function booted()
    {
        static::creating(function($model)
        {
            $model->id = Str::uuid();
            $model->application_status = 'pending';
        });
    }

    protected $fillable = [
            'vendor_account_id',
            'vendor_id',
            'application_date',
            'application_status',
            'application_approved_rejected_date',
            'application_rejected_reason',
            'application_approved_rejected_by',
            'application_approved_remark',
            'application_cert_uuid',
            'application_cert_address',
            'application_data_snapshot',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'application_data_snapshot' => 'array',
        ];
    }


}


