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
        Schema::create('vendor_certificates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            $table->foreignUuid('vendor_id')->constrained('vendors')->onDelete('cascade');
            $table->string('cert_start_date');
            $table->string('cert_end_date');
            $table->string('cert_validity_period');
            $table->json('cert_data_snapshot');
            $table->string('cert_pdf_address')->nullable();
            $table->string('cert_status')->default('approved'); //can be approved, revoked, expired
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendor_certificates');
    }
};
