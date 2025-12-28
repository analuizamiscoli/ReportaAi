<?php

namespace Database\Seeders;

use App\Models\Usuario;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        \App\Models\Usuario::create([
            'nome_completo' => 'Admin JF',
            'cpf' => '123.456.789-00',
            'email' => 'admin@reportaaijf.com',
            'password' => \Illuminate\Support\Facades\Hash::make('modelagem2025@'),
            'tipo' => 'Administrador',
            'bairro' => 'Centro'
        ]);
        
        
    }
}
