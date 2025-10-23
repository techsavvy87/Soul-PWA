<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Notifications\PayPalWebhookNotification;
use App\Models\User;
use App\Models\PlanSubscription;
use Illuminate\Support\Facades\Log;

class PayPalWebhookController extends Controller
{
    public function handleWebhook(Request $request)
    {
        $webhookEvent = $request->all();

        $subscriptionId = $webhookEvent['resource']['id'] ?? null;
        $eventType = $webhookEvent['event_type'] ?? null;
        $userId = PlanSubscription::where('paypal_subscription_id', $subscriptionId)->value('user_id');
        $user = User::find($userId);

        // Update database
        if ($eventType === 'BILLING.SUBSCRIPTION.CANCELLED' && $subscriptionId) {
            PlanSubscription::where('paypal_subscription_id', $subscriptionId)->delete();
        }
        // Only handle successful payments
        if ($eventType === 'BILLING.SUBSCRIPTION.PAYMENT.SUCCEEDED') {
            $paypalId = $webhookEvent['resource']['id'];
            $nextBilling = $webhookEvent['resource']['billing_info']['next_billing_time'];

            // Find subscription in DB
            $subscription = PlanSubscription::where('paypal_subscription_id', $paypalId)->first();

            if ($subscription && $subscription->plan_status === 'ACTIVE') {
                // Update plan_ended_date
                $subscription->plan_ended_date = Carbon::parse($nextBilling)->format('Y-m-d');
                $subscription->save();
            }
        }

        // Notify user via WebPush
        // if ($user) {
        //     try {
        //         $user->notify(new PayPalWebhookNotification([
        //             'title' => 'Subscription Canceled',
        //             'body' => 'Your PayPal subscription has been canceled.',
        //             'subscription' => $subscriptionId,
        //             'event_type' => $eventType,
        //             'data' => [
        //                 'context' => 'paypal'
        //             ]
        //         ]));
        //     } catch (\Exception $e) {
        //         Log::error('WebPush Notification failed: '.$e->getMessage());
        //     }
        // }

        return response()->json(['status' => 'success']);
    }
}