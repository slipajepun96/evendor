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
        Schema::create('procurement_lists', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            $table->string('procurement_title');
            $table->string('procurement_type')->default('tender'); //tender ataupun sebutharga
            $table->string('procurement_description')->nullable();
            $table->string('procurement_pdf_address')->nullable();
            $table->string('procurement_open_date');
            $table->string('procurement_close_date');
            $table->string('procurement_status')->default('running'); //running / closed / cancelled
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('procurement_list');
    }
};
