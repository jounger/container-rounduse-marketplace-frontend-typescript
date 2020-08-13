<template>
  <v-container>
    <v-file-input
      v-model="fileInput"
      label="Select Image File..."
      counter
      :show-size="1024"
      :accept="acceptTypes"
    ></v-file-input>
    <v-btn :disabled="fileInput == null" color="primary" @click.stop="onUpload"
      >Upload</v-btn
    >
    <!-- <v-img
      max-width="400px"
      :src="
        fileResponse
          ? fileResponse.fileDownloadUri
          : 'http://localhost:8085/api/file/download/ana.png'
      "
    ></v-img> -->
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { uploadFile } from "@/api/file";
import { IFile } from "@/entity/file";

@Component
export default class UploadFile extends Vue {
  @Prop() acceptTypes!: Array<string>;

  fileInput = null as Blob | null;
  fileResponse = null as IFile | null;

  async onUpload() {
    if (this.fileInput) {
      const formData = new FormData();
      formData.append("file", this.fileInput);
      const _file = await uploadFile(formData);
      if (_file.data) {
        this.fileResponse = _file.data;
      }
    }
  }
}
</script>
