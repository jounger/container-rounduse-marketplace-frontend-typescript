<template>
  <v-dialog v-model="dialogAddSync" max-width="600">
    <v-card>
      <v-card-title class="headline">{{
        update ? "Cập nhật Quản trị viên" : "Thêm mới Quản trị viên"
      }}</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form v-model="valid" validation>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Tên đăng nhập*"
                  type="text"
                  prepend-icon="mdi-account"
                  v-model="operatorLocal.username"
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
                  label="Mật khẩu*"
                  prepend-icon="mdi-lock"
                  type="password"
                  v-model="operatorLocal.password"
                  :counter="120"
                  :rules="[
                    minLength('Mật khẩu', 6),
                    maxLength('Mật khẩu', 120)
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
                    email('quản trị viên'),
                    minLength('Email', 5),
                    maxLength('Email', 50)
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
                  :rules="[
                    minLength('Số điện thoại', 10),
                    maxLength('Số điện thoại', 10)
                  ]"
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
                  :rules="[required('họ và tên')]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Địa chỉ*"
                  name="address"
                  prepend-icon="location_on"
                  :counter="100"
                  :rules="[minLength('Địa chỉ', 5), maxLength('Địa chỉ', 100)]"
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
                  :rules="[required('phân quyền')]"
                ></v-select> </v-col
            ></v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn
          @click="updateOperator()"
          color="primary"
          v-if="update"
          :disabled="!valid"
          >Cập nhật</v-btn
        >
        <v-btn
          @click="createOperator()"
          color="primary"
          v-else
          :disabled="!valid"
          >Thêm mới</v-btn
        >
      </v-card-actions>
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

  async createOperator() {
    if (this.operatorLocal) {
      const _res = await createOperator(this.operatorLocal);
      if (_res.data) {
        const _operator = _res.data.data;
        this.operatorsSync.unshift(_operator);
        this.totalItemsSync += 1;
        this.dialogAddSync = false;
      }
    }
  }

  async updateOperator() {
    if (this.operatorLocal.id) {
      const _res = await editOperator(
        this.operatorLocal.id,
        this.operatorLocal
      );
      if (_res.data) {
        const _operator = _res.data.data;
        const index = this.operatorsSync.findIndex(x => x.id === _operator.id);
        this.operatorsSync.splice(index, 1, _operator);
      }
    }
  }
}
</script>
