<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PostHashtag extends Model
{
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
        'post_id',
        'hashtag_id'
    ];
}
