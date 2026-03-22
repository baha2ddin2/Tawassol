<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Group extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    

    protected static function boot()
    {
        parent::boot();
        static::creating(function($model){
            if(!$model->group_id){
                $model->group_id=(string)Str::uuid();
            }
        });

        static::deleting(function($model){
            if($model->photo_url){
                \Illuminate\Support\Facades\Storage::disk('public')->delete($model->photo_url);
            }
        });
    }

    protected $fillable = [
        'name',
        'photo_url',
        'description',
    ];

    public function latestMessage()
    {
        return $this->hasOne(message::class, 'group_id', 'group_id')->latestOfMany();
    }
}
