'use client';

import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const register = async () => {
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: name, email, password })
      });
      const data = await res.json();
      setMessage(JSON.stringify(data, null, 2));
    } catch (error) {
      setMessage('Ошибка: ' + error.message);
    }
  };

  const login = async () => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      setMessage(JSON.stringify(data, null, 2));
    } catch (error) {
      setMessage('Ошибка: ' + error.message);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '400px', 
      margin: '50px auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>🏥 Medical MIS</h1>
      
      {/* РЕГИСТРАЦИЯ */}
      <div style={{ 
        marginBottom: '20px', 
        border: '1px solid #ddd', 
        padding: '20px', 
        borderRadius: '8px',
        background: '#f9f9f9'
      }}>
        <h3 style={{ marginTop: 0 }}>📝 Регистрация</h3>
        <input 
          style={{ 
            width: '100%', 
            padding: '10px', 
            marginBottom: '10px', 
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxSizing: 'border-box'
          }} 
          placeholder="Имя врача" 
          value={name}
          onChange={(e) => setName(e.target.value)} 
        />
        <input 
          style={{ 
            width: '100%', 
            padding: '10px', 
            marginBottom: '10px', 
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxSizing: 'border-box'
          }} 
          placeholder="Email" 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          style={{ 
            width: '100%', 
            padding: '10px', 
            marginBottom: '10px', 
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxSizing: 'border-box'
          }} 
          placeholder="Пароль" 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button 
          onClick={register} 
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: '#28a745', 
            color: 'white', 
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Зарегистрироваться
        </button>
      </div>

      {/* ВХОД */}
      <div style={{ 
        marginBottom: '20px', 
        border: '1px solid #ddd', 
        padding: '20px', 
        borderRadius: '8px',
        background: '#f9f9f9'
      }}>
        <h3 style={{ marginTop: 0 }}>🔑 Вход</h3>
        <input 
          style={{ 
            width: '100%', 
            padding: '10px', 
            marginBottom: '10px', 
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxSizing: 'border-box'
          }} 
          placeholder="Email" 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          style={{ 
            width: '100%', 
            padding: '10px', 
            marginBottom: '10px', 
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxSizing: 'border-box'
          }} 
          placeholder="Пароль" 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button 
          onClick={login} 
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: '#007bff', 
            color: 'white', 
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Войти
        </button>
      </div>

      {/* РЕЗУЛЬТАТ */}
      {message && (
        <div style={{ 
          marginTop: '20px', 
          background: '#fff3cd', 
          padding: '15px', 
          borderRadius: '4px',
          border: '1px solid #ffc107'
        }}>
          <pre style={{ 
            margin: 0, 
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
          }}>
            {message}
          </pre>
        </div>
      )}
    </div>
  );
}
