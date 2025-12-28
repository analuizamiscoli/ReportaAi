<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Apoio extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_usuario',
        'id_ocorrencia',
    ];

    public $incrementing = false;
    protected $primaryKey = null;
}
