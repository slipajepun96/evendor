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
        Schema::create('vendor_applications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            $table->foreignUuid('vendor_details_id')->constrained('vendor_details')->onDelete('cascade');
            $table->string('application_date');
            $table->string('application_status')->default('pending');
            $table->string('application_approved_rejected_date')->nullable();
            $table->string('application_rejected_reason')->nullable();
            $table->string('application_approved_rejected_by')->nullable();
            $table->string('application_approved_remark')->nullable();
            $table->string('application_cert_uuid')->nullable();
            $table->string('application_cert_address')->nullable();
            $table->json('application_data_snapshot')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendor_applications');
    }
};
