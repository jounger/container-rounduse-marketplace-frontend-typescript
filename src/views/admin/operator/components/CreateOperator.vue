<template>
  <v-dialog v-model="dialogAddSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            isUpdate ? "Cập nhập" : "Thêm mới"
          }}</span>
          <v-btn
            icon
            dark
            @click="dialogAddSync = false"
            style="margin-left:395px;"
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
                  v-model="operatorSync.username"
                  :readonly="isUpdate"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  v-if="!isUpdate"
                  label="Mật khẩu*"
                  type="password"
                  v-model="operatorSync.password"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Email*"
                  type="email"
                  v-model="operatorSync.email"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Số điện thoại*"
                  type="phone"
                  v-model="operatorSync.phone"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="8">
                <v-select
                  v-model="operatorSync.roles[0]"
                  :items="roles"
                  label="Phân quyền*"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" sm="8">
                <v-select
                  :items="['PENDING', 'ACTIVE', 'BANNED']"
                  label="Trạng thái*"
                  required
                  v-model="operatorSync.status"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          <small>*Dấu sao là trường bắt buộc</small>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn @click="updateOperator()" color="primary" v-if="isUpdate"
          >Cập nhập</v-btn
        >
        <v-btn @click="addOperator()" color="primary" v-else>Thêm mới</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { IOperator } from "@/entity/operator";
import { createOperator, editOperator } from "@/api/operator";

@Component
export default class CreateOperator extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("operator", { type: Object }) operatorSync!: IOperator;
  @PropSync("operators", { type: Array }) operatorsSync!: Array<IOperator>;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  roles = ["ROLE_ADMIN", "ROLE_MODERATOR"];
  get isUpdate() {
    if (typeof this.operatorSync.id !== "undefined") return true;
    return false;
  }
  addOperator() {
    if (this.operatorSync) {
      createOperator(this.operatorSync)
        .then(res => {
          console.log(res.data);
          const response: IOperator = res.data;
          this.operatorSync = response;
          this.messageSync =
            "Thêm mới thành công quản trị viên: " + this.operatorSync.username;
          this.operatorsSync.push(this.operatorSync);
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
  updateOperator() {
    if (this.operatorSync.id) {
      console.log(this.operatorSync);
      editOperator(this.operatorSync.id, this.operatorSync)
        .then(res => {
          console.log(res.data);
          const response: IOperator = res.data;
          this.operatorSync = response;
          this.messageSync =
            "Cập nhập thành công quản trị viên: " + this.operatorSync.username;
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
