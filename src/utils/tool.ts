export function toCapitalize(input: string) {
  return input[0].toUpperCase() + input.slice(1);
}
export function convertToDateTime(input: string) {
  if (input != null) {
    return input + "T00:00";
  } else {
    return "";
  }
}
export function convertFromDateTime(input: string) {
  if (input != null) {
    const indexT = input.indexOf("T");
    const indexYear = input.indexOf("-");
    const indexMonth = input.indexOf("-", indexYear + 1);
    return (
      input.slice(indexMonth + 1, indexT) +
      input.slice(indexYear, indexMonth + 1) +
      input.slice(0, indexYear) +
      " " +
      input.slice(indexT + 1, input.length)
    );
  } else return "";
}
export function isEmptyObject(obj: object) {
  if (Object.keys(obj).length === 0 && obj.constructor === Object) return true;
  return false;
}

export function isValidDate(d: Date) {
  return d instanceof Date && !isNaN(d.getTime());
}
