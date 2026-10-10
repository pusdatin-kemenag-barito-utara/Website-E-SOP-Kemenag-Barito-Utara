import PocketBase from "pocketbase";
import { getEnv } from "./env";

const createPocketBaseClient = () => {
  const url = getEnv("PUBLIC_POCKETBASE_URL", "");
  const client = new PocketBase(url);
  // Matikan auto-cancellation bawaan PocketBase agar request paralel tidak terbatalkan
  client.autoCancellation(false);
  return client;
};

const globalForPB = globalThis as unknown as {
  pb: PocketBase | undefined;
};

export const pb = globalForPB.pb ?? createPocketBaseClient();

if (import.meta.env.DEV) globalForPB.pb = pb;

export default pb;
