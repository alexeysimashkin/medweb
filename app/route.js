// /app/route.js
import { NextResponse } from 'next/server';

// Этот код будет обрабатывать GET-запросы к корню сайта
export async function GET() {
  // Твой HTML-контент для главной страницы
  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🏥 Medical MIS</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        h1 { text-align: center; }
        .card { border: 1px solid #ddd; padding: 20px; margin-bottom: 20px; border-radius: 8px; background: #f9f9f9; }
        input, button { width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
        button { background: #007bff; color: white; border: none; cursor: pointer; font-size: 16px; }
        .btn-api { background: #6c757d; margin-bottom: 20px; }
        .btn-register { background: #28a745; }
        pre { background: #fff3cd; padding: 15px; border-radius: 4px; border: 1px solid #ffc107; white-space: pre-wrap; }
    </style>
</head>
<body>
    <h1>🏥 Medical MIS</h1>
    <button class="btn-api" onclick="checkApi()">🔍 Проверить API</button>

    <div class="card">
        <h3>📝 Регистрация</h3>
        <input id="regName" placeholder="Имя врача" />
        <input id="regEmail" type="email" placeholder="Email" />
        <input id="regPassword" type="password" placeholder="Пароль" />
        <button class="btn-register" onclick="register()">Зарегистрироваться</button>
    </div>

    <div class="card">
        <h3>🔑 Вход</h3>
        <input id="loginEmail" type="email" placeholder="Email" />
        <input id="loginPassword" type="password" placeholder="Пароль" />
        <button onclick="login()">Войти</button>
    </div>

    <pre id="message"></pre>

    <script>
        const setMessage = (text) => {
            document.getElementById('message').textContent = text;
        };

        const checkApi = async () => {
            try {
                const res = await fetch('/api/hello');
                const data = await res.json();
                setMessage(JSON.stringify(data, null, 2));
            } catch (e) {
                setMessage('Ошибка: ' + e.message);
            }
        };

        const register = async () => {
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            try {
                const res = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullName: name, email, password })
                });
                const data = await res.json();
                setMessage(JSON.stringify(data, null, 2));
            } catch (e) {
                setMessage('Ошибка: ' + e.message);
            }
        };

        const login = async () => {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            try {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                setMessage(JSON.stringify(data, null, 2));
            } catch (e) {
                setMessage('Ошибка: ' + e.message);
            }
        };
    </script>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}
