import { createClient } from 'redis';

const url = process.env["REDIS_URL"];

if (!url) throw new Error("REDIS_URL is not found")

const client = await createClient({url})
  .on('error', err => console.log('Redis Client Error', err))
  .connect();

export default client;
