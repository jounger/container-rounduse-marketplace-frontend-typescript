import { INTL_TIME_OPTION } from "./constants";
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
  if (input && input.length <= 10 && !input.includes("T")) {
    input += "T00:00";
  }
  const d = new Date(input);
  const date = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  if (isValidDate(date)) {
    return date.toISOString().substr(0, 16);
  }
  return "";
}

export function addMinutesToDate(input: string, m: number) {
  const d = new Date(addTimeToDate(input));
  const date = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  if (isValidDate(date)) {
    return new Date(date.setMinutes(date.getMinutes() + m))
      .toISOString()
      .substr(0, 16);
  } else {
    return date.toISOString().substr(0, 16);
  }
}

export function formatDatetime(input: string) {
  const roundDate = addTimeToDate(input);
  const d = new Date(roundDate);
  if (isValidDate(d)) {
    const formated = new Intl.DateTimeFormat("vi-VI", INTL_TIME_OPTION).format(
      d
    );
    return formated;
  }
  return `${roundDate}`;
}

export function formatPrice(value: string) {
  if (value.length > 0) {
    const val = parseInt(value) / 1;
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return "";
  }
}
export function convertCurrencyToNumber(value: string) {
  const number = value.replace(/[$,.]+/g, "");
  return number;
}

export function isEmptyString(input: string) {
  return input && input.length > 0 ? false : true;
}

export function currencyFormatter(num: number, cur?: string) {
  let currency = "VND";
  if (cur && !isEmptyString(cur)) {
    currency = cur;
  }
  return new Intl.NumberFormat("vi-VI", {
    style: "currency",
    currency: "VND"
  }).format(num);
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getErrorMessage(error: any) {
  // Error 😨
  console.log("Error", error);
  if (error.response) {
    /*
     * The request was made and the server responded with a
     * status code that falls out of the range of 2xx
     */
    console.log("Data", error.response.data);
    console.log("Status", error.response.status);
    console.log("Header", error.response.headers);
    return error.response.data.message;
  } else if (error.request) {
    /*
     * The request was made but no response was received, `error.request`
     * is an instance of XMLHttpRequest in the browser and an instance
     * of http.ClientRequest in Node.js
     */
    console.log("Request", error.request);
    return error.request;
  } else {
    // Something happened in setting up the request and triggered an Error
    console.log("Message", error.message);
    return error.message;
  }
}
