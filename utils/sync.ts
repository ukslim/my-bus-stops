import { createClient } from '@vercel/kv';
import { nanoid } from 'nanoid';

// Cookie name for storing the sync ID
const SYNC_ID_COOKIE = 'bus_stops_sync_id';

// Initialize KV client with public environment variables
const kv = createClient({
  url: process.env.NEXT_PUBLIC_KV_REST_API_URL!,
  token: process.env.NEXT_PUBLIC_KV_REST_API_TOKEN!,
});

// Generate a new random sync ID
export function generateSyncId(): string {
  return nanoid(16);
}

// Get the current sync ID from cookie
export function getSyncId(): string | null {
  if (typeof document === 'undefined') return null;
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(SYNC_ID_COOKIE))
    ?.split('=')[1] ?? null;
}

// Set the sync ID in cookie
export function setSyncId(id: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${SYNC_ID_COOKIE}=${id}; path=/; max-age=31536000`; // 1 year
}

// Save all configs to cloud
export async function saveToCloud(syncId: string): Promise<void> {
  const configs = localStorage;
  const configsToSave: Record<string, string> = {};
  
  // Only save stops_* configs
  for (let i = 0; i < configs.length; i++) {
    const key = configs.key(i);
    if (key?.startsWith('stops_')) {
      configsToSave[key] = configs.getItem(key) ?? '';
    }
  }
  
  // Set expiration to 1 year (in seconds)
  const oneYearInSeconds = 31536000;
  await kv.set(syncId, configsToSave, { ex: oneYearInSeconds });
}

// Load all configs from cloud
export async function loadFromCloud(syncId: string): Promise<void> {
  const configs = await kv.get<Record<string, string>>(syncId);
  if (!configs) return;
  
  // Clear existing stops configs
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('stops_')) {
      localStorage.removeItem(key);
    }
  });
  
  // Set new configs
  Object.entries(configs).forEach(([key, value]) => {
    localStorage.setItem(key, value);
  });
}

// Check if a sync ID exists in Redis
export async function checkSyncId(syncId: string): Promise<boolean> {
  const exists = await kv.exists(syncId);
  return exists === 1;
} 