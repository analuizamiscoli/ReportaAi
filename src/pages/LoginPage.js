import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import BackButton from '../components/BackButton';
import api from '../services/api';
import './AuthForm.css';

// Página de Login
function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Novo estado para controlar visibilidade
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        const response = await api.post('/login', { email, password });

        // Salva o token e os dados do usuário no localStorage
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.usuario));

        // Redireciona com base no tipo de usuário retornado pelo banco
        if (response.data.usuario.tipo === 'Administrador') {
            navigate('/admin');
        } else {
            navigate('/mapa');
        }
    } catch (err) {
        console.error(err);
        if (err.response && err.response.data && err.response.data.message) {
            setError(err.response.data.message);
        } else {
            setError('Falha ao conectar com o servidor. Tente novamente mais tarde.');
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
                <Card.Title as="h2" className="text-center mb-4">Entrar</Card.Title>
                
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="seu@email.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Senha</Form.Label>
                    <Form.Control 
                        type={showPassword ? "text" : "password"} // Muda o tipo dinamicamente
                        placeholder="Senha" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                    </Form.Group>

                    {/* Checkbox para mostrar a senha */}
                    <Form.Group className="mb-3" controlId="formShowPassword">
                        <Form.Check 
                            type="checkbox" 
                            label="Mostrar senha" 
                            onChange={(e) => setShowPassword(e.target.checked)}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </Button>
                </Form>
                </Card.Body>
                <Card.Footer className="text-center">
                    <small className="text-muted">
                        Não tem uma conta? <Link to="/signup">Cadastre-se</Link>
                    </small>
                </Card.Footer>
            </Card>
        </div>
    </div>
  );
}

export default LoginPage;
