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
        // The 'favorites' table stores the relationship between users and cards they have favorited.
        // Each favorite links a user (user_id) to a card (card_id), with cascading deletes to maintain referential integrity.
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users', 'id')->onDelete('cascade');
            $table->foreignId('card_id')->constrained('deck_cards', 'id')->onDelete('cascade');
            $table->string('type'); // Added column for favorite type (e.g., 'card' or 'reading')
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};