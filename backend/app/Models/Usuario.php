<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nome_completo',
        'cpf',
        'email',
        'password',
        'cep',
        'rua',
        'numero',
        'bairro',
        'tipo',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'password' => 'hashed',
    ];

    // Relacionamento: Um usuário pode ter várias ocorrências (1:N)
    public function ocorrencias()
    {
        return $this->hasMany(Ocorrencia::class, 'id_usuario');
    }

    // Relacionamento: Um usuário pode apoiar várias ocorrências (N:N)
    public function ocorrenciasApoiadas()
    {
        return $this->belongsToMany(Ocorrencia::class, 'apoios', 'id_usuario', 'id_ocorrencia')
                    ->withTimestamps();
    }
}
