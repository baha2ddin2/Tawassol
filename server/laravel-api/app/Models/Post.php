<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Post extends Model
{
    protected $primaryKey = 'post_id';
    public $incrementing = false;
    protected $keyType = 'string';
    

    protected static function boot()
    {
        static::creating(function($model){
            if(!$model->post_id){
                $model->post_id=(string)Str::uuid();
            }
        });
    }

    protected $fillable = [
        'post_id',
        'content',
        'external_link',
        'author_id',
    ];
}
