export default function handler(req, res) {
  // Редирект на HTML-страницу из public
  res.writeHead(302, { Location: '/index.html' });
  res.end();
}
