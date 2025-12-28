import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link, useLocation } from 'react-router-dom';
import { Button, Card, Form } from 'react-bootstrap';
import 'leaflet/dist/leaflet.css';
import './MapPage.css';
import L from 'leaflet';
import NewOccurrenceForm from '../components/NewOccurrenceForm';
import BackButton from '../components/BackButton';
import api from '../services/api';

const statusIcons = {
    reported: new L.DivIcon({ className: 'custom-div-icon', html: `<div style='background-color:var(--status-reported);' class='marker-pin'></div>` }),
    'in-progress': new L.DivIcon({ className: 'custom-div-icon', html: `<div style='background-color:var(--status-in-progress);' class='marker-pin'></div>` }),
    resolved: new L.DivIcon({ className: 'custom-div-icon', html: `<div style='background-color:var(--status-resolved);' class='marker-pin'></div>` }),
};

const statusConfig = {
    reported: { label: 'Reportado', color: 'var(--status-reported)' },
    'in-progress': { label: 'Em Andamento', color: 'var(--status-in-progress)' },
    resolved: { label: 'Resolvido', color: 'var(--status-resolved)' },
};

function MapPage({ occurrences, setOccurrences, onNewOccurrence }) {
  const location = useLocation();
  const isAdminView = location.state?.isAdmin || false;
  const [currentUser, setCurrentUser] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    reported: true,
    'in-progress': true,
    resolved: true,
  });

  // Carrega o usuário atual do localStorage para saber quem é
  useEffect(() => {
    const userStored = localStorage.getItem('user');
    if (userStored) {
        setCurrentUser(JSON.parse(userStored));
    }
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSupport = async (id) => {
      try {
          const response = await api.post(`/ocorrencias/${id}/apoiar`);
          
          const { contagem_apoios, status_apoio } = response.data;
          
          // Atualiza a lista localmente com a nova contagem vinda do servidor
          setOccurrences(currentOccurrences =>
            currentOccurrences.map(occ => {
                if (occ.id === id) {
                    return { 
                        ...occ, 
                        supporters: contagem_apoios,
                        isSupportedByMe: status_apoio === 'adicionado' // Opcional, se o backend retornar
                    };
                }
                return occ;
            })
          );
          
          // Opcional: Recarregar tudo do servidor para garantir sincronia total
          // mas atualizar o estado local é mais rápido para o usuário.
      } catch (error) {
          console.error("Erro ao apoiar:", error);
          if (error.response && error.response.data) {
              alert(error.response.data.message);
          }
      }
  };

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: checked }));
  };

  const filteredOccurrences = occurrences.filter(occ => filters[occ.status]);
  const position = [-21.7642, -43.3526];

  return (
    <div className="map-page">
      {isAdminView && <BackButton to="/admin" />}

      <header className="map-header">
        <div className={`container-fluid d-flex justify-content-between align-items-center ${isAdminView ? 'with-back-button' : ''}`}>       
          <a href="/" className="map-logo">Reporta Aí</a>
          <div>
            {!isAdminView && (
                <>
                    <Link to="/perfil" className="btn btn-light ms-2">Perfil</Link>
                    <Link to="/" className="btn btn-outline-danger ms-2" onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                    }}>Sair</Link>
                </>
            )}
          </div>
        </div>
      </header>

      <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <div className="filter-control">
            <Card>
                <Card.Body>
                    <Card.Title className="h6">Filtros</Card.Title>
                    <Form>
                        {Object.keys(filters).map(filterName => (
                            <Form.Check
                                key={filterName}
                                type="checkbox"
                                id={`filter-${filterName}`}
                                label={statusConfig[filterName].label}
                                name={filterName}
                                checked={filters[filterName]}
                                onChange={handleFilterChange}
                            />
                        ))}
                    </Form>
                </Card.Body>
            </Card>
        </div>

        {filteredOccurrences.map((occ) => {
          // Verifica se a ocorrência é do próprio usuário
          const isMine = currentUser && occ.userCpf === currentUser.cpf; 
          // Verifica se o usuário já apoiou (dado vindo do backend no App.js)
          const isSupportedByMe = occ.apoiado_por_mim; 

          return (
            <Marker key={occ.id} position={occ.pos} icon={statusIcons[occ.status]}>
              <Popup>
                  <div className='card border-0' style={{width: '180px'}}>
                      <img src={occ.photo} className='card-img-top' alt={occ.category} />
                      <div className='card-body p-2'>
                          <h6 className='card-title mb-1'>{occ.category}</h6>
                          <p className='card-text small mb-1'>
                              Status: <span className='fw-bold' style={{color: statusConfig[occ.status].color}}>{statusConfig[occ.status].label}</span>
                          </p>
                          
                          {occ.status === 'reported' && (
                            <>
                              <p className='card-text small mb-2'>
                                  <span className='fw-bold'>{occ.supporters}</span> apoios
                              </p>
                              
                              {!isAdminView && !isMine && (
                                  <Button
                                      variant={isSupportedByMe ? "success" : "danger"}
                                      size="sm"
                                      className="w-100"
                                      onClick={() => handleSupport(occ.id)}
                                      // Se já apoiou, não desabilitamos, permitimos clicar para remover (toggle)
                                      // Se quiser apenas 1 clique, use disabled={isSupportedByMe}
                                  >
                                      {isSupportedByMe ? "Remover Apoio" : "Apoiar"}
                                  </Button>
                              )}
                              
                              {isMine && !isAdminView && (
                                  <span className="badge bg-secondary w-100 py-2">Sua Ocorrência</span>
                              )}
                            </>
                          )}
                      </div>
                  </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="fab" onClick={handleShowModal}>
        +
      </div>

      <NewOccurrenceForm show={showModal} handleClose={handleCloseModal} onNewOccurrence={onNewOccurrence} />
    </div>
  );
}

export default MapPage;
