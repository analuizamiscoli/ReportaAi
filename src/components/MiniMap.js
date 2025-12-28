import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function ResizeMap({ center }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    map.flyTo(center, map.getZoom());
  }, [map, center]);
  return null;
}

function MiniMap({ onLocationFound, onPositionChange, onAddressChange }) {
  const [position, setPosition] = useState([-21.7642, -43.3526]);
  const [address, setAddress] = useState({ street: '', number: '', neighborhood: '' });
  const [validated, setValidated] = useState(false);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
      onPositionChange(position);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      const newAddress = { ...address, [name]: value };
      setAddress(newAddress);
      
      // Propaga a mudança de endereço para o componente pai
      if (onAddressChange) {
        onAddressChange(newAddress);
      }

      if (searchError) {
          setSearchError(null);
      }
  }

  const markerEventHandlers = useMemo(() => ({
    dragend(e) {
      const marker = e.target;
      const latLng = marker.getLatLng();
      const newPos = [latLng.lat, latLng.lng];
      setPosition(newPos);
      onPositionChange(newPos);
    },
  }), [onPositionChange]);

  const handleAddressSearch = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    setValidated(true);
    setSearchError(null);

    if (form.checkValidity() === false) {
      return;
    }

    const { street, number, neighborhood } = address;
    const query = `${street}, ${number}, ${neighborhood}, Juiz de Fora, MG`;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const newPos = [parseFloat(lat), parseFloat(lon)];
          setPosition(newPos);
          onPositionChange(newPos);
          onLocationFound();
        } else {
          setSearchError('Endereço não encontrado. Por favor, verifique os dados inseridos.');
        }
      })
      .catch(err => {
          console.error("Erro ao buscar endereço:", err);
          setSearchError('Ocorreu um erro ao buscar o endereço. Tente novamente mais tarde.');
      });
  };

  return (
    <div>
        <Form noValidate validated={validated} onSubmit={handleAddressSearch}>
            <Row className="mb-2">
                <Col md={8}>
                    <Form.Group>
                        <Form.Label>Rua</Form.Label>
                        <Form.Control required type="text" name="street" value={address.street} onChange={handleInputChange} placeholder="Ex: Rua Halfeld" />
                        <Form.Control.Feedback type="invalid">Por favor, informe a rua.</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Número</Form.Label>
                        <Form.Control required type="text" name="number" value={address.number} onChange={handleInputChange} placeholder="Ex: 520" />
                        <Form.Control.Feedback type="invalid">Por favor, informe o número.</Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Group>
                        <Form.Label>Bairro</Form.Label>
                        <Form.Control required type="text" name="neighborhood" value={address.neighborhood} onChange={handleInputChange} placeholder="Ex: Centro" />
                        <Form.Control.Feedback type="invalid">Por favor, informe o bairro.</Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Button type="submit" variant="outline-secondary" className="w-100">
                Buscar Endereço no Mapa
            </Button>
        </Form>

        {searchError && <Alert variant="danger" className="mt-3">{searchError}</Alert>}

        <div style={{ height: '250px', width: '100%', marginTop: '15px' }}>
            <MapContainer center={position} zoom={16} scrollWheelZoom={false} style={{ height: '100%' }}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                draggable={true}
                eventHandlers={markerEventHandlers}
                position={position}
                >
                </Marker>
                <ResizeMap center={position} />
            </MapContainer>
        </div>
    </div>
  );
}

export default MiniMap;
