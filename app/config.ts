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
