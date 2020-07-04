export function toCapitalize(input: string) {
  return input[0].toUpperCase() + input.slice(1);
}
export function isEmptyObject(obj: object) {
  if (Object.keys(obj).length === 0 && obj.constructor === Object) return true;
  return false;
}

export function isValidDate(d: Date) {
  return d instanceof Date && !isNaN(d.getTime());
}

export function addTimeToDate(input: string) {
  const date = input.substring(0, 10);
  const d = new Date(date);
  if (isValidDate(d)) {
    return `${date}T00:00`;
  }
  return `${date}`;
}

export function addHoursToDate(d: Date, h: number) {
  const date = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  if (isValidDate(date)) {
    return new Date(date.setHours(date.getHours() + h)).toISOString().substr(0, 16);
  } else {
    return date.toISOString().substr(0, 16);
  }
}
