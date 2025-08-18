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
        Schema::create('deck_card_categories', function (Blueprint $table) {
            $table->id();
            $table->string('cname');
            $table->enum('level', ['Free', 'Paid'])->default('Free');
            $table->string('info_img')->nullable();
            $table->string('info_title');
            $table->text('info_description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deck_card_categories');
    }
};