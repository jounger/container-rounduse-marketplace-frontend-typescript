<template>
  <v-content>
    <v-card>
      <v-card-title>
        Danh sách Moderator
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
        @click.stop="addModerator()"
        v-if="$auth.check(['ROLE_ADMIN'])"
      >
        Thêm mới
      </v-btn>
      <v-row justify="center">
        <DeleteModerator
          :dialogDel.sync="dialogDel"
          :checkSuccess.sync="checkSuccess"
          :success.sync="success"
          :name="name"
        />
      </v-row>
      <v-row justify="center">
        <CreateModerator
          :moderator.sync="moderator"
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
        :items="users"
        :search="search"
        item-key="username"
        :options.sync="options"
        :server-items-length="totalUsers"
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
              <v-list-item @click="delModerator(item)">
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
import UserModule from "@/store/modules/user";
import NavLayout from "@/layouts/NavLayout.vue";
import { UserEntity } from "@/store/definitions/user";
import DeleteModerator from "./components/DeleteModerator.vue";
import CreateModerator from "./components/CreateModerator.vue";

@Component({
  name: "ModeratorManagement",
  components: {
    DeleteModerator,
    CreateModerator
  }
})
export default class ModeratorManagement extends Vue {
  @PropSync("layout") layoutSync!: object;

  title = "";
  dialogAdd = false;
  dialogDel = false;
  readonly = false;
  checkAdd = false;
  moderator: UserEntity = {
    username: "",
    password: "",
    email: "",
    phone: "",
    role: ["ROLE_MODERATOR"],
    status: "ACTIVE"
  };
  checkUpdate = false;
  search = "";
  success = "";
  phone = "";
  name = "";
  checkSuccess = false;
  totalUsers = 0;
  users = [] as Array<UserEntity>;
  loading = true;
  options = {} as any;
  headers = [
    {
      text: "Tên đăng nhập",
      align: "start",
      sortable: true,
      value: "username"
    },
    { text: "Email", value: "email" },
    { text: "Số điện thoại", value: "phone" },
    { text: "Phân quyền", value: "roles" },
    { text: "Trạng thái", value: "status" },
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
      this.users = data.items;
      this.totalUsers = data.total;
    });
  }
  async mounted() {
    await UserModule.fetchUsers({
      page: 0,
      limit: 5
    }); // -> store.dispatch("user/fetchUsers", {page: 0, limit: 5})
    this.getDataFromApi().then((data: any) => {
      this.users = data.items;
      this.totalUsers = data.total;
    });
  }
  public getDataFromApi() {
    this.loading = true;
    return new Promise((resolve, reject) => {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      let items = this.getUsers();
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
  public getUsers(): Array<UserEntity> {
    if (UserModule.getListUsers != null) {
      console.log(UserModule.getListUsers);
      return UserModule.getListUsers.filter(
        (user: any) => user.roles[0] == "ROLE_MODERATOR"
      );
    } else {
      return [];
    }
  }
  public viewDetail(item: UserEntity) {
    this.moderator = item;
    this.checkAdd = false;
    this.checkUpdate = false;
    this.title = "Thông tin Moderator";
    this.readonly = true;
    this.dialogAdd = true;
  }
  public update(item: UserEntity) {
    this.moderator = item;
    this.checkAdd = false;
    this.checkUpdate = true;
    this.title = "Cập nhập Moderator";
    this.readonly = false;
    this.dialogAdd = true;
  }
  public delModerator(item: UserEntity) {
    this.name = item.username;
    this.dialogDel = true;
  }
  public addModerator() {
    this.title = "Thêm mới Moderator";
    this.moderator = {
      username: "",
      password: "",
      email: "",
      role: ["ROLE_MODERATOR"],
      phone: "",
      status: "ACTIVE"
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
