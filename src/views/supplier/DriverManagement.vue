<template>
  <v-content>
    <v-card>
      <v-card-title>
        Danh sách lái xe
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
        @click.stop="addDriver"
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
        Xóa lái xe
      </v-btn>
      <v-row justify="center">
        <v-dialog v-model="dialogDelSingle" persistent max-width="600px">
          <v-card>
            <v-toolbar color="primary" light flat>
              <v-toolbar-title
                ><span class="headline" style="color:white;">Xóa lái xe</span>
                <v-btn
                  icon
                  dark
                  @click="dialogDelSingle = false"
                  style="margin-left:417px;"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn></v-toolbar-title
              >
            </v-toolbar>

            <v-card-text>
              <v-form>
                <v-container>
                  <span style="color: black; font-size:22px;"
                    >Bạn có chắc chắn muốn xóa lái xe này?</span
                  >
                  <div class="line"></div>
                  <v-list>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>{{ name }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-container>
                <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
              </v-form>
            </v-card-text>
            <v-card-actions style="margin-left: 205px;">
              <v-btn @click="cancelDelSingle()">Hủy</v-btn>
              <v-btn @click="delSingle(name)" color="red">Xóa</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row justify="center">
        <v-dialog v-model="dialogDel" persistent max-width="600px">
          <v-card>
            <v-toolbar color="primary" light flat>
              <v-toolbar-title
                ><span class="headline" style="color:white;">Xóa lái xe</span>
                <v-btn
                  icon
                  dark
                  @click="dialogDel = false"
                  style="margin-left:417px;"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn></v-toolbar-title
              >
            </v-toolbar>

            <v-card-text>
              <v-form>
                <v-container>
                  <span style="color: black; font-size:22px;"
                    >Bạn có chắc chắn muốn xóa những lái xe này?</span
                  >
                  <div class="line"></div>
                  <v-list>
                    <v-list-item v-for="(item, i) in selected" :key="i">
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="item.driverName"
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
          </v-card>
        </v-dialog>
      </v-row>
      <v-row justify="center">
        <v-dialog v-model="dialogAdd" persistent max-width="600px">
          <v-card style="height: 420px;">
            <v-toolbar color="primary" light flat>
              <v-toolbar-title
                ><span class="headline" style="color:white;">{{ title }}</span>
                <v-btn
                  icon
                  dark
                  @click="dialogAdd = false"
                  style="margin-left:344px;"
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
                      label="Tên lái xe"
                      name="driverName"
                      prepend-icon="mdi-account"
                      type="text"
                      v-model="driverName"
                      :readonly="readonly"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs9>
                    <v-text-field
                      label="Số bằng lái"
                      name="driverLicense"
                      prepend-icon="mdi-account"
                      type="text"
                      v-model="driverLicense"
                      :readonly="readonly"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs9>
                    <v-text-field
                      label="Vị trí hiện tại"
                      name="location"
                      prepend-icon="mdi-account"
                      type="text"
                      v-model="location"
                      :readonly="readonly"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
              </v-form>
            </v-card-text>
            <v-card-actions style="margin-top: 65px;">
              <v-spacer></v-spacer>
              <v-btn @click="cancel()">Trở về</v-btn>
              <v-btn @click="submit()" color="primary" v-if="checkAdd"
                >Thêm mới</v-btn
              >
              <v-btn @click="updateDriver()" color="primary" v-if="checkUpdate"
                >Cập nhập</v-btn
              >
            </v-card-actions>
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
        :items="drivers"
        :search="search"
        item-key="driverLicense"
        show-select
        :options.sync="options"
        :server-items-length="totalDrivers"
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
              <v-list-item @click="delDriver(item)">
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
import { UserEntity } from "@/store/definitions/user";
@Component({
  name: "DriverManagement"
})
export default class DriverManagement extends Vue {
  @PropSync("layout") layoutSync!: object;
  selected = [] as Array<any>;
  driverName = "";
  driverLicense = "";
  location = "";
  success = "";
  checkSuccess = false;
  dialogAdd = false;
  dialogDel = false;
  dialogDelSingle = false;
  checkAdd = false;
  checkUpdate = false;
  title = "";
  name = "";
  search = "";
  readonly = false;
  totalDrivers = 0;
  drivers = [] as Array<any>;
  loading = true;
  options = {} as any;
  headers = [
    {
      text: "Tên lái xe",
      align: "start",
      sortable: true,
      value: "driverName"
    },
    { text: "Số bằng lái", value: "driverLicense" },
    { text: "Vị trí hiện tại", value: "location" },
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
      this.drivers = data.items;
      this.totalDrivers = data.total;
    });
  }
  async mounted() {
    this.getDataFromApi().then((data: any) => {
      this.drivers = data.items;
      this.totalDrivers = data.total;
    });
  }
  public getDataFromApi() {
    console.log(this.options);
    this.loading = true;
    return new Promise((resolve, reject) => {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      let items = this.getDrivers();
      const total = items.length;

      if (sortBy.length === 1 && sortDesc.length === 1) {
        items = items.sort((a: Array<any>, b: Array<any>) => {
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
  public getDrivers(): Array<any> {
    return [
      {
        driverName: "An",
        driverLicense: "23166021545",
        location: "20,30"
      },
      {
        driverName: "Duy",
        driverLicense: "2316602154512",
        location: "20,30"
      },
      {
        driverName: "Quyền",
        driverLicense: "23166021545455",
        location: "20,30"
      },
      {
        driverName: "Dương",
        driverLicense: "231651216021545",
        location: "20,30"
      },
      {
        driverName: "Minh",
        driverLicense: "2316602154545545",
        location: "20,30"
      },
      {
        driverName: "Abc",
        driverLicense: "231660215487545",
        location: "20,30"
      },
    ];
  }
  public submit() {
    this.success = "Thêm mới thành công!";
    this.checkSuccess = true;
    this.dialogAdd = false;
  }
  public cancel() {
    this.checkAdd = false;
    this.checkUpdate = false;
    this.readonly = false;
    this.dialogAdd = false;
  }
  public viewDetail(item: any) {
    this.driverName = item.driverName;
    this.driverLicense = item.driverLicense;
    this.location = item.location;
    this.checkAdd = false;
    this.checkUpdate = false;
    this.title = "Thông tin lái xe";
    this.readonly = true;
    this.dialogAdd = true;
  }
  public update(item: any) {
    this.driverName = item.driverName;
    this.driverLicense = item.driverLicense;
    this.location = item.location;
    this.checkAdd = false;
    this.checkUpdate = true;
    this.title = "Cập nhập lái xe";
    this.readonly = false;
    this.dialogAdd = true;
  }
  public delDriver(item: any) {
    this.name = item.driverName;
    this.dialogDelSingle = true;
  }
  public delSingle(name: string) {
    this.drivers = this.drivers.filter(
      (driver: any) => driver.driverName != name
    );
    this.success = "Xóa thành công";
    this.checkSuccess = true;
    this.dialogDelSingle = false;
  }
  public cancelDelSingle() {
    this.name = "";
    this.dialogDelSingle = false;
  }
  public addDriver() {
    this.title = "Thêm mới Lái xe";
    this.driverName = "";
    this.driverLicense = "";
    this.location = "";
    this.checkAdd = true;
    this.checkUpdate = false;
    this.readonly = false;
    this.dialogAdd = true;
  }
  public updateDriver() {
    this.success = "Cập nhập thành công";
    this.checkSuccess = true;
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
