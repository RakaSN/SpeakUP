export const authConfig = {
  secret: process.env.AUTH_SECRET,
  url: process.env.AUTH_URL || 'http://localhost:3000/api/auth',
};
