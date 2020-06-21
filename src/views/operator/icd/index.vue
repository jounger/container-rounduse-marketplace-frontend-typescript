<template>
  <v-content>
    <v-card>
      <v-card-title>
        Danh sách ICD
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
        @click.stop="addICD"
        v-if="$auth.check(['ROLE_ADMIN'])"
      >
        Thêm mới
      </v-btn>
      <v-row justify="center">
        <DeleteICD
          :dialogDel.sync="dialogDel"
          :checkSuccess.sync="checkSuccess"
          :success.sync="success"
          :name="name"
        />
      </v-row>
      <v-row justify="center">
        <CreateICD
          :icd.sync="icd"
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
        :headers="headers"
        :items="ICDs"
        :search="search"
        item-key="nameCode"
        :options.sync="options"
        :server-items-length="totalICDs"
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
              <v-list-item @click="delICD(item)">
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
import data from "../icd/data";
import { Icd } from "../icd/icd";
import DeleteICD from "./components/DeleteICD.vue";
import CreateICD from "./components/CreateICD.vue";

@Component({
  name: "ICDManagement",
  components: {
    DeleteICD,
    CreateICD
  }
})
export default class ICDManagement extends Vue {
  @PropSync("layout") layoutSync!: object;
  icd: Icd = {
    fullname: "",
    nameCode: "",
    address: ""
  };
  success = "";
  icds = [] as Array<Icd>;
  checkSuccess = false;
  dialogAdd = false;
  dialogDel = false;
  checkAdd = false;
  checkUpdate = false;
  title = "";
  name = "";
  search = "";
  readonly = false;
  totalICDs = 0;
  ICDs = [] as Array<Icd>;
  loading = true;
  options = {} as any;
  headers = [
    {
      text: "Tên ICD",
      align: "start",
      sortable: true,
      value: "fullname"
    },
    { text: "Số bằng lái", value: "nameCode" },
    { text: "Vị trí hiện tại", value: "address" },
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
      this.ICDs = data.items;
      this.totalICDs = data.total;
    });
  }
  async mounted() {
    this.getDataFromApi().then((data: any) => {
      this.ICDs = data.items;
      this.totalICDs = data.total;
    });
  }
  public getDataFromApi() {
    console.log(this.options);
    this.loading = true;
    return new Promise((resolve, reject) => {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      let items = this.getICDs();
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
  public getICDs(): Array<Icd> {
    return data;
  }
  public viewDetail(item: Icd) {
    this.icd = item;
    this.checkAdd = false;
    this.checkUpdate = false;
    this.title = "Thông tin ICD";
    this.readonly = true;
    this.dialogAdd = true;
  }
  public update(item: Icd) {
    this.icd = item;
    this.checkAdd = false;
    this.checkUpdate = true;
    this.title = "Cập nhập ICD";
    this.readonly = false;
    this.dialogAdd = true;
  }
  public delICD(item: Icd) {
    this.name = item.fullname;
    this.dialogDel = true;
  }
  public addICD() {
    this.title = "Thêm mới ICD";
    this.icd = {
      fullname: "",
      nameCode: "",
      address: ""
    };
    this.checkAdd = true;
    this.checkUpdate = false;
    this.readonly = false;
    this.dialogAdd = true;
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
