<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\PaypalPlan;
use App\Models\PlanSubscription;
use Carbon\Carbon;
use App\Services\PayPalService;
use App\Mail\CancelSubscription;

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
        $is_free_subscribed = false;
        foreach ($plans as $plan) {
            $existingSubscription = PlanSubscription::where('user_id', auth()->id())
                ->where('plan_id', $plan->id)
                ->whereNotIn('subscription_status', ['free', 'trial'])
                ->first();
            $realSubscription = PlanSubscription::where('user_id', auth()->id())->value('subscription_status');
            // Determine if the user is subscribed to this plan (monthly/annual)
            if ($existingSubscription) {
                $plan->is_subscribed = true;
                $plan->subscription_id = $existingSubscription->paypal_subscription_id;
            } else {
                $plan->is_subscribed = false;
                $plan->subscription_id = null;
            }
            
            if ($plan->name === 'Monthly Plan') {
                $plan->tier = 'monthly';
            } else {
                $plan->tier = 'annual';
            }
        }
        return response()->json([
            'status' => true,
            'message' => 'Plans retrieved successfully',
            'result' => [
                'plans' => $plans,
                'realSubscription' => $realSubscription,
            ],
        ]);
    }

    // Save subscription after PayPal approval
    public function storeSubscription(Request $request)
    {
        $request->validate([
            'subscription_id' => 'required|string',
            'plan_status' => 'required|string',
            'plan_id' => 'required|integer',
            'plan_started_date' => 'required|date',
            'plan_ended_date' => 'required|date',
            'subscription_status' => 'required|string',
        ]);

        $plan = PaypalPlan::where('plan_id', $request->plan_id)->first();

        // Check if a subscription already exists for this user
        $existing = PlanSubscription::where('user_id', auth()->id())->first();

        if ($existing) {
            // Update the existing subscription
            $existing->update([
            'paypal_subscription_id' => $request->subscription_id,
            'plan_status' => $request->plan_status,
            'plan_started_date' => Carbon::parse($request->plan_started_date),
            'plan_ended_date' => Carbon::parse($request->plan_ended_date),
            'plan_id' => $request->plan_id,
            'subscription_status' => $request->subscription_status,
            ]);
            $subscription = $existing;
        } else {
            // Create a new subscription
            $subscription = PlanSubscription::create([
            'user_id' => auth()->id(),
            'paypal_subscription_id' => $request->subscription_id,
            'plan_status' => $request->plan_status,
            'plan_started_date' => Carbon::parse($request->plan_started_date),
            'plan_ended_date' => Carbon::parse($request->plan_ended_date),
            'plan_id' => $request->plan_id,
            'subscription_status' => $request->subscription_status,
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
            'plan_ended_date' => 'required|date',
            'email' => 'required|email',
        ]);

        try {
            $success = $this->paypal->cancelSubscription($request->subscription_id);

            if ($success) {
                // Update subscription record in database
                PlanSubscription::where('paypal_subscription_id', $request->subscription_id)
                    ->update([
                        'subscription_status' => 'free',
                        'plan_status' => null,
                    ]);
                // Send cancellation email to user
                $email = $request->email;
                $planEndedDate = Carbon::parse($request->plan_ended_date);
                $formattedPlanEndedDate = $planEndedDate->format('M, d, Y');
                $mailData = [
                    'plan_ended_date' => $formattedPlanEndedDate
                ];
                Mail::to($email)->send(new CancelSubscription($mailData));

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

    public function getSubscriptionEndDate($userId)
    {
        $subscription = PlanSubscription::where('user_id', $userId)->first();

        if ($subscription) {
            return response()->json([
                'status' => true,
                'message' => 'Subscription end date retrieved successfully.',
                'result' => [
                    'plan_ended_date' => $subscription->plan_ended_date,
                ],
            ], 200);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'No active subscription found for the user.',
                'result' => null,
            ], 404);
        }
    }

    public function makeFreeSubscription($userId)
    {
        $subscription = PlanSubscription::where('user_id', $userId)->first();

        if ($subscription) {
            $subscription->update([
                'subscription_status' => 'free',
                'plan_status' => null,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Subscription status updated to free successfully.',
                'result' => null,
            ], 200);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'No active subscription found for the user.',
                'result' => null,
            ], 404);
        }
    }
}