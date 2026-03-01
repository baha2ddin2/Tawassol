<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Laravel\Scout\Searchable;

class Profile extends Model
{
    protected $primaryKey = 'profile_id';
    public $incrementing = false;
    protected $keyType = 'string';

    use Searchable;

    public function toSearchableArray()
    {
        return [
            'profile_id'=>$this->profile_id,
            'display_name'=>$this->display_name,
            'user_id'=>$this->user_id
        ];
    }
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'profile_id',
        'display_name',
        'bio',
        'avatar_url',
        'is_private',
        'user_id'
    ];



}
