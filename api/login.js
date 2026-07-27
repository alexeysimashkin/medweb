export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { email, password } = req.body;
    
    res.status(200).json({ 
      success: true,
      message: 'Вход выполнен!',
      doctor: { 
        id: 1, 
        full_name: 'Test Doctor', 
        email: email || 'test@test.com' 
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
