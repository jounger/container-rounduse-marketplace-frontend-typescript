<template>
  <v-content>
    <v-card>
      <v-card-title>
        Danh sách hàng
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
        v-if="$auth.check(['ROLE_MODERATOR'])"
      >
        Thêm mới
      </v-btn>
      <v-btn
        color="red"
        style="margin-left: 605px;"
        dark
        @click.stop="dialogDel = true"
        v-if="selected.length > 0 && $auth.check(['ROLE_MODERATOR'])"
      >
        Xóa hàng
      </v-btn>
      <v-row justify="center">
        <v-dialog v-model="dialogDel" persistent max-width="600px">
          <v-card>
            <v-toolbar color="primary" light flat>
              <v-toolbar-title
                ><span class="headline" style="color:white;">Xóa hàng</span>
                <v-btn
                  icon
                  dark
                  @click="dialogDel = false"
                  style="margin-left:379px;"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn></v-toolbar-title
              >
            </v-toolbar>

            <v-card-text>
              <v-form>
                <v-container>
                  <span style="color: black; font-size:22px;"
                    >Bạn có chắc chắn muốn xóa những hàng này?</span
                  >
                  <div class="line"></div>
                  <v-list>
                    <v-list-item v-for="(item, i) in selected" :key="i">
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="item.shipname"
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
                  >Thêm mới hàng</span
                >
                <v-btn
                  icon
                  dark
                  @click="dialogAdd = false"
                  style="margin-left:313px;"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn></v-toolbar-title
              >
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-layout col>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Tên đăng nhập"
                        name="username"
                        prepend-icon="mdi-account"
                        type="text"
                        v-model="username"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Tên hãng tàu"
                        name="shippingLineName"
                        prepend-icon="mdi-lock"
                        type="text"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout col>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Mật khẩu"
                        name="password"
                        prepend-icon="mdi-lock"
                        type="password"
                        v-model="password"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Mã tên"
                        name="namecode"
                        prepend-icon="mdi-lock"
                        type="text"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout col>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Email"
                        name="email"
                        prepend-icon="mdi-lock"
                        type="email"
                        v-model="email"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Website"
                        name="website"
                        prepend-icon="mdi-lock"
                        type="text"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout col>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Số điện thoại"
                        name="phone"
                        prepend-icon="mdi-lock"
                        type="phone"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs8>
                      <v-select :items="icd" attach label="ICD"></v-select>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout col>
                  <v-layout row>
                    <v-flex xs6>
                      <v-text-field
                        label="Địa chỉ"
                        name="address"
                        prepend-icon="mdi-lock"
                        type="text"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-layout>
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
        :items="ships"
        :search="search"
        item-key="namecode"
        show-select
        :options.sync="options"
        :server-items-length="totalShips"
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
import Dialog from "@/components/Dialog.vue";
import NavLayout from "@/layouts/NavLayout.vue";
import { UserEntity } from "@/store/definitions/user";
@Component({
  name: "ConsignmentManagement",
  components: {
    Dialog
  }
})
export default class ConsignmentManagement extends Vue {
  @PropSync("layout") layoutSync!: object;
  selected = [] as Array<any>;
  dialog = false;
  username = "";
  password = "";
  email = "";
  fullname = "";
  icd = ["Seaport", "Dryport"];
  success = "";
  checkSuccess = false;
  roles = [] as Array<string>;
  dialogAdd = false;
  dialogDel = false;
  search = "";
  totalShips = 0;
  ships = [] as Array<any>;
  loading = true;
  options = {} as any;
  headers = [
    {
      text: "Tên đăng nhập",
      align: "start",
      sortable: true,
      value: "username"
    },
    { text: "Tên hãng tàu", value: "shipname" },
    { text: "Mã tên", value: "namecode" },
    { text: "Email", value: "email" },
    { text: "Website", value: "website" },
    { text: "Số điện thoại", value: "phone" },
    { text: "ICD", value: "icds" },
    { text: "Địa chỉ", value: "address" },
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
      this.ships = data.items;
      this.totalShips = data.total;
    });
  }
  async mounted() {
    this.getDataFromApi().then((data: any) => {
      this.ships = data.items;
      this.totalShips = data.total;
    });
  }
  public getDataFromApi() {
    console.log(this.options);
    this.loading = true;
    return new Promise((resolve, reject) => {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      let items = this.getShips();
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
  public getShips(): Array<any> {
    return [
      {
        username: "Admin",
        shipname: "ABC",
        namecode: "A01",
        email: "abc@gmail.com",
        website: "abc.com.vn",
        phone: "0359049292",
        icds: ["Dry port", "Seaport"],
        address: "abc xyz"
      },
      {
        username: "Admin",
        shipname: "ABC",
        namecode: "A02",
        email: "abc@gmail.com",
        website: "abc.com.vn",
        phone: "0359049292",
        icds: ["Dry port", "Seaport"],
        address: "abc xyz"
      },
      {
        username: "Admin",
        shipname: "ABC",
        namecode: "A03",
        email: "abc@gmail.com",
        website: "abc.com.vn",
        phone: "0359049292",
        icds: ["Dry port", "Seaport"],
        address: "abc xyz"
      },
      {
        username: "Admin",
        shipname: "ABC",
        namecode: "A04",
        email: "abc@gmail.com",
        website: "abc.com.vn",
        phone: "0359049292",
        icds: ["Dry port", "Seaport"],
        address: "abc xyz"
      },
      {
        username: "Admin",
        shipname: "ABC",
        namecode: "A05",
        email: "abc@gmail.com",
        website: "abc.com.vn",
        phone: "0359049292",
        icds: ["Dry port", "Seaport"],
        address: "abc xyz"
      },
      {
        username: "Admin1",
        shipname: "ABC",
        namecode: "A06",
        email: "abc@gmail.com",
        website: "abc.com.vn",
        phone: "0359049292",
        icds: ["Dry port", "Seaport"],
        address: "abc xyz"
      },
      {
        username: "Admin1",
        shipname: "ABC",
        namecode: "A07",
        email: "abc@gmail.com",
        website: "abc.com.vn",
        phone: "0359049292",
        icds: ["Dry port", "Seaport"],
        address: "abc xyz"
      },
      {
        username: "Admin",
        shipname: "ABC",
        namecode: "A08",
        email: "abc@gmail.com",
        website: "abc.com.vn",
        phone: "0359049292",
        icds: ["Dry port", "Seaport"],
        address: "abc xyz"
      },
    ];
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
