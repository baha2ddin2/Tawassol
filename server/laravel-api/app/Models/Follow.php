<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Follow extends Model
{
    public  $primaryKey = 'follow_id';
    public $incrementing = false;
    protected $keyType = 'string';
    

    protected static function boot()
    {
        return parent::boot();
        static::creating(function($model){
            if(!$model->user_id){
                $model->user_id=(string)Str::uuid();
            }
        });
    }

    protected $fillable = [
        'follow_id',
        'follower_id',
        'followed_id',
    ];
}
