import app from './app.js';

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') { // Only start the server if not in test mode
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
