<template>
  <v-dialog
    v-model="dialogAddSync"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
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
          <v-btn dark text @click="updateOperator()" v-if="update"
            >Cập nhập</v-btn
          >
          <v-btn dark text @click="createOperator()" v-else>Thêm mới</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-container>
            <v-layout col>
              <v-layout row>
                <v-flex xs10>
                  <v-text-field
                    label="Tên đăng nhập*"
                    type="text"
                    v-model="operatorLocal.username"
                    :readonly="update"
                    :counter="20"
                    :rules="[
                      minLength('username', 2),
                      maxLength('username', 20)
                    ]"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs10>
                  <v-text-field
                    v-if="!update"
                    label="Mật khẩu*"
                    type="password"
                    v-model="operatorLocal.password"
                    :counter="120"
                    :rules="[
                      minLength('password', 6),
                      maxLength('password', 120)
                    ]"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-layout>
            <v-layout col>
              <v-layout row>
                <v-flex xs10>
                  <v-text-field
                    label="Email*"
                    type="email"
                    v-model="operatorLocal.email"
                    :counter="50"
                    :rules="[
                      email('Operator'),
                      minLength('email', 5),
                      maxLength('email', 50)
                    ]"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs10>
                  <v-text-field
                    label="Số điện thoại*"
                    type="phone"
                    v-model="operatorLocal.phone"
                    :counter="10"
                    :rules="[minLength('phone', 10), maxLength('phone', 10)]"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-layout>
            <v-layout col>
              <v-layout row>
                <v-flex xs10>
                  <v-text-field
                    label="Họ và tên*"
                    type="fullname"
                    v-model="operatorLocal.fullname"
                    :rules="[required('fullname')]"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs10>
                  <v-text-field
                    label="Địa chỉ"
                    name="address"
                    :counter="100"
                    :rules="[
                      minLength('address', 5),
                      maxLength('address', 100)
                    ]"
                    type="text"
                    v-model="operatorLocal.address"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-layout>
            <v-layout col>
              <v-layout row>
                <v-flex xs6>
                  <v-select
                    v-model="role"
                    :items="roles"
                    label="Phân quyền*"
                    :rules="[required('role')]"
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
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
  @PropSync("operator", { type: Object }) operatorSync!: IOperator;
  @Prop(Boolean) update!: boolean;

  roles = ["ROLE_ADMIN", "ROLE_MODERATOR"];
  role = "";
  operatorLocal = {} as IOperator;
  created() {
    this.operatorLocal = Object.assign({}, this.operatorSync);
    if (typeof this.operatorLocal.roles[0] != "undefined") {
      this.role = this.operatorLocal.roles[0];
    } else {
      this.role = "";
    }
  }
  createOperator() {
    if (this.operatorLocal) {
      this.operatorLocal.roles[0] = this.role;
      createOperator(this.operatorLocal)
        .then(res => {
          const response: IOperator = res.data;
          this.operatorLocal.id = response.id;
          this.messageSync =
            "Thêm mới thành công quản trị viên: " + this.operatorLocal.username;
          this.operatorsSync.unshift(this.operatorLocal);
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
      this.operatorLocal.roles[0] = this.role;
      this.operatorSync = Object.assign({}, this.operatorLocal);
      editOperator(this.operatorLocal.id, this.operatorSync)
        .then(res => {
          const response: IOperator = res.data;
          this.operatorSync = response;
          this.messageSync =
            "Cập nhập thành công quản trị viên: " + this.operatorSync.username;
          const index = this.operatorsSync.findIndex(
            x => x.id === this.operatorSync.id
          );
          this.operatorsSync.splice(index, 1, this.operatorSync);
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
