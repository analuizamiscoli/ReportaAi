<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Alter enum to include 'Recusada' instead of 'Rejeitada'
        DB::statement("ALTER TABLE ocorrencias MODIFY COLUMN status ENUM('Reportado', 'Em Andamento', 'Resolvido', 'Recusada') DEFAULT 'Reportado'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Update any 'Recusada' status to 'Reportado' to avoid data truncation when reverting
        DB::table('ocorrencias')->where('status', 'Recusada')->update(['status' => 'Reportado']);
        
        DB::statement("ALTER TABLE ocorrencias MODIFY COLUMN status ENUM('Reportado', 'Em Andamento', 'Resolvido') DEFAULT 'Reportado'");
    }
};