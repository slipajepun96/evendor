<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class ProcurementList extends Model
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
            'procurement_title',
            'procurement_type',
            'procurement_description',
            'procurement_pdf_address',
            'procurement_open_date',
            'procurement_close_date',
            'procurement_status',
    ];
}
