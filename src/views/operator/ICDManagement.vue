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
      <v-btn
        color="red"
        style="margin-left: 20px;"
        dark
        @click.stop="dialogDel = true"
        v-if="selected.length > 0 && $auth.check(['ROLE_ADMIN'])"
      >
        Xóa ICD
      </v-btn>
      <v-row justify="center">
        <v-dialog v-model="dialogDelSingle" persistent max-width="600px">
          <v-card>
            <v-toolbar color="primary" light flat>
              <v-toolbar-title
                ><span class="headline" style="color:white;">Xóa ICD</span>
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
                    >Bạn có chắc chắn muốn xóa ICD này?</span
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
                ><span class="headline" style="color:white;">Xóa ICD</span>
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
                    >Bạn có chắc chắn muốn xóa những ICD này?</span
                  >
                  <div class="line"></div>
                  <v-list>
                    <v-list-item v-for="(item, i) in selected" :key="i">
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="item.fullname"
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
                  style="margin-left:368px;"
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
                      v-model="fullname"
                      :readonly="readonly"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs9>
                    <v-text-field
                      label="Mã ICD"
                      name="nameCode"
                      prepend-icon="mdi-account"
                      type="text"
                      v-model="nameCode"
                      :readonly="readonly"
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
                      v-model="address"
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
              <v-btn @click="updateICD()" color="primary" v-if="checkUpdate"
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
        :items="ICDs"
        :search="search"
        item-key="nameCode"
        show-select
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
import { UserEntity } from "@/store/definitions/user";
@Component({
  name: "ICDManagement"
})
export default class ICDManagement extends Vue {
  @PropSync("layout") layoutSync!: object;
  selected = [] as Array<any>;
  fullname = "";
  nameCode = "";
  address = "";
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
  totalICDs = 0;
  ICDs = [] as Array<any>;
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
  public getICDs(): Array<any> {
    return [
      {
        fullname: "Cảng cạn 01",
        nameCode: "DRY01",
        address: "Hải Phòng"
      },
      {
        fullname: "Cảng cạn 02",
        nameCode: "DRY02",
        address: "Hà Nội"
      },
      {
        fullname: "Cảng biển 01",
        nameCode: "SEA01",
        address: "Vĩnh Tuy"
      },
      {
        fullname: "Cảng nội địa 01",
        nameCode: "DEP01",
        address: "Hạ Long"
      },
      {
        fullname: "Cảng biển 02",
        nameCode: "SEA02",
        address: "Hòa Lạc"
      },
      {
        fullname: "Cảng nội địa 02",
        nameCode: "DEP02",
        address: "FPT"
      }
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
    this.fullname = item.fullname;
    this.nameCode = item.nameCode;
    this.address = item.address;
    this.checkAdd = false;
    this.checkUpdate = false;
    this.title = "Thông tin ICD";
    this.readonly = true;
    this.dialogAdd = true;
  }
  public update(item: any) {
    this.fullname = item.fullname;
    this.nameCode = item.nameCode;
    this.address = item.address;
    this.checkAdd = false;
    this.checkUpdate = true;
    this.title = "Cập nhập ICD";
    this.readonly = false;
    this.dialogAdd = true;
  }
  public delICD(item: any) {
    this.name = item.fullname;
    this.dialogDelSingle = true;
  }
  public delSingle(name: string) {
    this.ICDs = this.ICDs.filter((ICD: any) => ICD.fullname != name);
    this.success = "Xóa thành công";
    this.checkSuccess = true;
    this.dialogDelSingle = false;
  }
  public cancelDelSingle() {
    this.name = "";
    this.dialogDelSingle = false;
  }
  public addICD() {
    this.title = "Thêm mới ICD";
    this.fullname = "";
    this.nameCode = "";
    this.address = "";
    this.checkAdd = true;
    this.checkUpdate = false;
    this.readonly = false;
    this.dialogAdd = true;
  }
  public updateICD() {
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
