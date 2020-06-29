export function toCapitalize(input: string) {
  return input[0].toUpperCase() + input.slice(1);
}
export function convertToDateTime(input: string) {
  if (input != null) {
    const indexT = input.indexOf("T");
    if (indexT === -1) {
      return input + "T00:00";
    } else {
      return input;
    }
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
export function calculateFreeTime(input1: string, input2: string) {
  const date1 = new Date(input1);
  const date2 = new Date(input2);
  const freeTime = Math.abs(date2.getTime() - date1.getTime());
  return freeTime / (1000 * 3600 * 24);
}
export function isEmptyObject(obj: object) {
  if (Object.keys(obj).length === 0 && obj.constructor === Object) return true;
  return false;
}

export function isValidDate(d: Date) {
  return d instanceof Date && !isNaN(d.getTime());
}
