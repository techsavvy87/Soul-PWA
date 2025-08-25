<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PaypalPlan;
use App\Services\PayPalService;

class PayPalPlanController extends Controller
{

    protected $paypal;

    public function __construct(PayPalService $paypal)
    {
        $this->paypal = $paypal;
    }

    public function listPlans()
    {
        $plans = PaypalPlan::all();
        $active = "plan";
        return view('plan.list', compact('plans', 'active'));
    }

    public function createPlanForm()
    {
        $active = "plan";
        return view('plan.create', compact('active'));
    }

    public function storePlan(Request $request)
    {
        $request->validate([
            'product_name' => 'required|string',
            'product_description' => 'required|string',
            'plan_name' => 'required|string',
            'price' => 'required|numeric',
            'type' => 'required',
        ]);
       
        $interval_count = 1;
        // Create Product
        $product = $this->paypal->createProduct($request->product_name, $request->product_description);
        $productId = $product['id'];
        
        // Create Plan
        $plan = $this->paypal->createPlan(
            $productId,
            $request->plan_name,
            $request->price,
            $request->type,
            $interval_count
        );
        $planId = $plan['id'];

        // Store in DB
        $paypalPlan = PaypalPlan::create([
            'product_id' => $productId,
            'plan_id' => $planId,
            'name' => $request->plan_name,
            'description' => $request->product_description,
            'price' => $request->price,
            'status' => $plan['status'],
            'interval_unit' => strtolower($request->type),
            'interval_count' => $interval_count,
        ]);

        return redirect()->route('list-plan')->with([
            'status'=>'success',
            'message'=> 'Plan has been created successfully.',
        ]);
    }

    public function editPlan($id)
    {
        $plan = PaypalPlan::find($id);
        $active = "plan";
        return view('plan.update', compact('plan', 'active'));
    }

    public function updatePlan(Request $request)
    {
        $request->validate([
            'plan_name' => 'required|string',
            'description' => 'required|string',
        ]);

        $plan = PaypalPlan::find($request->plan_id);
        $plan->description = $request->description;
        $plan->name = $request->plan_name;

        // Update the plan in PayPal
        $this->paypal->updatePlan($plan->plan_id, [
            'description' => $request->description,
            'price' => $request->price,
            'currency'    => 'USD',
            'name' => $request->plan_name
        ]);

        $plan->save();

        return redirect()->route('list-plan')->with([
            'status'=>'success',
            'message'=> 'Plan has been updated successfully.',
        ]);
    }

    public function archivePlan(Request $request)
    {
        $request->validate([
            'plan_id' => 'required',
        ]);

        $plan = PaypalPlan::find($request->plan_id);
        $plan->status = 'inactive';

        // Archive the plan in PayPal
        $this->paypal->archivePlan($plan->plan_id);

        $plan->save();

        return redirect()->route('list-plan')->with([
            'status'=>'success',
            'message'=> 'Plan has been archived successfully.',
        ]);
    }

    public function unarchivePlan(Request $request)
    {
        $request->validate([
            'plan_id' => 'required',
        ]);

        $plan = PaypalPlan::find($request->plan_id);
        $plan->status = 'active';

        // Unarchive the plan in PayPal
        $this->paypal->unarchivePlan($plan->plan_id);

        $plan->save();

        return redirect()->route('list-plan')->with([
            'status'=>'success',
            'message'=> 'Plan has been unarchived successfully.',
        ]);
    }
}