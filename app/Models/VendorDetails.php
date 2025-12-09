<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class VendorDetails extends Model
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
            'vendor_email',
            'vendor_type',
            'vendor_roc_number',
            'vendor_entity_number',
            'vendor_nric_number',
            'vendor_company_name',
            'vendor_contact_person',
            'vendor_contact_person_phone',
            'vemodr_contact_person_designation',
            'vendor_phone',
            'vendor_address',
            'vendor_bumiputera_status',
            'vendor_business_experience_year',
            'vendor_business_experience_month',
            'vendor_website',
            'vendor_tax_identification_num',
            'vendor_sst_number',
            'vendor_establishment_date',
            'vendor_authorised_capital',
            'vendor_paid_up_capital',
            'vendor_bumiputera_ownership_percent',
            'vendor_non_bumiputera_ownership_percent',
            'vendor_MOF_reg_num',
            'vendor_MOF_start_date',
            'vendor_MOF_expiry_date',
            'vendor_MOF_attachment_address',
            'vendor_SSM_start_date',
            'vendor_SSM_expiry_date',
            'vendor_SSM_attachment_address',
            'vendor_PKK_reg_num',
            'vendor_PKK_start_date',
            'vendor_PKK_end_date',
            'vendor_PKK_class',
            'vendor_PKK_head',
            'vendor_PKK_attachment_address',
            'vendor_CIDB_reg_num',
            'vendor_CIDB_start_date',
            'vendor_CIDB_end_date',
            'vendor_CIDB_B_cat_grade',
            'vendor_CIDB_CE_cat_grade',
            'vendor_CIDB_ME_cat_grade',
            'vendor_CIDB_attachment_address',
    ];
}