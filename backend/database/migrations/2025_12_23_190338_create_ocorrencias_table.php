<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ocorrencias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_usuario')->nullable()->constrained('usuarios')->onDelete('set null');
            $table->enum('categoria', ['Buraco na Via', 'Lâmpada Queimada', 'Mato Alto', 'Lixo Acumulado', 'Sinalização Danificada', 'Outro']);
            $table->enum('status', ['Reportado', 'Em Andamento', 'Resolvido'])->default('Reportado');
            $table->string('url_foto', 1024);
            $table->text('descricao')->nullable();
            $table->string('rua');
            $table->string('numero', 50)->nullable();
            $table->string('bairro');
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->integer('contagem_apoios')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ocorrencias');
    }
};
