<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Faq;

class FaqController extends Controller
{
    public function listFaq()
    {
        $faqs = Faq::all();

        $active = 'faq';
        return view('faq.list', compact('active', 'faqs'));
    }

    public function addFaq(Request $request)
    {
        $active = 'faq';
        return view('faq.create', compact('active'));
    }

    public function deleteFaq(Request $request) 
    {
        $request->validate([
            'faq_id' => 'required',
        ]);

        Faq::find($request->faq_id)->delete();

        return redirect()->route('list-faq')->with([
            'status'=>'success',
            'message'=> 'Faq has been deleted successfully.',
        ]);
    }

    public function updateFaq(Request $request)
    {
        $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
        ]);

        $id = $request->faq_id;
        $faq = Faq::find($id);
        $faq->question = $request->question;
        $faq->answer = $request->answer;

        $faq->save();

        return redirect()->route('list-faq')->with([
            'status'=>'success',
            'message'=> 'Faq has been updated successfully.',
        ]);
    }

    public function editFaq($id)
    {
        $faq = Faq::find($id);
        $active = 'faq';
        return view('faq.update', compact('faq', 'active'));
    }

    public function createFaq(Request $request)
    {
        $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
        ]);

        $faq = new Faq;
        $faq->question = $request->question;
        $faq->answer = $request->answer;

        $faq->save();

        return redirect()->route('list-faq')->with([
            'status'=>'success',
            'message'=> 'Faq has been created successfully.',
        ]);
    }
}