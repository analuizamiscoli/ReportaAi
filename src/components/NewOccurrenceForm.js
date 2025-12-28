import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import './NewOccurrenceForm.css';
import MiniMap from './MiniMap';

const categories = [
  { id: 1, name: 'Buraco na Via', icon: '🚧' },
  { id: 2, name: 'Lâmpada Queimada', icon: '💡' },
  { id: 3, name: 'Mato Alto', icon: '🌾' },
  { id: 4, name: 'Lixo Acumulado', icon: '🗑️' },
  { id: 5, name: 'Sinalização Danificada', icon: '🚦' },
  { id: 6, name: 'Outro', icon: '❓' },
];

const initialFormData = {
    category: '',
    photo: null,
    pos: null,
    description: '',
    address: { street: '', number: '', neighborhood: '' } // Adicionado campo de endereço
};

function NewOccurrenceForm({ show, handleClose, onNewOccurrence }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [locationConfirmed, setLocationConfirmed] = useState(false);

  useEffect(() => {
      if (show) {
          setStep(1);
          setFormData(initialFormData);
          setLocationConfirmed(false);
      }
  }, [show]);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const updateFormData = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  }

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const previewUrl = URL.createObjectURL(file);
        updateFormData('photo', { file: file, previewUrl: previewUrl });
    }
  };

  const handleLocationFound = () => {
      setLocationConfirmed(true);
  }

  const handlePositionChange = (newPos) => {
      updateFormData('pos', newPos);
  }

  // Novo handler para receber o endereço do MiniMap
  const handleAddressChange = (newAddress) => {
      updateFormData('address', newAddress);
  }

  const handleSubmit = () => {
      onNewOccurrence(formData);
      handleClose();
  }

  const renderStep1 = () => (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Passo 1: Qual o problema?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          {categories.map(category => (
            <div key={category.id} className="col-6 col-md-4 mb-3">
              <div
                className={`card category-card text-center ${formData.category === category.name ? 'selected' : ''}`}
                onClick={() => updateFormData('category', category.name)}
              >
                <div className="card-body">
                  <div style={{ fontSize: '48px' }}>{category.icon}</div>
                  <p className="mt-2">{category.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleNext} disabled={!formData.category}>
          Avançar
        </Button>
      </Modal.Footer>
    </>
  );

  const renderStep2 = () => (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Passo 2: Anexe uma foto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Para agilizar a resolução, envie uma foto do problema.</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handlePhotoUpload} />
        </Form.Group>
        {formData.photo && (
            <div className="text-center">
                <img src={formData.photo.previewUrl} alt="Preview" style={{maxWidth: '100%', maxHeight: '200px', marginTop: '10px'}}/>       
                <p className="text-muted small">{formData.photo.file.name}</p>
            </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleBack}>Voltar</Button>
        <Button variant="primary" onClick={handleNext} disabled={!formData.photo}>
          Avançar
        </Button>
      </Modal.Footer>
    </>
  );

  const renderStep3 = () => (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Passo 3: Confirme o local</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {show && step === 3 && (
            <MiniMap 
                onLocationFound={handleLocationFound} 
                onPositionChange={handlePositionChange} 
                onAddressChange={handleAddressChange} // Passando o novo handler
            />
        )}
        <p className='small text-center mt-2'>Use a busca ou arraste o pino para ajustar a localização exata.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleBack}>Voltar</Button>
        <Button variant="primary" onClick={handleNext} disabled={!locationConfirmed}>
          Avançar
        </Button>
      </Modal.Footer>
    </>
  );

  const renderStep4 = () => (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Passo 4: Adicione detalhes (Opcional)</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formDescription">
          <Form.Label>Se quiser, descreva mais detalhes sobre o problema.</Form.Label>
          <Form.Control as="textarea" rows={4} placeholder="Ex: O buraco fica em frente ao número 100 e é fundo..." onChange={(e) => updateFormData('description', e.target.value)} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleBack}>Voltar</Button>
        <Button variant="success" onClick={handleSubmit}>Enviar Ocorrência</Button>
      </Modal.Footer>
    </>
  );

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static" keyboard={false}>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
    </Modal>
  );
}

export default NewOccurrenceForm;
