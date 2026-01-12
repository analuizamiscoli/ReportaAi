<?php

namespace App\Http\Controllers;

use App\Models\Ocorrencia;
use App\Models\Apoio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OcorrenciaController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user('sanctum');
        
        $ocorrencias = Ocorrencia::with('usuario')->latest()->get();
        
        // Se tiver usuário logado, verifica quais ele apoiou
        if ($user) {
            $apoiadasIds = $user->ocorrenciasApoiadas()->pluck('ocorrencias.id')->toArray();
            
            // Adiciona um campo booleano 'apoiado_por_mim' em cada ocorrência
            $ocorrencias->each(function ($ocorrencia) use ($apoiadasIds) {
                $ocorrencia->apoiado_por_mim = in_array($ocorrencia->id, $apoiadasIds);
            });
        }

        return response()->json($ocorrencias);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'categoria' => 'required|string|in:Buraco na Via,Lâmpada Queimada,Mato Alto,Lixo Acumulado,Sinalização Danificada,Outro',
            'foto' => 'nullable|image|max:10240', // Valida se é uma imagem de até 10MB
            'url_foto' => 'nullable|string', // Mantém compatibilidade caso envie URL direta
            'descricao' => 'nullable|string',
            'rua' => 'required|string',
            'numero' => 'nullable|string',
            'bairro' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ], [
            'required' => 'O campo :attribute é obrigatório.',
            'image' => 'O arquivo enviado deve ser uma imagem.',
            'max' => 'A imagem não pode ser maior que 10MB.',
            'in' => 'A categoria selecionada é inválida.',
        ], [
            'categoria' => 'Categoria',
            'foto' => 'Foto',
            'rua' => 'Rua',
            'bairro' => 'Bairro',
            'latitude' => 'Latitude',
            'longitude' => 'Longitude',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $url_foto = 'https://via.placeholder.com/150';

        // Lógica de upload de imagem
        if ($request->hasFile('foto')) {
            // Salva na pasta 'ocorrencias' dentro do disco 'public'
            $path = $request->file('foto')->store('ocorrencias', 'public');
            // Gera a URL completa para acesso público
            $url_foto = asset('storage/' . $path);
        } elseif ($request->filled('url_foto')) {
            $url_foto = $request->url_foto;
        }

        $ocorrencia = Ocorrencia::create([
            'id_usuario' => $request->user()->id,
            'categoria' => $request->categoria,
            'url_foto' => $url_foto,
            'descricao' => $request->descricao,
            'rua' => $request->rua,
            'numero' => $request->numero,
            'bairro' => $request->bairro,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'status' => 'Reportado',
            'contagem_apoios' => 0,
        ]);

        return response()->json([
            'message' => 'Ocorrência registrada com sucesso!',
            'ocorrencia' => $ocorrencia->load('usuario')
        ], 201);
    }

    public function show($id)
    {
        $ocorrencia = Ocorrencia::with(['usuario', 'apoiadores'])->find($id);

        if (!$ocorrencia) {
            return response()->json(['message' => 'Ocorrência não encontrada.'], 404);
        }

        return response()->json($ocorrencia);
    }

                public function apoiar(Request $request, $id)

                {

                    $usuario = $request->user();

                    $ocorrencia = Ocorrencia::find($id);

            

                    if (!$ocorrencia) {

                        return response()->json(['message' => 'Ocorrência não encontrada.'], 404);

                    }

            

                    // Impede que o usuário apoie a própria ocorrência

                    if ($ocorrencia->id_usuario == $usuario->id) {

                        return response()->json(['message' => 'Você não pode apoiar sua própria ocorrência.'], 403);

                    }

            

                    // Verifica se o usuário já apoiou

                    $apoio = Apoio::where('id_usuario', $usuario->id)

                                  ->where('id_ocorrencia', $id)

                                  ->first();

            

                            if ($apoio) {

            

                                // Se já apoia, remove o apoio (toggle)

            

                                Apoio::where('id_usuario', $usuario->id)

            

                                     ->where('id_ocorrencia', $id)

            

                                     ->delete();

            

                    

            

                                $ocorrencia->decrement('contagem_apoios');

            

                                $status = 'removido';

            

                            } else {

            

                    

                        // Se não apoia, adiciona o apoio

                        Apoio::create([

                            'id_usuario' => $usuario->id,

                            'id_ocorrencia' => $id

                        ]);

                        $ocorrencia->increment('contagem_apoios');

                        $status = 'adicionado';

                    }

            

                    return response()->json([

                        'message' => "Apoio $status com sucesso!",

                        'contagem_apoios' => $ocorrencia->contagem_apoios,

                        'status_apoio' => $status

                    ]);

                }

            

                    public function minhasAtividades(Request $request)

            

                    {

            

                        $user = $request->user();

            

                

            

                        // Ocorrências criadas pelo usuário

            

                        $reportadas = Ocorrencia::with('usuario')

            

                                        ->where('id_usuario', $user->id)

            

                                        ->latest()

            

                                        ->get();

            

                

            

                        // Ocorrências apoiadas pelo usuário 

            

                        $apoiadas = $user->ocorrenciasApoiadas()->with('usuario')->latest()->get();

            

                

            

                        return response()->json([

            

                            'reportadas' => $reportadas,

            

                            'apoiadas' => $apoiadas

            

                        ]);

            

                    }

            

                

            

                        public function updateStatus(Request $request, $id)

            

                

            

                        {

            

                

            

                            $ocorrencia = Ocorrencia::find($id);

            

                

            

                    

            

                

            

                            if (!$ocorrencia) {

            

                

            

                                return response()->json(['message' => 'Ocorrência não encontrada.'], 404);

            

                

            

                            }

            

                

            

                    

            

                

            

                            // Validação robusta usando Rule::in

            

                

            

                            $request->validate([

            

                

            

                                'status' => ['required', \Illuminate\Validation\Rule::in(['Reportado', 'Em Andamento', 'Resolvido', 'Recusada'])]

            

                

            

                            ], [
                                'required' => 'O campo status é obrigatório.',
                                'in' => 'O status selecionado é inválido.'
                            ]);

            

                

            

                    

            

                

            

                            $ocorrencia->status = $request->status;

            

                

            

                            $ocorrencia->save();

            

                

            

                    

            

                

            

                            return response()->json([

            

                

            

                                'message' => 'Status atualizado com sucesso!',

            

                

            

                                'ocorrencia' => $ocorrencia

            

                

            

                            ]);

            

                

            

                        }

            

                

            

                    

            

                }

            

                

    