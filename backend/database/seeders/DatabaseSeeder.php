<?php

namespace Database\Seeders;

use App\Models\Usuario;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Use o Model Usuario que criamos
        \App\Models\Usuario::create([
            'nome_completo' => 'Ana Admin JF',
            'cpf' => '123.456.789-00',
            'email' => 'admin@fiscalizajf.com',
            'password' => \Illuminate\Support\Facades\Hash::make('senha123'),
            'tipo' => 'Administrador',
            'bairro' => 'Centro'
        ]);
        
        // Se quiser usar o factory depois, precisaremos criar um UsuarioFactory. 
        // Por enquanto, use o ::create para testar logo!
    }
}
