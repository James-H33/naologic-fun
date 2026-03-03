export function loadFromStorageByKey(key: string) {
  const data = localStorage.getItem(key);

  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Error parsing localStorage data for key', key, ':', e);
      return null;
    }
  }

  return null;
}
