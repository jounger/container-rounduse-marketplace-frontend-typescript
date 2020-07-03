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
