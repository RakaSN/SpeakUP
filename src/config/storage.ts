export const storageConfig = {
  driver: process.env.STORAGE_DRIVER || 'local',
  localPath: process.env.STORAGE_LOCAL_PATH || './storage/local',
  r2: {
    accountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID,
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  },
};
