<template>
  <v-content>
    <v-card>
      <v-card-title>
        Danh sách loại Container
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
        @click.stop="addContainerType"
        v-if="$auth.check(['ROLE_ADMIN'])"
      >
        Thêm mới
      </v-btn>
      <v-btn
        color="red"
        style="margin-left: 20px;"
        dark
        @click.stop="dialogDel = true"
        v-if="selected.length > 0 && $auth.check(['ROLE_ADMIN'])"
      >
        Xóa loại Container
      </v-btn>
      <v-row justify="center">
        <DeleteContainerType
          :selected.sync="selected"
          :dialogDel.sync="dialogDel"
          :checkSuccess.sync="checkSuccess"
          :success.sync="success"
          :singleDel.sync="singleDel"
          :nameDel="nameDel"
        />
      </v-row>
      <v-row justify="center">
        <CreateContainerType
          :containerType.sync="containerType"
          :title="title"
          :dialogAdd.sync="dialogAdd"
          :checkSuccess.sync="checkSuccess"
          :checkAdd="checkAdd"
          :checkUpdate="checkUpdate"
          :success.sync="success"
          :readonly="readonly"
        />
      </v-row>
      <v-alert
        v-model="checkSuccess"
        dismissible
        close-icon="mdi-delete"
        type="success"
      >
        {{ success }}
      </v-alert>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="containerTypes"
        :search="search"
        item-key="name"
        show-select
        :options.sync="options"
        :server-items-length="totalContainerTypes"
        :loading="loading"
        :items-per-page="5"
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
                <v-list-item-title>Xem chi tiết</v-list-item-title>
              </v-list-item>
              <v-list-item @click="update(item)">
                <v-list-item-title>Cập nhập</v-list-item-title>
              </v-list-item>
              <v-list-item @click="delContainerType(item)">
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
import DeleteContainerType from "../container-type/components/DeleteContainerType.vue";
import CreateContainerType from "./components/CreateContainerType.vue";
import { ContainerType } from "./container-type";
import data from "./data";

@Component({
  name: "ContainerTypeManagement",
  components: {
    DeleteContainerType,
    CreateContainerType
  }
})
export default class ContainerTypeManagement extends Vue {
  @PropSync("layout") layoutSync!: object;
  selected = [] as Array<ContainerType>;
  containerType: ContainerType | null = null;
  success = "";
  checkSuccess = false;
  dialogAdd = false;
  dialogDel = false;
  singleDel = false;
  checkAdd = false;
  checkUpdate = false;
  title = "";
  nameDel = "";
  search = "";
  readonly = false;
  totalContainerTypes = 0;
  containerTypes = [] as Array<ContainerType>;
  loading = true;
  options = {} as any;
  headers = [
    {
      text: "Tên loại Container",
      align: "start",
      sortable: true,
      value: "name"
    },
    { text: "Chi tiết", value: "description" },
    { text: "Khối lượng vỏ", value: "tareWeight" },
    { text: "Trọng tải", value: "payloadCapacity" },
    { text: "Công suất khối", value: "cubicCapacity" },
    { text: "Chiều dài trong", value: "internalLength" },
    { text: "Chiều rộng trong", value: "internalWidth" },
    { text: "Chiều cao trong", value: "internalHeight" },
    { text: "Chiều rộng cửa mở", value: "doorOpeningWidth" },
    { text: "Chiều cao cửa mở", value: "doorOpeningHeight" },
    {
      text: "Hành động",
      value: "action"
    }
  ];
  async created() {
    console.log(1);
    this.layoutSync = NavLayout; // change EmptyLayout to NavLayout.vue
  }
  @Watch("options", { deep: true })
  getOptions() {
    this.getDataFromApi().then((data: any) => {
      this.containerTypes = data.items;
      this.totalContainerTypes = data.total;
    });
  }
  async mounted() {
    this.getDataFromApi().then((data: any) => {
      this.containerTypes = data.items;
      this.totalContainerTypes = data.total;
    });
  }
  public getDataFromApi() {
    console.log(this.options);
    this.loading = true;
    return new Promise((resolve, reject) => {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      let items = this.getContainerTypes();
      const total = items.length;

      if (sortBy.length === 1 && sortDesc.length === 1) {
        items = items.sort((a: any, b: any) => {
          const sortA = a[sortBy[0]];
          const sortB = b[sortBy[0]];

          if (sortDesc[0]) {
            if (sortA < sortB) return 1;
            if (sortA > sortB) return -1;
            return 0;
          } else {
            if (sortA < sortB) return -1;
            if (sortA > sortB) return 1;
            return 0;
          }
        });
      }

      if (itemsPerPage > 0) {
        items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);
      }

      setTimeout(() => {
        this.loading = false;
        resolve({
          items,
          total
        });
      }, 1000);
    });
  }
  public getContainerTypes(): Array<ContainerType> {
    return data;
  }

  public cancel() {
    this.checkAdd = false;
    this.checkUpdate = false;
    this.readonly = false;
    this.dialogAdd = false;
  }
  public viewDetail(item: ContainerType) {
    this.containerType = item;
    this.checkAdd = false;
    this.checkUpdate = false;
    this.title = "Thông tin containerType";
    this.readonly = true;
    this.dialogAdd = true;
  }
  public update(item: ContainerType) {
    this.containerType = item;
    this.checkAdd = false;
    this.checkUpdate = true;
    this.title = "Cập nhập containerType";
    this.readonly = false;
    this.dialogAdd = true;
  }
  public delContainerType(item: ContainerType) {
    this.nameDel = item.name;
    this.singleDel = true;
    this.dialogDel = true;
  }
  public delSingle(name: string) {
    this.containerTypes = this.containerTypes.filter(
      (containerType: ContainerType) => containerType.name != name
    );
    this.success = "Xóa thành công";
    this.checkSuccess = true;
    this.singleDel = false;
  }
  public cancelDelSingle() {
    this.nameDel = "";
    this.singleDel = false;
  }
  public addContainerType() {
    this.containerType = null;
    this.title = "Thêm mới loại Container";
    this.checkAdd = true;
    this.checkUpdate = false;
    this.readonly = false;
    this.dialogAdd = true;
  }
  public del() {
    this.success = "Xóa thành công!";
    this.checkSuccess = true;
    console.log(this.selected);
    this.dialogDel = false;
  }
  public cancelDel() {
    this.dialogDel = false;
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
