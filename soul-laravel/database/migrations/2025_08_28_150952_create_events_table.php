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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->string('img_url');
            $table->enum('level', ['Free', 'Paid'])->default('Free');
            $table->string('scroll_sort')->nullable();
            $table->json('free_decks_id')->nullable();
            $table->json('paid_com_decks_id')->nullable();
            $table->integer('paid_com_cards_cnt')->nullable();
            $table->json('paid_indi_decks_id')->nullable();
            $table->integer('add_cards_cnt')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};