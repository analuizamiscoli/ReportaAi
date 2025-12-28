<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\OcorrenciaController;
use Illuminate\Support\Facades\Route;

// Rotas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/ocorrencias', [OcorrenciaController::class, 'index']);
Route::get('/ocorrencias/{id}', [OcorrenciaController::class, 'show']);

// Rotas protegidas 
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
        Route::post('/ocorrencias', [OcorrenciaController::class, 'store']);
    
            Route::post('/ocorrencias/{id}/apoiar', [OcorrenciaController::class, 'apoiar']);
    
        
    
            Route::get('/minhas-atividades', [OcorrenciaController::class, 'minhasAtividades']);
    
            
    
            // Rota para atualização de status 
    
            Route::put('/ocorrencias/{id}/status', [OcorrenciaController::class, 'updateStatus']);
    
        });
    
        
    
    