import { nanoid } from 'nanoid';

// Cookie name for storing the sync ID
const SYNC_ID_COOKIE = 'bus_stops_sync_id';

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
    if (key?.startsWith('stops_') || key?.startsWith('routes_')) {
      configsToSave[key] = configs.getItem(key) ?? '';
    }
  }

  const response = await fetch('/api/kv', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      syncId,
      data: configsToSave,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to save to cloud');
  }
}

// Load all configs from cloud
export async function loadFromCloud(syncId: string): Promise<void> {
  const response = await fetch(`/api/kv?syncId=${encodeURIComponent(syncId)}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Sync ID not found');
    }
    throw new Error('Failed to load from cloud');
  }

  const { data: configs } = await response.json() as { data: Record<string, string> };
  if (!configs) return;
  
  // Clear existing stops configs
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('stops_') || key.startsWith('routes_')) {
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
  const response = await fetch(`/api/kv?syncId=${encodeURIComponent(syncId)}`, {
    method: 'HEAD',
  });
  return response.ok;
} 