export function toCapitalize(input: string) {
  return input[0].toUpperCase() + input.slice(1);
}

export function isEmptyObject(obj: object) {
  if (Object.keys(obj).length === 0 && obj.constructor === Object) return true;
  return false;
}
