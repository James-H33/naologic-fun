export function setDataInStorageByKey(key: string, data: object): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error setting localStorage data for key', key, ':', e);
  }
}
