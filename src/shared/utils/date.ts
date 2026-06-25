export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isDue(isoDate: string, now = new Date()): boolean {
  return new Date(isoDate).getTime() <= now.getTime();
}
