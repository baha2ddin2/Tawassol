<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class like extends Model
{
    protected $primaryKey = 'like_id';
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
        'like_id',
        'post_id',
        'user_id',
        'comment_id'
    ];
}
