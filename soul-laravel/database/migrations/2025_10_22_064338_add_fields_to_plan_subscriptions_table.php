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
        Schema::table('plan_subscriptions', function (Blueprint $table) {
            $table->dateTime('plan_started_date')->nullable()->after('paypal_subscription_id');
            $table->dateTime('plan_ended_date')->nullable()->after('plan_started_date');
            $table->enum('subscription_status', ['trial', 'free', 'monthly', 'annual'])->default('trial')->after('plan_ended_date');
            $table->dateTime('last_verified_at')->nullable()->after('subscription_status');
            $table->string('plan_status')->nullable()->after('last_verified_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plan_subscriptions', function (Blueprint $table) {
            //
        });
    }
};