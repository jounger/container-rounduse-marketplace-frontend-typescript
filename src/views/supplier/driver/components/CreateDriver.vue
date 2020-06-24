<template>
  <v-dialog v-model="dialogSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{ title }}</span>
          <v-btn
            icon
            dark
            @click="dialogSync = false"
            style="margin-left:327px;"
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
                  v-model="driverSync.username"
                  :readonly="readonly"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Tên lái xe"
                  name="driverName"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="driverSync.driverName"
                  :readonly="readonly"
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
                  v-model="driverSync.password"
                  :readonly="readonly"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Số bằng lái"
                  name="driverLicense"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="driverSync.driverLicense"
                  :readonly="readonly"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-select
                  :items="['ROLE_DRIVER']"
                  label="Phân quyền*"
                  prepend-icon="mdi-lock"
                  required
                  v-model="driverSync.role"
                  :readonly="readonly"
                ></v-select>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-select
                  :items="['PENDING', 'ACTIVE', 'BANNED']"
                  label="Trạng thái*"
                  prepend-icon="mdi-lock"
                  required
                  v-model="driverSync.status"
                  :readonly="readonly"
                ></v-select>
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
                  v-model="driverSync.email"
                  :readonly="readonly"
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
                  v-model="driverSync.website"
                  :readonly="readonly"
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
                  v-model="driverSync.phone"
                  :readonly="readonly"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Địa chỉ"
                  name="address"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="driverSync.address"
                  :readonly="readonly"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>

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
        <v-btn @click="updateDriver()" color="primary" v-if="checkUpdate"
          >Cập nhập</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import { IDriver } from "@/entity/driver";

@Component({
  name: "CreateDriver"
})
export default class CreateDriver extends Vue {
  // @Prop() selected!: Array<object>;
  @PropSync("dialogAdd", { type: Boolean }) dialogSync!: boolean;
  @PropSync("checkSuccess", { type: Boolean }) checkSuccessSync!: boolean;
  @PropSync("success", { type: String }) successSync!: string | null;
  @Prop(Boolean) checkAdd!: boolean;
  @Prop(Boolean) checkUpdate!: boolean;
  @Prop(Boolean) readonly!: boolean;
  @PropSync("driver", {
    type: Object
  })
  driverSync!: IDriver | null;
  @Prop(String) title!: string | null;

  public submit() {
    this.successSync = "Thêm mới thành công!";
    this.checkSuccessSync = true;
    this.dialogSync = false;
  }
  public updateDriver() {
    this.successSync = "Cập nhập thành công";
    this.checkSuccessSync = true;
    this.dialogSync = false;
  }
}
</script>
