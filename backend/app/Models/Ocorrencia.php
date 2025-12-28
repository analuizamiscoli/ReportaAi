<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ocorrencia extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_usuario',
        'categoria',
        'status',
        'url_foto',
        'descricao',
        'rua',
        'numero',
        'bairro',
        'latitude',
        'longitude',
        'contagem_apoios',
    ];

    // Relacionamento: Uma ocorrência pertence a um usuário (N:1)
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }

    // Relacionamento: Uma ocorrência pode ter vários apoiadores (N:N)
    public function apoiadores()
    {
        return $this->belongsToMany(Usuario::class, 'apoios', 'id_ocorrencia', 'id_usuario')
                    ->withTimestamps();
    }
}
