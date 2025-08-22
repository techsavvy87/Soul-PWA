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
        Schema::create('paypal_plans', function (Blueprint $table) {
            $table->id();
            $table->string('product_id')->unique();
            $table->string('plan_id')->unique();
            $table->string('name');
            $table->string('description');
            $table->string('status');
            $table->decimal('price', 10, 2);
            $table->string('interval_unit');
            $table->integer('interval_count');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paypal_plans');
    }
};