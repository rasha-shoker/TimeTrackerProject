<?php

namespace App\Http\Controllers;

use App\Models\TimeEntry;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class TimeEntryController extends Controller
{
    // ============================
    // GET ALL ENTRIES
    // ============================
    public function index()
    {
        return response()->json(
            TimeEntry::with('category')->orderBy('date', 'desc')->get()
        );
    }

    // ============================
    // STORE NEW ENTRY
    // ============================
    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'date'        => 'required|date',
            'start_time'  => 'required',
            'end_time'    => 'required',
        ]);

        $start = Carbon::parse($request->start_time);
        $end   = Carbon::parse($request->end_time);

        if ($end->lessThan($start)) {
            return response()->json([
                'error' => 'End time must be greater than start time'
            ], 400);
        }

        // حساب الدقائق
        $minutes = $start->diffInMinutes($end);

        $entry = TimeEntry::create([
            'category_id'  => $request->category_id,
            'date'         => $request->date,        // <=== مصححة!
            'start_time'   => $request->start_time,
            'end_time'     => $request->end_time,
            'total_minutes'=> $minutes,              // <=== الآن تُحفظ
            'notes'        => $request->notes,
        ]);

        return response()->json($entry, 201);
    }

    // ============================
    // UPDATE ENTRY
    // ============================

    // test update for PR

    public function update(Request $request, $id)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'date'        => 'required|date',
            'start_time'  => 'required',
            'end_time'    => 'required',
        ]);

        $start = Carbon::parse($request->start_time);
        $end   = Carbon::parse($request->end_time);

        if ($end->lessThan($start)) {
            return response()->json([
                'error' => 'End time must be greater than start time'
            ], 400);
        }

        $minutes = $start->diffInMinutes($end);

        $entry = TimeEntry::findOrFail($id);

        $entry->update([
            'category_id'   => $request->category_id,
            'date'          => $request->date,
            'start_time'    => $request->start_time,
            'end_time'      => $request->end_time,
            'total_minutes' => $minutes,
            'notes'         => $request->notes,
        ]);

        return response()->json($entry);
    }

    // ============================
    // DELETE ENTRY
    // ============================
    public function destroy($id)
    {
        TimeEntry::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }

    // ============================
    // SUMMARY: TOTAL PER CATEGORY
    // ============================
    public function totalPerCategory()
    {
        $summary = TimeEntry::select(
            'categories.name as category',
            DB::raw('SUM(total_minutes) as total_minutes')
        )
        ->join('categories', 'categories.id', '=', 'time_entries.category_id')
        ->groupBy('category')
        ->get();

        foreach ($summary as $item) {
            $item->total_hours = round($item->total_minutes / 60, 2);
        }

        return response()->json($summary);
    }

    // ============================
    // SUMMARY: DAILY BREAKDOWN
    // ============================

    // reporting ui test change

    public function dailyBreakdown()
    {
        $summary = TimeEntry::select(
            'date',
            'categories.name as category',
            DB::raw('SUM(total_minutes) as total_minutes')
        )
        ->join('categories', 'categories.id', '=', 'time_entries.category_id')
        ->groupBy('date', 'category')
        ->orderBy('date', 'ASC')
        ->get();

        foreach ($summary as $item) {
            $item->total_hours = round($item->total_minutes / 60, 2);
        }

        return response()->json($summary);
    }
}
