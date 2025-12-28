import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">

      <div className="landing-overlay">
        <div className="container">
          <h1 className="landing-logo" style={{ fontSize: '48px' }}>Reporta Aí</h1>
          <p className="landing-slogan">A cidade em suas mãos. Participe, fiscalize, melhore.</p>
          <div>
            <Link to="/login" className="btn btn-primary btn-lg me-2">Entrar</Link>
            <Link to="/signup" className="btn btn-primary btn-lg">Cadastrar-se</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;