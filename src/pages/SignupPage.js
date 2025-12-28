import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import BackButton from '../components/BackButton';
import api from '../services/api';
import './AuthForm.css';

// Página de Cadastro de novo usuário
function SignupPage() {
  const navigate = useNavigate();
  
  // Estados para os campos do formulário
  const [formData, setFormData] = useState({
      nome_completo: '',
      cpf: '',
      email: '',
      password: '',
      password_confirmation: '',
      numero: ''
  });

  const [address, setAddress] = useState({
      cep: '',
      rua: '',
      bairro: '',
  });

  const [showPassword, setShowPassword] = useState(false); // Novo estado para mostrar senha
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- FUNÇÕES DE MÁSCARA (Manual e Segura) ---
  
  const maskCPF = (value) => {
    return value
      .replace(/\D/g, '') // Remove tudo o que não é dígito
      .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o terceiro e o quarto dígitos
      .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o terceiro e o quarto dígitos de novo
      .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Coloca um hífen entre o terceiro e o quarto dígitos
      .replace(/(-\d{2})\d+?$/, '$1'); // Impede de digitar mais que 11 dígitos
  };

  const maskCEP = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  // Atualiza os dados gerais do formulário com suporte a máscaras
  const handleChange = (e) => {
      let { name, value } = e.target;

      // Aplica máscaras específicas
      if (name === 'cpf') {
        value = maskCPF(value);
      }

      setFormData({
          ...formData,
          [name]: value
      });
  };

  // Atualiza o CEP com máscara
  const handleCepChange = (e) => {
    const value = maskCEP(e.target.value);
    setAddress({...address, cep: value});
  };

  // Função chamada quando o usuário tira o foco do campo CEP
  const handleCepBlur = (e) => {
    const cep = e.target.value.replace(/[^0-9]/g, '');
    if (cep.length !== 8) return;

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(res => res.json())
      .then(data => {
        if (!data.erro) {
            setAddress(prev => ({
                ...prev,
                rua: data.logradouro,
                bairro: data.bairro,
            }));
        }
      })
      .catch(err => console.error("Erro ao buscar CEP", err));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        const payload = {
            ...formData,
            cep: address.cep,
            rua: address.rua,
            bairro: address.bairro
        };

        const response = await api.post('/register', payload);

        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.usuario));

        alert('Cadastro realizado com sucesso!');
        navigate('/mapa');

    } catch (err) {
        console.error(err);
        if (err.response && err.response.data && err.response.data.errors) {
            const firstError = Object.values(err.response.data.errors)[0][0];
            setError(firstError);
        } else {
            setError('Falha ao realizar cadastro. Verifique os dados.');
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="auth-page">
        <BackButton to="/" />
        <div className="auth-form-container">
            <Link to="/" className="auth-logo">Reporta Aí</Link>
            <Card>
                <Card.Body>
                <Card.Title as="h2" className="text-center mb-4">Cadastrar-se</Card.Title>
                
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSignup}>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Nome Completo</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="nome_completo"
                            placeholder="Seu nome" 
                            value={formData.nome_completo}
                            onChange={handleChange}
                            required 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicCpf">
                        <Form.Label>CPF</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="cpf"
                            placeholder="000.000.000-00" 
                            value={formData.cpf}
                            onChange={handleChange}
                            maxLength="14"
                            required 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                            type="email" 
                            name="email"
                            placeholder="seu@email.com" 
                            value={formData.email}
                            onChange={handleChange}
                            required 
                        />
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Senha</Form.Label>
                                <Form.Control 
                                    type={showPassword ? "text" : "password"} // Dinâmico
                                    name="password"
                                    placeholder="Senha" 
                                    value={formData.password}
                                    onChange={handleChange}
                                    required 
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="formBasicPasswordConf">
                                <Form.Label>Confirmar Senha</Form.Label>
                                <Form.Control 
                                    type={showPassword ? "text" : "password"} // Dinâmico
                                    name="password_confirmation"
                                    placeholder="Repita a senha" 
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    required 
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Checkbox para mostrar senhas */}
                    <Form.Group className="mb-3" controlId="formShowPasswordSignup">
                        <Form.Check 
                            type="checkbox" 
                            label="Mostrar senhas" 
                            onChange={(e) => setShowPassword(e.target.checked)}
                        />
                    </Form.Group>

                    <hr />

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="formBasicCep">
                                <Form.Label>CEP</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="00000-000" 
                                    value={address.cep}
                                    onChange={handleCepChange}
                                    onBlur={handleCepBlur}
                                    maxLength="9"
                                    required 
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3" controlId="formBasicStreet">
                        <Form.Label>Rua</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Sua rua" 
                            value={address.rua} 
                            onChange={e => setAddress({...address, rua: e.target.value})} 
                            required 
                        />
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="formBasicNumber">
                                <Form.Label>Número</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="numero"
                                    placeholder="Nº" 
                                    value={formData.numero}
                                    onChange={handleChange}
                                    required 
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="formBasicNeighborhood">
                                <Form.Label>Bairro</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Seu bairro" 
                                    value={address.bairro} 
                                    onChange={e => setAddress({...address, bairro: e.target.value})} 
                                    required 
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Criar Conta'}
                    </Button>
                </Form>
                </Card.Body>
                <Card.Footer className="text-center">
                    <small className="text-muted">
                        Já tem uma conta? <Link to="/login">Entrar</Link>
                    </small>
                </Card.Footer>
            </Card>
        </div>
    </div>
  );
}

export default SignupPage;
