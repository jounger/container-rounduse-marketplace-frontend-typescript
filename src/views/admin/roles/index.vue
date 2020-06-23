<template>
  <v-content>
    <v-card>
      <v-card-title>
        Danh sách quyền
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
        @click.stop="addRoles"
        v-if="$auth.check(['ROLE_ADMIN'])"
      >
        Thêm mới
      </v-btn>
      <v-row justify="center">
        <DeleteRoles
          :dialogDel.sync="dialogDel"
          :checkSuccess.sync="checkSuccess"
          :success.sync="success"
          :name="name"
        />
      </v-row>
      <v-row justify="center">
        <CreateRoles
          :role.sync="role"
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
        :items="roles"
        :search="search"
        item-key="rolename"
        :options.sync="options"
        :server-items-length="totalRoles"
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
              <v-list-item @click="delRoles(item)">
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
import data from "./data";
import DeleteRoles from "./components/DeleteRoles.vue";
import CreateRoles from "./components/CreateRoles.vue";
import { IRole } from '@/entity/roles';

@Component({
  name: "RolesManagement",
  components: {
    DeleteRoles,
    CreateRoles
  }
})
export default class RolesManagement extends Vue {
  @PropSync("layout") layoutSync!: object;
  success = "";
  checkSuccess = false;
  dialogAdd = false;
  dialogDel = false;
  rolename = "";
  permissions = [] as Array<string>;
  role: IRole = {
    rolename: "",
    permissions: [] as Array<string>
  };
  name = "";

  roles = [] as Array<IRole>;
  search = "";
  totalRoles = 0;
  loading = true;
  checkAdd = false;
  checkUpdate = false;
  options = {} as any;
  title = "";
  readonly = false;
  headers = [
    {
      text: "Tên quyền",
      align: "start",
      sortable: true,
      value: "rolename"
    },
    { text: "Chức năng", value: "permissions" },
    {
      text: "Hành động",
      value: "action"
    }
  ];
  async created() {
    this.layoutSync = NavLayout; // change EmptyLayout to NavLayout.vue
  }
  @Watch("options", { deep: true })
  getOptions() {
    this.getDataFromApi().then((data: any) => {
      this.roles = data.items;
      this.totalRoles = data.total;
    });
  }
  async mounted() {
    this.getDataFromApi().then((data: any) => {
      this.roles = data.items;
      this.totalRoles = data.total;
    });
  }
  public getDataFromApi() {
    console.log(this.options);
    this.loading = true;
    return new Promise((resolve, reject) => {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      let items = this.getRoles();
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
  public getRoles(): Array<IRole> {
    return data;
  }
  public viewDetail(item: IRole) {
    this.role = item;
    this.checkAdd = false;
    this.checkUpdate = false;
    this.title = "Thông tin quyền";
    this.readonly = true;
    this.dialogAdd = true;
  }
  public update(item: IRole) {
    this.role = item;
    this.checkAdd = false;
    this.checkUpdate = true;
    this.title = "Cập nhập quyền";
    this.readonly = false;
    this.dialogAdd = true;
  }
  public delRoles(item: IRole) {
    this.name = item.rolename;
    this.dialogDel = true;
  }
  public addRoles() {
    this.title = "Thêm mới quyền";
    this.role = {
      rolename: "",
      permissions: [] as Array<string>
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
