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
        Schema::create('plan_subscriptions', function (Blueprint $table) {
            $table->id();
            // Foreign key to users table
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // Foreign key to PayPal plans table
            $table->unsignedBigInteger('plan_id');
            $table->foreign('plan_id')->references('id')->on('paypal_plans')->onDelete('cascade');

            // PayPal subscription ID
            $table->string('paypal_subscription_id')->unique();
            $table->string('status');
            // Subscription start and end timestamps
            $table->timestamp('subscribed_at')->useCurrent();
            $table->timestamp('current_period_end')->nullable();

            $table->timestamps(); // created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plan_subscriptions');
    }
};