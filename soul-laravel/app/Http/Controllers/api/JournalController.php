<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Journal;

class JournalController extends Controller
{
    public function createJournal(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'journal.title' => 'required|string|max:255',
            'journal.entry' => 'required|string',
            'userId' => 'required|integer',
        ]);

        // Create a new journal entry
        $journal = new Journal();
        $journal->user_id = $validated['userId'];
        $journal->title = $validated['journal']['title'];
        $journal->entry = $validated['journal']['entry'];
        $journal->published_at = now();
        $journal->save();

        return response()->json([
            'status' => true,
            'message' => 'Journal entry created successfully.',
            'data' => $journal,
        ], 201);
    }

    public function getAllJournals(Request $request)
    {
        $journals = Journal::where('user_id', $request->user()->id)->get();

        return response()->json([
            'status' => true,
            'data' => $journals,
        ]);
    }

    public function getJournalById(Request $request, $id)
    {
        $journal = Journal::where('user_id', $request->user()->id)->find($id);

        if (!$journal) {
            return response()->json([
                'status' => false,
                'message' => 'Journal entry not found.',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $journal,
        ]);
    }

    public function updateJournal(Request $request, $id)
    {
        // Validate the request data
        $validated = $request->validate([
            'journal.title' => 'required|string|max:255',
            'journal.entry' => 'required|string',
        ]);

        // Find the journal entry
        $journal = Journal::where('user_id', $request->user()->id)->find($id);

        if (!$journal) {
            return response()->json([
                'status' => false,
                'message' => 'Journal entry not found.',
            ], 404);
        }

        // Update the journal entry
        $journal->title = $validated['journal']['title'];
        $journal->entry = $validated['journal']['entry'];
        $journal->save();

        return response()->json([
            'status' => true,
            'message' => 'Journal entry updated successfully.',
            'data' => $journal,
        ]);
    }

    public function deleteJournal(Request $request, $id)
    {
        // Find the journal entry
        $journal = Journal::where('user_id', $request->user()->id)->find($id);

        if (!$journal) {
            return response()->json([
                'status' => false,
                'message' => 'Journal entry not found.',
            ], 404);
        }

        // Delete the journal entry
        $journal->delete();

        return response()->json([
            'status' => true,
            'message' => 'Journal entry deleted successfully.',
        ]);
    }
}