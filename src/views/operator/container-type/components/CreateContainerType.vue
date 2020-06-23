<template>
  <v-dialog v-model="dialogAddSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{ title }}</span>
          <v-btn
            icon
            dark
            @click="dialogAddSync = false"
            style="margin-left:395px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Tên loại Container"
                  name="name"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="containerTypeSync.name"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Chi tiết"
                  name="description"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="containerTypeSync.description"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Khối lượng vỏ"
                  name="tareWeight"
                  prepend-icon="mdi-lock"
                  type="number"
                  v-model="containerTypeSync.tareWeight"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Trọng tải"
                  name="payloadCapacity"
                  prepend-icon="mdi-lock"
                  type="number"
                  v-model="containerTypeSync.payloadCapacity"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Công suất khối"
                  name="cubicCapacity"
                  prepend-icon="mdi-lock"
                  type="number"
                  v-model="containerTypeSync.cubicCapacity"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Chiều dài trong"
                  name="internalLength"
                  prepend-icon="mdi-lock"
                  type="number"
                  v-model="containerTypeSync.internalLength"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Chiều rộng trong"
                  name="internalWidth"
                  prepend-icon="mdi-lock"
                  type="number"
                  v-model="containerTypeSync.internalWidth"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Chiều cao trong"
                  name="internalHeight"
                  prepend-icon="mdi-lock"
                  type="number"
                  v-model="containerTypeSync.internalHeight"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Chiều rộng cửa mở"
                  name="doorOpeningWidth"
                  prepend-icon="mdi-lock"
                  type="number"
                  v-model="containerTypeSync.doorOpeningWidth"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Chiều cao cửa mở"
                  name="doorOpeningHeight"
                  prepend-icon="mdi-lock"
                  type="number"
                  v-model="containerTypeSync.doorOpeningHeight"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn
          @click="updateContainerType()"
          color="primary"
          v-if="containerTypeSync.id"
          >Cập nhập</v-btn
        >
        <v-btn @click="addContainerType()" color="primary" v-else
          >Thêm mới</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { IContainerType } from "@/entity/container-type";
import {
  createContainerType,
  updateContainerType,
  getContainerTypes
} from "@/api/container-type";
import { PaginationResponse } from "@/api/payload";

@Component
export default class DialogCreateContainerType extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("containerType", { type: Object })
  containerTypeSync!: IContainerType;
  @PropSync("containerTypes", { type: Array }) containerTypesSync!: Array<
    IContainerType
  >;
  @PropSync("options", { type: Object }) optionsSync!: {
    descending: true;
    page: number;
    itemsPerPage: number;
    totalItems: number;
    itemsPerPageItems: Array<number>;
  };
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  title = this.containerTypeSync ? "Cập nhập" : "Thêm mới";
  addContainerType() {
    if (this.containerTypeSync) {
      createContainerType(this.containerTypeSync)
        .then(res => {
          console.log(res.data);
          const response: IContainerType = res.data;
          this.containerTypeSync = response;
          this.messageSync =
            "Thêm mới thành công loại Container: " +
            this.containerTypeSync.name;
          getContainerTypes({
            page: 0,
            limit: 5
          })
            .then(res => {
              const response: PaginationResponse<IContainerType> = res.data;
              this.containerTypesSync = response.data;
              this.optionsSync.totalItems = response.total_elements;
            })
            .catch(err => console.log(err))
            .finally();
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(
          () => ((this.snackbarSync = true), (this.dialogAddSync = false))
        );
    }
  }
  updateContainerType() {
    if (this.containerTypeSync.id) {
      updateContainerType(this.containerTypeSync)
        .then(res => {
          console.log(res.data);
          const response: IContainerType = res.data;
          this.containerTypeSync = response;
          this.messageSync =
            "Cập nhập thành công loại Container: " +
            this.containerTypeSync.name;
          getContainerTypes({
            page: 0,
            limit: 5
          })
            .then(res => {
              const response: PaginationResponse<IContainerType> = res.data;
              this.containerTypesSync = response.data;
              this.optionsSync.totalItems = response.total_elements;
            })
            .catch(err => console.log(err))
            .finally();
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(
          () => ((this.snackbarSync = true), (this.dialogAddSync = false))
        );
    }
  }
}
</script>
