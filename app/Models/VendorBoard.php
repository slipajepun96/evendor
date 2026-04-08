<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class VendorBoard extends Model
{
    use HasFactory, Notifiable;
    
    protected $keyType = 'string'; // Set the key type to UUID
    public $incrementing = false; // Disable auto-incrementing
   
    public static function booted()
    {
        static::creating(function($model)
        {
            $model->id = Str::uuid();
            $model->is_active = '1';
        });
    }

    protected $fillable = [
            'vendor_board_vendor_id',
            'vendor_board_name',
            'vendor_board_ic_num',
            'vendor_board_phone_num',
            'vendor_board_citizenship',
            'vendor_board_ethnic',
            'vendor_board_position',
            'vendor_board_address',
            'vendor_board_actual_outside_jobs',
            'is_active',
            'date_appointed',
            'date_removed',
    ];
}
