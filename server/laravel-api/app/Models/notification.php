<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class notification extends Model
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
        'notification_id',
        'type',
        'is_read',
        'user_id',
        'post_id',
        'source_user_id',
        'group_id',
        'comment_id'
    ];
}
