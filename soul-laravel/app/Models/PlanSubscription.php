<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanSubscription extends Model
{
    protected $fillable = [
        'user_id',
        'plan_id',
        'paypal_subscription_id',
        'subscribed_at',
        'current_period_end',
        'status'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function plan() {
        return $this->belongsTo(PaypalPlan::class, 'plan_id');
    }
}