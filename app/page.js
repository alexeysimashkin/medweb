'use client';

import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const register = async () => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: name, email, password })
    });
    const data = await res.json();
    setMessage(JSON.stringify(data));
  };

  const login = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setMessage(JSON.stringify(data));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h1>🏥 Medical MIS</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Регистрация</h3>
        <input style={{ width: '100%', padding: '10px', marginBottom: '10px' }} placeholder="Имя" onChange={(e) => setName(e.target.value)} />
        <input style={{ width: '100%', padding: '10px', marginBottom: '10px' }} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input style={{ width: '100%', padding: '10px', marginBottom: '10px' }} placeholder="Пароль" type="password" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={register} style={{ width: '100%', padding: '10px', background: 'green', color: 'white' }}>Зарегистрироваться</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Вход</h3>
        <input style={{ width: '100%', padding: '10px', marginBottom: '10px' }} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input style={{ width: '100%', padding: '10px', marginBottom: '10px' }} placeholder="Пароль" type="password" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={login} style={{ width: '100%', padding: '10px', background: 'blue', color: 'white' }}>Войти</button>
      </div>

      {message && <pre style={{ background: '#f0f0f0', padding: '10px' }}>{message}</pre>}
    </div>
  );
}
