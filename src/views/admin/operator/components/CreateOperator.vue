<template>
  <v-dialog
    v-model="dialogAddSync"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-form v-model="valid" validation>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialogAddSync = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{
            update ? "Cập nhập Quản trị viên" : "Thêm mới Quản trị viên"
          }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="dialogAddSync = false">Trở về</v-btn>
            <v-btn
              dark
              text
              @click="updateOperator()"
              v-if="update"
              :disabled="!valid"
              >Cập nhập</v-btn
            >
            <v-btn dark text @click="createOperator()" v-else :disabled="!valid"
              >Thêm mới</v-btn
            >
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Tên đăng nhập*"
                  type="text"
                  prepend-icon="mdi-account"
                  v-model="operatorLocal.username"
                  :readonly="update"
                  :counter="20"
                  :rules="[minLength('username', 2), maxLength('username', 20)]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-if="!update"
                  label="Mật khẩu*"
                  prepend-icon="mdi-lock"
                  type="password"
                  v-model="operatorLocal.password"
                  :counter="120"
                  :rules="[
                    minLength('password', 6),
                    maxLength('password', 120)
                  ]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Email*"
                  type="email"
                  prepend-icon="alternate_email"
                  v-model="operatorLocal.email"
                  :counter="50"
                  :rules="[
                    email('Operator'),
                    minLength('email', 5),
                    maxLength('email', 50)
                  ]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Số điện thoại*"
                  type="number"
                  prepend-icon="phone"
                  v-model="operatorLocal.phone"
                  :counter="10"
                  :rules="[minLength('phone', 10), maxLength('phone', 10)]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Họ và tên*"
                  name="fullname"
                  type="text"
                  prepend-icon="perm_identity"
                  v-model="operatorLocal.fullname"
                  :rules="[required('fullname')]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Địa chỉ*"
                  name="address"
                  prepend-icon="location_on"
                  :counter="100"
                  :rules="[minLength('address', 5), maxLength('address', 100)]"
                  type="text"
                  v-model="operatorLocal.address"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-if="!update"
                  v-model="operatorLocal.roles[0]"
                  name="roles"
                  prepend-icon="security"
                  :items="roles"
                  label="Phân quyền*"
                  :rules="[required('role')]"
                ></v-select> </v-col
            ></v-row>
          </v-container>
        </v-card-text>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IOperator } from "@/entity/operator";
import FormValidate from "@/mixin/form-validate";
import { createOperator, editOperator } from "@/api/operator";

@Component({
  mixins: [FormValidate]
})
export default class CreateOperator extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("operators", { type: Array }) operatorsSync!: Array<IOperator>;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) operator!: IOperator;
  @Prop(Boolean) update!: boolean;

  valid = false;
  roles: Array<string> = [];
  operatorLocal = {
    username: "",
    email: "",
    phone: "",
    roles: ["ROLE_ADMIN"],
    status: "ACTIVE",
    address: "",
    password: "",
    fullname: "",
    isRoot: false
  } as IOperator;
  created() {
    this.roles = ["ROLE_ADMIN", "ROLE_MODERATOR"];
    if (this.update) {
      this.operatorLocal = Object.assign({}, this.operator);
    }
  }
  createOperator() {
    if (this.operatorLocal) {
      createOperator(this.operatorLocal)
        .then(res => {
          const response: IOperator = res.data;
          this.messageSync =
            "Thêm mới thành công quản trị viên: " + response.username;
          this.operatorsSync.unshift(response);
          this.totalItemsSync += 1;
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
  updateOperator() {
    if (this.operatorLocal.id) {
      editOperator(this.operatorLocal.id, this.operatorLocal)
        .then(res => {
          const response: IOperator = res.data;
          console.log(response);
          this.messageSync =
            "Cập nhập thành công quản trị viên: " + response.username;
          const index = this.operatorsSync.findIndex(x => x.id === response.id);
          this.operatorsSync.splice(index, 1, response);
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
