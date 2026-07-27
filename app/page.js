'use client';

import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const register = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const checkApi = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hello');
      const data = await res.json();
      setMessage(JSON.stringify(data, null, 2));
    } catch (error) {
      setMessage('Ошибка: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '400px', 
      margin: '50px auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center' }}>🏥 Medical MIS</h1>
      
      {/* Кнопка проверки API */}
      <button 
        onClick={checkApi}
        disabled={loading}
        style={{ 
          width: '100%', 
          padding: '10px', 
          marginBottom: '20px',
          background: '#6c757d', 
          color: 'white', 
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {loading ? '⏳ Загрузка...' : '🔍 Проверить API'}
      </button>
      
      {/* Регистрация */}
      <div style={{ 
        marginBottom: '20px', 
        border: '1px solid #ddd', 
        padding: '20px', 
        borderRadius: '8px',
        background: '#f9f9f9'
      }}>
        <h3>📝 Регистрация</h3>
        <input 
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} 
          placeholder="Имя врача" 
          value={name}
          onChange={(e) => setName(e.target.value)} 
        />
        <input 
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} 
          placeholder="Email" 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} 
          placeholder="Пароль" 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button 
          onClick={register}
          disabled={loading}
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
          {loading ? '⏳ Загрузка...' : 'Зарегистрироваться'}
        </button>
      </div>

      {/* Вход */}
      <div style={{ 
        border: '1px solid #ddd', 
        padding: '20px', 
        borderRadius: '8px',
        background: '#f9f9f9'
      }}>
        <h3>🔑 Вход</h3>
        <input 
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} 
          placeholder="Email" 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} 
          placeholder="Пароль" 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button 
          onClick={login}
          disabled={loading}
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
          {loading ? '⏳ Загрузка...' : 'Войти'}
        </button>
      </div>

      {/* Результат */}
      {message && (
        <div style={{ 
          marginTop: '20px', 
          background: '#fff3cd', 
          padding: '15px', 
          borderRadius: '4px',
          border: '1px solid #ffc107'
        }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{message}</pre>
        </div>
      )}
    </div>
  );
}
