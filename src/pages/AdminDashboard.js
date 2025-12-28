import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Table, DropdownButton, Dropdown, Badge, Button, Modal, Form } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './AdminDashboard.css';

const statusConfig = {
  reported: { label: 'Reportado', bg: 'danger' },
  'in-progress': { label: 'Em Andamento', bg: 'warning' },
  resolved: { label: 'Resolvido', bg: 'success' },
};

function AdminDashboard({ allOccurrences, onStatusChange }) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOccurrence, setSelectedOccurrence] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });

  const handleShowDetailModal = (occ) => {
    setSelectedOccurrence(occ);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => setShowDetailModal(false);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedOccurrences = useMemo(() => {
    let sortableItems = [...allOccurrences];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (sortConfig.key === 'date') {
            valA = new Date(valA).getTime();
            valB = new Date(valB).getTime();
        }

        if (valA < valB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [allOccurrences, sortConfig]);

  const filteredAndSortedOccurrences = sortedOccurrences.filter(occ => {
      if (statusFilter === 'all') return true;
      return occ.status === statusFilter;
  });

  const summary = {
    reported: allOccurrences.filter(o => o.status === 'reported').length,
    inProgress: allOccurrences.filter(o => o.status === 'in-progress').length,
    resolved: allOccurrences.filter(o => o.status === 'resolved').length,
  };

  const getSortArrow = (key) => {
      if (sortConfig.key !== key) return <span className="sort-arrow"> ↕️</span>;
      return <span className="sort-arrow">{sortConfig.direction === 'ascending' ? ' ⬆️' : ' ⬇️'}</span>;
  }

  return (
    <>
      <Container fluid className="admin-dashboard p-4">
        <div className="d-flex justify-content-between align-items-center">
          <h1 style={{color: 'var(--admin-primary)'}}>Painel Administrativo</h1>
          <div>
            <Link to="/mapa" state={{ isAdmin: true }} className="btn btn-primary me-2">Ver Mapa de Ocorrências</Link>
            <Link to="/" className="btn btn-outline-danger">Sair</Link>
          </div>
        </div>

        <Row className="my-4">
            <Col md={4}><Card><Card.Body className="text-center"><Card.Title>Reportadas</Card.Title><h2>{summary.reported}</h2></Card.Body></Card></Col>
            <Col md={4}><Card><Card.Body className="text-center"><Card.Title>Em Andamento</Card.Title><h2>{summary.inProgress}</h2></Card.Body></Card></Col>
            <Col md={4}><Card><Card.Body className="text-center"><Card.Title>Resolvidas</Card.Title><h2>{summary.resolved}</h2></Card.Body></Card></Col>
        </Row>

        <Card>
          <Card.Header>
            <Row className="align-items-center">
                <Col md={6}><Card.Title>Todas as Ocorrências</Card.Title></Col>
                <Col md={6}>
                    <Form.Group as={Row} className="justify-content-end">
                        <Form.Label column sm="auto" className="my-1">Filtrar por status:</Form.Label>
                        <Col sm="auto">
                            <Form.Select size="sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                                <option value="all">Todos</option>
                                <option value="reported">Reportado</option>
                                <option value="in-progress">Em Andamento</option>
                                <option value="resolved">Resolvido</option>
                            </Form.Select>
                        </Col>
                    </Form.Group>
                </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Categoria</th>
                  <th>Endereço</th>
                  <th onClick={() => requestSort('date')} style={{cursor: 'pointer', whiteSpace: 'nowrap'}}>Data{getSortArrow('date')}</th>
                  <th onClick={() => requestSort('supporters')} style={{cursor: 'pointer', whiteSpace: 'nowrap'}}>Apoios{getSortArrow('supporters')}</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedOccurrences.map(occ => (
                  <tr key={occ.id}>
                    <td>{occ.id}</td>
                    <td>{occ.category}</td>
                    <td>{occ.address}</td>
                    <td>{new Date(occ.date).toLocaleDateString()}</td>
                    <td>{occ.supporters}</td>
                    <td><Badge bg={statusConfig[occ.status].bg}>{statusConfig[occ.status].label}</Badge></td>
                    <td>
                      <div className="admin-actions-cell">
                        <Button 
                            variant="info" 
                            size="sm" 
                            onClick={() => handleShowDetailModal(occ)} 
                            className="admin-btn-fixed"
                        >
                            Detalhes
                        </Button>
                        <DropdownButton 
                            id={`dropdown-${occ.id}`} 
                            title="Status" 
                            size="sm" 
                            variant="secondary"
                            toggleClassName="admin-btn-fixed"
                        >
                            <Dropdown.Item onClick={() => onStatusChange(occ.id, 'reported')}>Reportado</Dropdown.Item>
                            <Dropdown.Item onClick={() => onStatusChange(occ.id, 'in-progress')}>Em Andamento</Dropdown.Item>
                            <Dropdown.Item onClick={() => onStatusChange(occ.id, 'resolved')}>Resolvido</Dropdown.Item>
                        </DropdownButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>

      {selectedOccurrence && (
        <Modal show={showDetailModal} onHide={handleCloseDetailModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Detalhes da Ocorrência #{selectedOccurrence.id}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
                <Col md={6}>
                    <h5>{selectedOccurrence.category}</h5>
                    <p><strong>Endereço:</strong> {selectedOccurrence.address}</p>
                    <p><strong>Data:</strong> {new Date(selectedOccurrence.date).toLocaleDateString()}</p>
                    <p><strong>Apoios:</strong> {selectedOccurrence.supporters}</p>
                    <p><strong>Status:</strong> <Badge bg={statusConfig[selectedOccurrence.status].bg}>{statusConfig[selectedOccurrence.status].label}</Badge></p>
                    <hr />
                    <h6>Descrição</h6>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedOccurrence.description}</ReactMarkdown>
                    <hr />
                    <h6>Reportado por:</h6>
                    <p><strong>Nome:</strong> {selectedOccurrence.userName}</p>
                    <p><strong>CPF:</strong> {selectedOccurrence.userCpf}</p>
                </Col>
                <Col md={6}>
                    <h6>Foto</h6>
                    {selectedOccurrence.photo ?
                        <img src={selectedOccurrence.photo} alt={selectedOccurrence.category} className="img-fluid rounded" /> :
                        <p className="text-muted">Nenhuma foto fornecida.</p>
                    }
                </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDetailModal}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default AdminDashboard;
