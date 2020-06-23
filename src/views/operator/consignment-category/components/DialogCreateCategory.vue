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
                label="Tên loại hàng"
                name="name"
                prepend-icon="mdi-account"
                type="text"
                v-model="categorySync.name"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs9>
              <v-text-field
                label="Mô tả"
                name="description"
                prepend-icon="mdi-account"
                type="text"
                v-model="categorySync.description"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn @click="updateCategory()" color="primary" v-if="categorySync.id"
          >Cập nhập</v-btn
        >
        <v-btn @click="addCategory()" color="primary" v-else>Thêm mới</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { ICategory } from "@/entity/category";
import { createCategory, updateCategory, getCategories } from "@/api/category";
import { PaginationResponse } from "@/api/payload";

@Component
export default class DialogCreateCategory extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("category", { type: Object }) categorySync!: ICategory;
  @PropSync("categories", { type: Array }) categoriesSync!: Array<ICategory>;
  @PropSync("options", { type: Object }) optionsSync!: {
    descending: true;
    page: number;
    itemsPerPage: number;
    totalItems: number;
    itemsPerPageItems: Array<number>;
  };
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  title = this.categorySync ? "Cập nhập" : "Thêm mới";
  addCategory() {
    if (this.categorySync) {
      createCategory(this.categorySync)
        .then(res => {
          console.log(res.data);
          const response: ICategory = res.data;
          this.categorySync = response;
          this.messageSync =
            "Thêm mới thành công loại hàng: " + this.categorySync.name;
          getCategories({
            page: 0,
            limit: 5
          })
            .then(res => {
              const response: PaginationResponse<ICategory> = res.data;
              this.categoriesSync = response.data;
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
  updateCategory() {
    if (this.categorySync.id) {
      updateCategory(this.categorySync)
        .then(res => {
          console.log(res.data);
          const response: ICategory = res.data;
          this.categorySync = response;
          this.messageSync =
            "Cập nhập thành công loại hàng: " + this.categorySync.name;
          getCategories({
            page: 0,
            limit: 5
          })
            .then(res => {
              const response: PaginationResponse<ICategory> = res.data;
              this.categoriesSync = response.data;
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
