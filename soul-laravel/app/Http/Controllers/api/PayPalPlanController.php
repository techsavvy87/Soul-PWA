<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PaypalPlan;
use App\Models\PlanSubscription;
use Carbon\Carbon;

class PayPalPlanController extends Controller
{
    public function getPlans(Request $request)
    {
        $plans = PaypalPlan::where('status', 'ACTIVE')->get();
        return response()->json([
            'status' => true,
            'message' => 'Plans retrieved successfully',
            'result' => $plans
        ]);
    }

    // Save subscription after PayPal approval
    public function storeSubscription(Request $request)
    {
        $request->validate([
            'subscription_id' => 'required|string',
            'status' => 'required|string',
            'plan_id' => 'required|integer',
            'period_start' => 'required|date',
            'period_end' => 'required|date',
        ]);

        $plan = PaypalPlan::where('plan_id', $request->plan_id)->first();

        $subscription = PlanSubscription::create([
            'user_id' => auth()->id(),
            'paypal_subscription_id' => $request->subscription_id,
            'plan_id' => $request->plan_id,
            'status' => $request->status,
            'subscribed_at' => Carbon::parse($request->period_start),
            'current_period_end' => Carbon::parse($request->period_end),
        ]);
        
        return response()->json([
            'success' => true,
            'subscription' => $subscription,
        ]);
    }
}