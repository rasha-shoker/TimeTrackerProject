<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimeEntry extends Model
{
    protected $fillable = [
    'category_id',
    'date',
    'start_time',
    'end_time',
    'total_minutes',
    'notes'
];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
