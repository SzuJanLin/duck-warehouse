export default (req, res, next) => {
    // Authentication logic here (e.g., checking for a token)
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
    try {
      // Add logic to verify token, decode user, etc.
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
  