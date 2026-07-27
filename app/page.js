// Вместо /api/hello
const res = await fetch('/api/hello');

// Вместо /api/register
const res = await fetch('/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ fullName: name, email, password })
});

// Вместо /api/login
const res = await fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
