export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'SpeakUp',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  env: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
};
