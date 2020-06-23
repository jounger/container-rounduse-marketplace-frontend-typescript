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
            style="margin-left:412px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-layout row>
            <v-flex xs9>
              <v-text-field
                label="Tên ICD"
                name="fullname"
                prepend-icon="mdi-account"
                type="text"
                v-model="icdSync.fullname"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs9>
              <v-text-field
                label="Mã code"
                name="nameCode"
                prepend-icon="mdi-account"
                type="text"
                v-model="icdSync.nameCode"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs9>
              <v-text-field
                label="Vị trí"
                name="address"
                prepend-icon="mdi-account"
                type="text"
                v-model="icdSync.address"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn @click="updateIcd()" color="primary" v-if="icdSync.id"
          >Cập nhập</v-btn
        >
        <v-btn @click="addIcd()" color="primary" v-else>Thêm mới</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { IIcd } from "@/entity/icd";
import { createIcd, updateIcd, getIcds } from "@/api/icd";
import { PaginationResponse } from "@/api/payload";

@Component
export default class DialogCreateIcd extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("icd", { type: Object }) icdSync!: IIcd;
  @PropSync("icds", { type: Array }) icdsSync!: Array<IIcd>;
  @PropSync("options", { type: Object }) optionsSync!: {
    descending: true;
    page: number;
    itemsPerPage: number;
    totalItems: number;
    itemsPerPageItems: Array<number>;
  };
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  title = this.icdSync ? "Cập nhập" : "Thêm mới";
  addIcd() {
    if (this.icdSync) {
      createIcd(this.icdSync)
        .then(res => {
          console.log(res.data);
          const response: IIcd = res.data;
          this.icdSync = response;
          this.messageSync =
            "Thêm mới thành công ICD: " + this.icdSync.fullname;
          getIcds({
            page: 0,
            limit: 5
          })
            .then(res => {
              const response: PaginationResponse<IIcd> = res.data;
              this.icdsSync = response.data;
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
  updateIcd() {
    if (this.icdSync.id) {
      updateIcd(this.icdSync)
        .then(res => {
          console.log(res.data);
          const response: IIcd = res.data;
          this.icdSync = response;
          this.messageSync =
            "Cập nhập thành công ICD: " + this.icdSync.fullname;
          getIcds({
            page: 0,
            limit: 5
          })
            .then(res => {
              const response: PaginationResponse<IIcd> = res.data;
              this.icdsSync = response.data;
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
