import { configSchema } from "./schemas";

export function listConfigs(): string[] {
  const items = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("stops_")) {
      items.push(key.slice(6));
    }
  }
  return items;
}

export function saveConfig(locationId: string, config: string[]): void {
  const asJson = JSON.stringify(config);
  localStorage.setItem(`stops_${locationId}`, asJson);
}

export function loadConfig(locationId: string): string[] {
  const data = localStorage.getItem(`stops_${locationId}`);
  return data ? JSON.parse(data) : [];
}

export function saveRoutes(locationId: string, routes: string[]): void {
  const asJson = JSON.stringify(routes);
  localStorage.setItem(`routes_${locationId}`, asJson);
}

export function loadRoutes(locationId: string): string[] {
  const data = localStorage.getItem(`routes_${locationId}`);
  return data ? JSON.parse(data) : [];
}

export function migrateOldConfig(): void {
  const data = localStorage.getItem("config");
  if (!data) {
    return;
  }
  try {
    const oldConfig = JSON.parse(data ?? "");
    const parsedConfig = configSchema.parse(oldConfig);
    saveConfig("home", parsedConfig);
    localStorage.removeItem("config");
  } catch (e) {
    console.error("Failed to migrate old config", e);
  }
}
