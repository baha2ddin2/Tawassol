<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class message extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    

    protected static function boot()
    {
        parent::boot();
        static::creating(function($model){
            if(!$model->message_id){
                $model->message_id=(string)Str::uuid();
            }
        });
        static::deleting(function($model){
            $mediaItems = \App\Models\media::where('message_id', $model->message_id)->get();
            foreach($mediaItems as $media) {
                if($media->url){
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($media->url);
                }
            }
        });
    }

    protected $fillable = [
        'message_id',
        'content',
        'is_read',
        'sender_id',
        'recipient_id',
        'group_id'
    ];
}
