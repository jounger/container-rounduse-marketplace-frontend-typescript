<template>
  <v-dialog v-model="dialogDelSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Xóa loại hàng</span>
          <v-btn
            icon
            dark
            @click="dialogDelSync = false"
            style="margin-left:375px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
              >Bạn có chắc chắn muốn xóa loại hàng này?</span
            >
            <div class="line"></div>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ categorySync.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogDelSync = false">Hủy</v-btn>
        <v-btn @click="removeCategory()" color="red">Xóa</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { ICategory } from "@/entity/category";
import { removeCategory } from "@/api/category";
import { getCategories } from "@/api/category";
import { PaginationResponse } from "@/api/payload";

@Component
export default class DialogDeleteCategory extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("category", { type: Object }) categorySync!: ICategory;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("categories", { type: Array }) categoriesSync!: Array<ICategory>;
  @PropSync("options", { type: Object }) optionsSync!: {
    descending: true;
    page: number;
    itemsPerPage: number;
    totalItems: number;
    itemsPerPageItems: Array<number>;
  };

  removeCategory() {
    if (this.categorySync.id) {
      removeCategory(this.categorySync.id)
        .then(res => {
          console.log(res.data);
          const response: ICategory = res.data;
          this.categorySync = response;
          this.messageSync =
            "Xóa thành công loại hàng: " + this.categorySync.name;
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
          this.messageSync = "Error happend";
        })
        .finally(
          () => ((this.snackbarSync = true), (this.dialogDelSync = false))
        );
    }
  }
}
</script>
