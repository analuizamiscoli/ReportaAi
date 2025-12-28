import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';
import api from '../services/api'; // Importa a API para buscar dados reais
import './UserDashboard.css';

// Configurações de texto e cor para cada status.
const statusConfig = {
  reported: { label: 'Reportado', color: 'var(--status-reported)' },
  'in-progress': { label: 'Em Andamento', color: 'var(--status-in-progress)' },
  resolved: { label: 'Resolvido', color: 'var(--status-resolved)' },
};

// Componente reutilizável para mostrar um card de ocorrência.
const OccurrenceCard = ({ occurrence }) => (
  <Col md={4} className="occurrence-card">
    <Card>
      <Card.Img variant="top" src={occurrence.photo} alt={occurrence.category} style={{height: '200px', objectFit: 'cover'}} />
      <Card.Body>
        <Card.Title>{occurrence.category}</Card.Title>
        <Card.Text className="text-muted small">{occurrence.address}</Card.Text>
        <div
          className="status-tag"
          style={{ backgroundColor: statusConfig[occurrence.status].color }}
        >
          {statusConfig[occurrence.status].label}
        </div>
        <small className="d-block mt-2 text-muted">
             {new Date(occurrence.date).toLocaleDateString()}
        </small>
        {occurrence.description && <p className="mt-2 small">{occurrence.description}</p>}
      </Card.Body>
    </Card>
  </Col>
);

// Página de Perfil do Usuário
function UserDashboard() {
  const [reportedByMe, setReportedByMe] = useState([]);
  const [supportedByMe, setSupportedByMe] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchActivities = async () => {
          try {
              const response = await api.get('/minhas-atividades');
              
              // Formata as ocorrências reportadas
              const formattedReported = response.data.reportadas.map(formatOccurrence);
              setReportedByMe(formattedReported);

              // Formata as ocorrências apoiadas
              const formattedSupported = response.data.apoiadas.map(formatOccurrence);
              setSupportedByMe(formattedSupported);
          } catch (error) {
              console.error("Erro ao carregar atividades:", error);
          } finally {
              setLoading(false);
          }
      };

      fetchActivities();
  }, []);

  // Função auxiliar para formatar os dados do banco para o padrão visual
  const formatOccurrence = (occ) => ({
    id: occ.id,
    category: occ.categoria,
    status: occ.status === 'Reportado' ? 'reported' : 
            occ.status === 'Em Andamento' ? 'in-progress' : 'resolved',
    photo: occ.url_foto,
    address: `${occ.rua}, ${occ.numero}, ${occ.bairro}`,
    date: occ.created_at,
    description: occ.descricao
  });

  if (loading) {
      return <div className="text-center mt-5"><p>Carregando suas atividades...</p></div>;
  }

  return (
    <>
      <BackButton to="/mapa" />
      <Container className="mt-5 with-back-button">
        <div className="d-flex justify-content-between align-items-center">
            <h1>Minhas Atividades</h1>
            <Link to="/" className="btn btn-outline-danger" onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }}>Sair</Link>
        </div>

        <Tab.Container defaultActiveKey="reported">
          <Nav variant="tabs" className="mt-4 mb-4">
            <Nav.Item>
              <Nav.Link eventKey="reported">Reportadas por Mim ({reportedByMe.length})</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="supported">Apoiadas ({supportedByMe.length})</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="reported">
              <Row>
                {reportedByMe.length > 0 ?
                    reportedByMe.map(occ => <OccurrenceCard key={occ.id} occurrence={occ} />) :
                    <div className="col-12 text-center py-5">
                        <h4 className="text-muted">Você ainda não reportou nenhuma ocorrência.</h4>
                        <Link to="/mapa" className="btn btn-primary mt-3">Ir para o Mapa</Link>
                    </div>}
              </Row>
            </Tab.Pane>
            <Tab.Pane eventKey="supported">
              <Row>
                {supportedByMe.length > 0 ?
                    supportedByMe.map(occ => <OccurrenceCard key={occ.id} occurrence={occ} />) :
                    <div className="col-12 text-center py-5">
                        <h4 className="text-muted">Você ainda não apoiou nenhuma ocorrência.</h4>
                        <Link to="/mapa" className="btn btn-primary mt-3">Explorar Ocorrências</Link>
                    </div>}
              </Row>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </>
  );
}

export default UserDashboard;
