export function getDateAsISOString(date: Date | null): string | null {
  if (!date) {
    return null;
  }

  const isoString = date.toISOString();

  return isoString.split('T')[0];
}
