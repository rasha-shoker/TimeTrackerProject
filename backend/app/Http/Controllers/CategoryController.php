<?php

// test update for pull request

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{

    public function index()

    {
        // TEST CHANGE

         return response()->json(Category::all());

    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required'
        ]);

        $cat = Category::create([
            'name' => $request->name
        ]);

        return response()->json($cat, 201);
    }

    // Test update to enable pull request


    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required'
        ]);

        $cat = Category::findOrFail($id);
        $cat->update([
            'name' => $request->name
        ]);

        return response()->json($cat, 200);
    }

    public function destroy($id)
    {
        $cat = Category::findOrFail($id);
        $cat->delete();

        return response()->json(null, 204);
    }
}
