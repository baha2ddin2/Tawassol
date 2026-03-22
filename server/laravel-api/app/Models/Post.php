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
        parent::boot();
        static::creating(function($model){
            if(!$model->post_id){
                $model->post_id=(string)Str::uuid();
            }
        });
        static::deleting(function($model){
            $mediaItems = \App\Models\media::where('post_id', $model->post_id)->get();
            foreach($mediaItems as $media) {
                if($media->url){
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($media->url);
                }
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
