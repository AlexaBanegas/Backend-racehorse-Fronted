'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './styles/login.css'; 

export default function LoginPage() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false); 
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:63015/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Usuario: usuario, Password: password }),
      });

      if (res.ok) {
        router.push('/dashboard'); 
      } else {
        alert('Credenciales inválidas');
      }
    } catch (err) {
      alert('Error: El servidor .NET no responde');
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <h2 className="login-title">RACEHORSE LOGIN</h2>
        <p className="login-subtitle">Ingresa tus credenciales para continuar</p>
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">Usuario</label>
            <input 
              type="text" 
              placeholder="Ej: admin"
              className="login-input" 
              onChange={(e) => setUsuario(e.target.value)} 
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Contraseña</label>
            <div className="password-wrapper">
              <input 
                type={verPassword ? "text" : "password"} 
                placeholder="••••••••"
                className="login-input" 
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
              <button 
                type="button" 
                className="eye-button"
                onClick={() => setVerPassword(!verPassword)}
              >
                {verPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button">
            INGRESAR AL SISTEMA
          </button>
        </form>

      </div>
    </div>
  );
}

