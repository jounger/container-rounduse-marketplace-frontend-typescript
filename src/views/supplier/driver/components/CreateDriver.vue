<template>
  <v-dialog v-model="dialogAddSync" max-width="600">
    <v-card>
      <v-card-title class="headline">{{
        update ? "Cập nhật Lái xe" : "Thêm mới Lái xe"
      }}</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form v-model="valid" validation>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Tên đăng nhập"
                name="username"
                prepend-icon="mdi-account"
                type="text"
                v-model="driverLocal.username"
                :disabled="update"
                :counter="20"
                :rules="[
                  minLength('Tên đăng nhập', 2),
                  maxLength('Tên đăng nhập', 20)
                ]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-if="!update"
                label="Mật khẩu"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                :counter="120"
                :rules="[minLength('Mật khẩu', 6), maxLength('Mật khẩu', 120)]"
                v-model="driverLocal.password"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Tên lái xe"
                name="fullname"
                prepend-icon="airline_seat_recline_normal"
                type="text"
                v-model="driverLocal.fullname"
                :counter="50"
                :rules="[
                  minLength('Họ và tên lái xe', 5),
                  maxLength('Họ và tên lái xe', 50)
                ]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Số bằng lái"
                name="driverLocalLicense"
                prepend-icon="invoice"
                type="text"
                v-model="driverLocal.driverLicense"
                :counter="50"
                :rules="[
                  minLength('Số bằng lái', 5),
                  maxLength('Số bằng lái', 50)
                ]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Email"
                name="email"
                prepend-icon="alternate_email"
                type="text"
                :counter="50"
                :rules="[
                  email('lái xe'),
                  minLength('Email', 5),
                  maxLength('Email', 50)
                ]"
                v-model="driverLocal.email"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Số điện thoại"
                name="phone"
                prepend-icon="call"
                type="number"
                :counter="10"
                :rules="[
                  minLength('Số điện thoại', 10),
                  maxLength('Số điện thoại', 10)
                ]"
                v-model="driverLocal.phone"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="12">
              <v-text-field
                label="Địa chỉ"
                name="address"
                prepend-icon="location_on"
                type="text"
                :counter="100"
                :rules="[minLength('Địa chỉ', 5), maxLength('Địa chỉ', 100)]"
                v-model="driverLocal.address"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-if="update"
                v-model="driverLocal.status"
                prepend-icon="insert_emoticon"
                :items="allStatus"
                :rules="[required('trạng thái hoạt động')]"
                label="Trạng thái"
              >
              </v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn
          @click="updateDriver()"
          color="primary"
          v-if="update"
          :disabled="!valid"
          >Cập nhật</v-btn
        >
        <v-btn @click="createDriver()" color="primary" v-else :disabled="!valid"
          >Thêm mới</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IDriver } from "@/entity/driver";
import FormValidate from "@/mixin/form-validate";
import { createDriver, editDriver } from "@/api/driver";

@Component({
  mixins: [FormValidate]
})
export default class CreateDriver extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @Prop(Object) driver!: IDriver;
  @PropSync("drivers", { type: Array }) driversSync!: Array<IDriver>;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Boolean) update!: boolean;

  driverLocal = {
    username: "",
    email: "",
    phone: "",
    roles: ["ROLE_DRIVER"],
    status: "ACTIVE",
    address: "",
    password: "",
    fullname: "",
    driverLicense: "",
    location: {
      latitude: "",
      longitude: ""
    }
  } as IDriver;
  valid = false;
  allStatus: Array<string> = [];
  created() {
    this.allStatus = ["ACTIVE", "BANNED"];
    if (this.update) {
      this.driverLocal = Object.assign({}, this.driver);
    }
  }
  async createDriver() {
    if (this.driverLocal) {
      const _res = await createDriver(this.driverLocal);
      if (_res.data) {
        const _driver = _res.data.data;
        this.driversSync.unshift(_driver);
        this.totalItemsSync += 1;
        this.dialogAddSync = false;
      }
    }
  }
  async updateDriver() {
    if (this.driverLocal.id) {
      const _res = await editDriver(this.driverLocal.id, this.driverLocal);
      if (_res.data) {
        const _driver = _res.data.data;
        const index = this.driversSync.findIndex(x => x.id == _driver.id);
        this.driversSync.splice(index, 1, _driver);
      }
    }
  }
}
</script>
