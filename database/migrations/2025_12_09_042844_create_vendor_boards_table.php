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
        Schema::create('vendor_boards', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            $table->string('vendor_board_vendor_id');
            $table->string('vendor_board_name');
            $table->string('vendor_board_ic_num');
            $table->string('vendor_board_phone_num')->nullable();
            $table->string('vendor_board_citizenship')->nullable();
            $table->string('vendor_board_ethnic')->nullable();
            $table->string('vendor_board_position')->nullable();
            $table->string('vendor_board_address')->nullable();
            $table->string('is_active')->default('1');
            $table->string('date_appointed')->nullable();
            $table->string('date_removed')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendor_boards');
    }
};
