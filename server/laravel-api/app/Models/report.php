<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class report extends Model
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
        'reason',
        'handled_at',
        'reporter_id',
        'target_id',
        'target_post_id',
        'target_comment_id'
    ];
}
