import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import api from './services/api';

// Páginas
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MapPage from './pages/MapPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [occurrences, setOccurrences] = useState([]);

  // Função para buscar ocorrências do backend
  const fetchOccurrences = async () => {
    try {
      const response = await api.get('/ocorrencias');
      const formattedOccurrences = response.data.map(occ => ({
        id: occ.id,
        pos: [parseFloat(occ.latitude), parseFloat(occ.longitude)],
        category: occ.categoria,
        status: occ.status === 'Reportado' ? 'reported' : 
                occ.status === 'Em Andamento' ? 'in-progress' : 
                occ.status === 'Resolvido' ? 'resolved' : 'refused',
        photo: occ.url_foto,
        description: occ.descricao,
        supporters: occ.contagem_apoios,
        date: new Date(occ.created_at).toISOString().split('T')[0],
        userName: occ.usuario ? occ.usuario.nome_completo : 'Anônimo',
        userCpf: occ.usuario ? occ.usuario.cpf : '',
        address: `${occ.rua}, ${occ.numero}, ${occ.bairro}`,
        apoiado_por_mim: occ.apoiado_por_mim
      }));
      setOccurrences(formattedOccurrences);
    } catch (error) {
      console.error("Erro ao buscar ocorrências:", error);
    }
  };

  useEffect(() => {
    fetchOccurrences();
  }, []);

  const handleNewOccurrence = async (newOcc) => {
    try {
        const formData = new FormData();
        
        formData.append('categoria', newOcc.category);
        formData.append('descricao', newOcc.description || '');
        formData.append('rua', newOcc.address.street || 'Rua Desconhecida');
        formData.append('numero', newOcc.address.number || 'S/N');
        formData.append('bairro', newOcc.address.neighborhood || 'Bairro Desconhecido');
        formData.append('latitude', newOcc.pos[0]);
        formData.append('longitude', newOcc.pos[1]);

        if (newOcc.photo && newOcc.photo.file) {
            formData.append('foto', newOcc.photo.file);
        }

        await api.post('/ocorrencias', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        fetchOccurrences();
        alert('Ocorrência reportada com sucesso!');
    } catch (error) {
        console.error("Erro ao salvar ocorrência:", error);
        alert('Erro ao salvar ocorrência. Tente novamente.');
    }
  };

  // Função atualizada com melhor tratamento de erro
  const handleStatusChange = async (id, newStatusKey) => {
    const statusMap = {
        'reported': 'Reportado',
        'in-progress': 'Em Andamento',
        'resolved': 'Resolvido',
        'refused': 'Recusada'
    };

    const newStatusLabel = statusMap[newStatusKey];

    try {
        await api.put(`/ocorrencias/${id}/status`, { status: newStatusLabel });
        
        setOccurrences(currentOccurrences =>
          currentOccurrences.map(occ =>
            occ.id === id ? { ...occ, status: newStatusKey } : occ
          )
        );
        alert('Status atualizado com sucesso!');
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        const msg = error.response?.data?.message || 'Erro desconhecido';
        const details = JSON.stringify(error.response?.data?.errors || {});
        alert(`Erro ao atualizar status: ${msg}\n${details}`);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        <Route
            path="/mapa"
            element={<MapPage
                occurrences={occurrences}
                setOccurrences={setOccurrences}
                onNewOccurrence={handleNewOccurrence}
            />}
        />

        <Route path="/perfil" element={<UserDashboard allOccurrences={occurrences} />} />
        
        <Route
            path="/admin"
            element={<AdminDashboard
                allOccurrences={occurrences}
                onStatusChange={handleStatusChange}
            />}
        />
      </Routes>
    </Router>
  );
}

export default App;
