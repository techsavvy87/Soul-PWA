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
            $table->dropColumn('status');
            $table->dropColumn('subscribed_at');
            $table->dropColumn('current_period_end');
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