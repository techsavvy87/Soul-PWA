<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaypalPlan extends Model
{
    protected $fillable = [
        'product_id', 'plan_id', 'name', 'price','status','description', 'interval_unit', 'interval_count'
    ];
}