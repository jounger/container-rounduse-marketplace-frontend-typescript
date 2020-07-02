<template>
  <v-dialog v-model="dialogAddSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            update ? "Cập nhập Lái xe" : "Thêm mới Lái xe"
          }}</span>
          <v-btn
            icon
            dark
            @click="dialogAddSync = false"
            style="margin-left:412px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Tên đăng nhập"
                  name="username"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="driverLocal.username"
                  :readonly="update"
                  :counter="20"
                  :rules="[minLength('username', 2), maxLength('username', 20)]"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Tên lái xe"
                  name="fullname"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="driverLocal.fullname"
                  :rules="[required('fullname')]"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Số bằng lái"
                  name="driverLocalLicense"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="driverLocal.driverLicense"
                  :rules="[required('driverLocal license')]"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  v-if="!update"
                  label="Mật khẩu"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  :counter="120"
                  :rules="[
                    minLength('password', 6),
                    maxLength('password', 120)
                  ]"
                  v-model="driverLocal.password"
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
                  prepend-icon="mdi-account"
                  type="text"
                  :counter="50"
                  :rules="[
                    email('Operator'),
                    minLength('email', 5),
                    maxLength('email', 50)
                  ]"
                  v-model="driverLocal.email"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Số điện thoại"
                  name="phone"
                  prepend-icon="mdi-account"
                  type="text"
                  :counter="10"
                  :rules="[minLength('phone', 10), maxLength('phone', 10)]"
                  v-model="driverLocal.phone"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Địa chỉ"
                  name="address"
                  prepend-icon="mdi-lock"
                  type="text"
                  :counter="100"
                  :rules="[minLength('address', 5), maxLength('address', 100)]"
                  v-model="driverLocal.address"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn @click="updateDriver()" color="primary" v-if="update"
          >Cập nhập</v-btn
        >
        <v-btn @click="createDriver()" color="primary" v-else>Thêm mới</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IDriver } from "@/entity/driver";
import FormValidate from "@/mixin/form-validate";
import { createDriver, updateDriver } from "@/api/driver";

@Component({
  mixins: [FormValidate]
})
export default class CreateDriver extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @Prop(Object) driver!: IDriver;
  @PropSync("drivers", { type: Array }) driversSync!: Array<IDriver>;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @Prop(Boolean) update!: boolean;

  driverLocal = {} as IDriver;
  created() {
    this.driverLocal = Object.assign({}, this.driver);
  }
  createDriver() {
    if (this.driverLocal) {
      createDriver(this.driverLocal)
        .then(res => {
          console.log(res.data);
          const response: IDriver = res.data;
          this.driverLocal = response;
          this.messageSync =
            "Thêm mới thành công lái xe: " + this.driverLocal.id;
          this.driversSync.unshift(this.driverLocal);
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
  updateDriver() {
    if (this.driverLocal.id) {
      updateDriver(this.driverLocal)
        .then(res => {
          console.log(res.data);
          const response: IDriver = res.data;
          this.messageSync = "Cập nhập thành công lái xe: " + response.username;
          const index = this.driversSync.findIndex(x => x.id == response.id);
          this.driversSync.splice(index, 1, response);
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
}
</script>
