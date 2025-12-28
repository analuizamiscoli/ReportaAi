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

    // Como é uma tabela pivô sem ID auto-incremento (chave composta), desativamos o incremento
    public $incrementing = false;

    // Definimos a chave primária como null ou um array (o Eloquent não suporta chaves compostas nativamente para find(), mas isso evita erros de int)
    protected $primaryKey = null;
}
