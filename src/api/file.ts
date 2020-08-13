import Vue from "vue";

export function downloadFile(fileName: string) {
  return Vue.axios.get(`/file/download/${fileName}`);
}

export function uploadFile(file: FormData) {
  return Vue.axios.post("/file/upload", file);
}

export function uploadMultipleFiles(files: FormData[]) {
  return Vue.axios.post("/file/uploadMultiple", files);
}
