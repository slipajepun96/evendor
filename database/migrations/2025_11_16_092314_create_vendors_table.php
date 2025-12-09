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
        Schema::create('vendors', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            $table->string('vendor_email');
            $table->string('password');
            $table->string('vendor_type')->default('company');//individual, company, coopetative
            $table->string('vendor_roc_number')->nullable();
            $table->string('vendor_name');
            $table->string('vendor_contact_person');
            $table->string('vendor_contact_person_phone');
            $table->string('vendor_phone');
            $table->string('vendor_address');
            $table->string('is_active')->default('yes');
            $table->string('is_banned')->default('no');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendors');
    }
};
