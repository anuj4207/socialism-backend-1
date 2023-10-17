import { Storage } from '@google-cloud/storage';
console.log(process.env.BUCKET_KEY_FILE_NAME);

const storage = new Storage({
  keyFilename: './gcp.json',
  projectId: process.env.PROJECT_ID,
});
export const bucket = storage.bucket(process.env.BUCKET_NAME);
