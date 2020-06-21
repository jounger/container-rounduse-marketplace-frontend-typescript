<template>
  <v-dialog v-model="dialogSync" persistent max-width="600px">
    <v-card style="height: 650px;">
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{ title }}</span>
          <v-btn
            icon
            dark
            @click="dialogSync = false"
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
                  v-model="adminSync.username"
                  required
                  :readonly="readonly"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Mật khẩu*"
                  type="password"
                  v-model="adminSync.password"
                  required
                  :readonly="readonly"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Email*"
                  type="email"
                  v-model="adminSync.email"
                  required
                  :readonly="readonly"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="8">
                <v-select
                  :items="['ROLE_ADMIN']"
                  label="Phân quyền*"
                  required
                  v-model="adminSync.role"
                  :readonly="readonly"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="8">
                <v-select
                  :items="['PENDING', 'ACTIVE', 'BANNED']"
                  label="Trạng thái*"
                  required
                  v-model="adminSync.status"
                  :readonly="readonly"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogSync = false">Trở về</v-btn>
        <v-btn @click="submit()" color="primary" v-if="checkAdd"
          >Thêm mới</v-btn
        >
        <v-btn @click="updateAdmin()" color="primary" v-if="checkUpdate"
          >Cập nhập</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import { UserEntity } from "../../../../store/definitions/user";

@Component({
  name: "CreateAdmin"
})
export default class CreateAdmin extends Vue {
  // @Prop() selected!: Array<object>;
  @PropSync("dialogAdd", { type: Boolean }) dialogSync!: boolean;
  @PropSync("checkSuccess", { type: Boolean }) checkSuccessSync!: boolean;
  @PropSync("success", { type: String }) successSync!: string | null;
  @Prop(Boolean) checkAdd!: boolean;
  @Prop(Boolean) checkUpdate!: boolean;
  @Prop(Boolean) readonly!: boolean;
  @PropSync("admin", {
    type: Object
  })
  adminSync!: UserEntity | null;
  @Prop(String) title!: string | null;
  public submit() {
    this.successSync = "Thêm mới thành công!";
    this.checkSuccessSync = true;
    this.dialogSync = false;
  }
  public updateAdmin() {
    this.successSync = "Cập nhập thành công";
    this.checkSuccessSync = true;
    this.dialogSync = false;
  }
}
</script>
