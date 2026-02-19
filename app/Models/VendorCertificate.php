<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class VendorCertificate extends Model
{
    use HasFactory, Notifiable;

    protected $keyType = 'string'; // Set the key type to UUID
    public $incrementing = false; // Disable auto-incrementing
   
    public static function booted()
    {
        static::creating(function($model)
        {
            $model->id = Str::uuid();
        });
    }

    protected $fillable = [
            'vendor_id',
            'cert_start_date',
            'cert_end_date',
            'cert_validity_period',
            'cert_data_snapshot',
            'cert_pdf_address',
            'cert_status',
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
