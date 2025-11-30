<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TimeEntryController;

Route::get('/test', function () {
    return 'API is working';
});

// ===== CATEGORIES CRUD =====
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::put('/categories/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

// ===== TIME ENTRIES CRUD =====
Route::get('/time-entries', [TimeEntryController::class, 'index']);
Route::post('/time-entries', [TimeEntryController::class, 'store']);
Route::put('/time-entries/{id}', [TimeEntryController::class, 'update']);
Route::delete('/time-entries/{id}', [TimeEntryController::class, 'destroy']);


// SUMMARY ROUTES
Route::get('/summary/total-per-category', [TimeEntryController::class, 'totalPerCategory']);
Route::get('/summary/daily-breakdown', [TimeEntryController::class, 'dailyBreakdown']);


Route::apiResource('categories', CategoryController::class);
