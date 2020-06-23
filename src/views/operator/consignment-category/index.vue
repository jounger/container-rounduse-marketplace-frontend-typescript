<template>
  <v-content>
    <v-card>
      <v-card-title>
        Danh sách loại hàng
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-btn
        color="primary"
        style="margin-left: 35px;"
        dark
        @click="addCategory()"
      >
        Thêm mới
      </v-btn>
      <v-row justify="center">
        <DialogDeleteCategory
          :dialogDel.sync="dialogDel"
          :category.sync="category"
          :categories.sync="categories"
          :options.sync="options"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <v-row justify="center">
        <DialogCreateCategory
          :category.sync="category"
          :categories.sync="categories"
          :options.sync="options"
          :dialogAdd.sync="dialogAdd"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <v-data-table
        :headers="headers"
        :items="categories"
        item-key="id"
        :search="search"
        :loading="loading"
        :options.sync="options"
        :server-items-length="options.totalItems"
        :footer-props="{ 'items-per-page-options': options.itemsPerPageItems }"
        :actions-append="options.page"
        class="elevation-1"
      >
        <template v-slot:item.action="{ item }">
          <v-menu :loading="item.createloading" :disabled="item.createloading">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="secondary" dark v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="viewDetail(item)">
                <v-list-item-title>Chi tiết</v-list-item-title>
              </v-list-item>
              <v-list-item @click="removeCategory(item)">
                <v-list-item-title>Xóa</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>
<script lang="ts">
import { Component, PropSync, Watch, Vue } from "vue-property-decorator";
import NavLayout from "@/layouts/NavLayout.vue";
import { ICategory } from "@/entity/category";
import { getCategories } from "@/api/category";
import { PaginationResponse } from "@/api/payload";
import Snackbar from "@/components/Snackbar.vue";
import DialogDeleteCategory from "./components/DialogDeleteCategory.vue";
import DialogCreateCategory from "./components/DialogCreateCategory.vue";

@Component({
  components: {
    DialogCreateCategory,
    DialogDeleteCategory,
    Snackbar
  }
})
export default class Category extends Vue {
  @PropSync("layout") layoutSync!: object;
  categories: Array<ICategory> = [];
  category: ICategory = {
    name: "",
    description: ""
  };
  dialogAdd = false;
  dialogDel = false;
  search = "";
  message = "";
  snackbar = false;
  loading = true;
  options = {
    descending: true,
    page: 1,
    itemsPerPage: 5,
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  headers = [
    {
      text: "Tên vai trò",
      align: "start",
      sortable: true,
      value: "name"
    },
    { text: "Mô tả", value: "description" },
    {
      text: "Hành động",
      value: "action"
    }
  ];
  created() {
    this.layoutSync = NavLayout; // change EmptyLayout to NavLayout.vue
  }

  addCategory() {
    this.category = {
      name: "",
      description: ""
    };
    this.dialogAdd = true;
  }

  viewDetail(item: ICategory) {
    this.category = item;
    this.dialogAdd = true;
  }

  removeCategory(item: ICategory) {
    this.category = item;
    this.dialogDel = true;
  }

  @Watch("options", { deep: true })
  onOptionsChange(val: object, oldVal: object) {
    if (val !== oldVal) {
      getCategories({
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<ICategory> = res.data;
          console.log("watch", this.options);
          this.categories = response.data;
          this.options.totalItems = response.total_elements;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    }
  }
}
</script>
<style type="text/css">
.line {
  margin-top: 10px;
  width: 520px;
  border-bottom: 1px solid black;
  position: absolute;
}
</style>
