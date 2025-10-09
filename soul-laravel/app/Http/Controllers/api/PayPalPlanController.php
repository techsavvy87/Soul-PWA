<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PaypalPlan;
use App\Models\PlanSubscription;
use Carbon\Carbon;
use App\Services\PayPalService;

class PayPalPlanController extends Controller
{
    protected $paypal;

    public function __construct(PayPalService $paypal)
    {
        $this->paypal = $paypal;
    }
    
    public function getPlans(Request $request)
    {
        $plans = PaypalPlan::where('status', 'ACTIVE')->orderBy('name')->get();
        foreach ($plans as $plan) {
            $existingSubscription = PlanSubscription::where('user_id', auth()->id())
                ->where('plan_id', $plan->id)
                ->where('current_period_end', '>', now())
                ->first();
                
            if ($existingSubscription) {
                $plan->is_subscribed = true;
                $plan->subscription_id = $existingSubscription->paypal_subscription_id;
            } else {
                $plan->is_subscribed = false;
                $plan->subscription_id = null;
            }
        }
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
        
        // Check if a subscription already exists for this user and plan
        $existing = PlanSubscription::where('user_id', auth()->id())
            ->where('plan_id', $request->plan_id)
            ->first();

        if ($existing) {
            // Update the existing subscription
            $existing->update([
            'paypal_subscription_id' => $request->subscription_id,
            'status' => $request->status,
            'subscribed_at' => Carbon::parse($request->period_start),
            'current_period_end' => Carbon::parse($request->period_end),
            ]);
            $subscription = $existing;
        } else {
            // Create a new subscription
            $subscription = PlanSubscription::create([
            'user_id' => auth()->id(),
            'paypal_subscription_id' => $request->subscription_id,
            'plan_id' => $request->plan_id,
            'status' => $request->status,
            'subscribed_at' => Carbon::parse($request->period_start),
            'current_period_end' => Carbon::parse($request->period_end),
            ]);
        }
        
        return response()->json([
            'success' => true,
            'subscription' => $subscription,
        ]);
    }

    public function cancelSubscription(Request $request)
    {
        $request->validate([
            'subscription_id' => 'required|string',
        ]);

        try {
            $success = $this->paypal->cancelSubscription($request->subscription_id);

            if ($success) {
                // 2️⃣ Delete subscription record from database
                PlanSubscription::where('paypal_subscription_id', $request->subscription_id)->delete();

                return response()->json([
                    'status' => true,
                    'message' => 'Subscription canceled successfully.',
                    'result' => null,
                ], 200);
            } else {
                return response()->json(['message' => 'Failed to cancel subscription'], 400);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}