<template>
  <v-content>
    <v-card>
      <v-card-title>
        Danh sách Admin
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
        @click.stop="dialogAdd = true"
        v-if="$auth.check(['ROLE_ADMIN'])"
      >
        Thêm mới
      </v-btn>
      <v-btn
        color="red"
        style="margin-left: 605px;"
        dark
        @click.stop="dialogDel = true"
        v-if="selected.length > 0 && $auth.check(['ROLE_ADMIN'])"
      >
        Xóa Admin
      </v-btn>
      <v-row justify="center">
        <v-dialog v-model="dialogDel" persistent max-width="600px">
          <v-card>
            <v-toolbar color="primary" light flat>
              <v-toolbar-title
                ><span class="headline" style="color:white;">Xóa Admin</span>
                <v-btn
                  icon
                  dark
                  @click="dialogDel = false"
                  style="margin-left:403px;"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn></v-toolbar-title
              >
            </v-toolbar>

            <v-card-text>
              <v-form>
                <v-container>
                  <span style="color: black; font-size:22px;"
                    >Bạn có chắc chắn muốn xóa những Admin này?</span
                  >
                  <div class="line"></div>
                  <v-list>
                    <v-list-item v-for="(item, i) in selected" :key="i">
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="item.username"
                        ></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-container>
                <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
              </v-form>
            </v-card-text>
            <v-card-actions style="margin-left: 205px;">
              <v-btn @click="cancelDel()">Hủy</v-btn>
              <v-btn @click="del()" color="red">Xóa</v-btn>
            </v-card-actions>
            <Dialog :dialog.sync="dialog" />
          </v-card>
        </v-dialog>
      </v-row>
      <v-row justify="center">
        <v-dialog v-model="dialogAdd" persistent max-width="600px">
          <v-card>
            <v-toolbar color="primary" light flat>
              <v-toolbar-title
                ><span class="headline" style="color:white;"
                  >Thêm mới Admin</span
                >
                <v-btn
                  icon
                  dark
                  @click="dialogAdd = false"
                  style="margin-left:336px;"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn></v-toolbar-title
              >
            </v-toolbar>

            <v-card-text>
              <v-form>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="Tên đăng nhập*"
                        type="text"
                        v-model="username"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="Mật khẩu*"
                        type="password"
                        v-model="password"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="Email*"
                        type="email"
                        v-model="email"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="Tên đầy đủ"
                        type="text"
                        v-model="fullname"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="8">
                      <v-select
                        :items="['ROLE_ADMIN']"
                        label="Phân quyền*"
                        required
                        v-model="roles"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
                <small>*Dấu sao là trường bắt buộc</small>
                <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="cancel()">Hủy</v-btn>
              <v-btn @click="submit()" color="primary">Thêm mới</v-btn>
            </v-card-actions>
            <Dialog :dialog.sync="dialog" />
          </v-card>
        </v-dialog>
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
        :items="users"
        :search="search"
        item-key="username"
        show-select
        :options.sync="options"
        :server-items-length="totalUsers"
        :loading="loading"
        :items-per-page="5"
        class="elevation-1"
      >
      </v-data-table>
    </v-card>
  </v-content>
</template>
<script lang="ts">
import { Component, PropSync, Watch, Vue } from "vue-property-decorator";
import UserModule from "@/store/modules/user";
import Dialog from "@/components/Dialog.vue";
import NavLayout from "@/layouts/NavLayout.vue";
import { UserEntity } from "@/store/definitions/user";
@Component({
  name: "AdminManagement",
  components: {
    Dialog
  }
})
export default class AdminManagement extends Vue {
  @PropSync("layout") layoutSync!: object;
  selected = [] as Array<any>;
  dialog = false;
  username = "";
  password = "";
  email = "";
  fullname = "";
  roles = [] as Array<string>;
  dialogAdd = false;
  dialogDel = false;
  search = "";
  success = "";
  checkSuccess = false;
  totalUsers = 0;
  users = [] as Array<any>;
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
    { text: "Tên đầy đủ", value: "fullname" },
    { text: "Phân quyền", value: "roles" },
    {
      text: "Hành động",
      value: "mdi-dots-vertical"
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
      limit: 20
    }); // -> store.dispatch("user/fetchUsers", {page: 0, limit: 5})
    this.getDataFromApi().then((data: any) => {
      this.users = data.items;
      this.totalUsers = data.total;
    });
  }
  public getDataFromApi() {
    console.log(this.options);
    this.loading = true;
    return new Promise((resolve, reject) => {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      let items = this.getUsers();
      const total = items.length;

      if (sortBy.length === 1 && sortDesc.length === 1) {
        items = items.sort((a: Array<UserEntity>, b: Array<UserEntity>) => {
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
  public getUsers(): Array<any> {
    if (UserModule.getListUsers != null) {
      return UserModule.getListUsers.filter(
        (user: any) => user.roles[0] == "ROLE_ADMIN"
      );
    } else {
      return [
        {
          username: "",
          email: "",
          fullname: "",
          roles: ""
        }
      ];
    }
  }
  public submit() {
    this.success = "Thêm mới thành công!";
    this.checkSuccess = true;
    this.dialogAdd = false;
  }
  public cancel() {
    this.dialogAdd = false;
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
