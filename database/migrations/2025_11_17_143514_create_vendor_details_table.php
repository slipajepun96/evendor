<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vendor_details', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            $table->string('vendor_email');
            $table->string('vendor_type')->default('company');//individual, company, coopetative
            $table->string('vendor_roc_number')->nullable();
            $table->string('vendor_entity_number')->nullable();
            $table->string('vendor_nric_number')->nullable();
            $table->string('vendor_name');
            $table->string('vendor_contact_person');
            $table->string('vendor_contact_person_phone');
            $table->string('vemodr_contact_person_designation');
            $table->string('vendor_phone');
            $table->string('vendor_address');
            $table->string('vendor_bumiputera_status'); //bumiputera or non bumiputera
            $table->string('vendor_business_experience_year');
            $table->string('vendor_business_experience_month');
            $table->string('vendor_website')->nullable();
            $table->string('vendor_tax_identification_num')->nullable();
            $table->string('vendor_sst_number')->nullable();
            $table->string('vendor_establishment_date')->nullable();
            $table->string('vendor_authorised_capital')->nullable();
            $table->string('vendor_paid_up_capital')->nullable();
            $table->string('vendor_bumiputera_ownership_percent')->nullable();
            $table->string('vendor_non_bumiputera_ownership_percent')->nullable();
            $table->string('vendor_MOF_reg_num')->nullable();
            $table->string('vendor_MOF_start_date')->nullable();
            $table->string('vendor_MOF_expiry_date')->nullable();
            $table->string('vendor_MOF_attachment_address')->nullable();
            $table->string('vendor_SSM_start_date')->nullable();
            $table->string('vendor_SSM_expiry_date')->nullable();
            $table->string('vendor_SSM_attachment_address')->nullable();
            $table->string('vendor_PKK_reg_num')->nullable();
            $table->string('vendor_PKK_start_date')->nullable();
            $table->string('vendor_PKK_end_date')->nullable();
            $table->string('vendor_PKK_class')->nullable();
            $table->string('vendor_PKK_head')->nullable();
            $table->string('vendor_PKK_attachment_address')->nullable();
            $table->string('vendor_CIDB_reg_num')->nullable();
            $table->string('vendor_CIDB_start_date')->nullable();
            $table->string('vendor_CIDB_end_date')->nullable();
            $table->string('vendor_CIDB_B_cat_grade')->nullable();
            $table->string('vendor_CIDB_CE_cat_grade')->nullable();
            $table->string('vendor_CIDB_ME_cat_grade')->nullable();
            $table->string('vendor_CIDB_attachment_address')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendor_details');
    }
};
