<template>
  <v-dialog v-model="dialogAddSync" max-width="600px">
    <v-card style="height: 650px;">
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{ title }}</span>
          <v-btn
            icon
            dark
            @click="dialogAddSync = false"
            style="margin-left:295px;"
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
                  required
                  :readonly="readonly"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Mật khẩu*"
                  type="password"
                  v-model="operatorSync.password"
                  required
                  :readonly="readonly"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Email*"
                  type="email"
                  v-model="operatorSync.email"
                  required
                  :readonly="readonly"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="8">
                <v-select
                  :items="['ROLE_ADMIN']"
                  label="Phân quyền*"
                  required
                  v-model="operatorSync.role"
                  :readonly="readonly"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="8">
                <v-select
                  :items="['PENDING', 'ACTIVE', 'BANNED']"
                  label="Trạng thái*"
                  required
                  v-model="operatorSync.status"
                  :readonly="readonly"
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
        <v-btn @click="updateOperator()" color="primary" v-if="operatorSync.id"
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
import { createOperator, updateOperator } from "@/api/operator";

@Component
export default class DialogCreateOperator extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("operator", { type: Object }) operatorSync!: IOperator;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  readonly = this.operatorSync ? true : false;
  title = this.readonly ? "Update" : "Add";
  addOperator() {
    if (this.operatorSync) {
      createOperator(this.operatorSync)
        .then(res => {
          console.log(res.data);
          const response: IOperator = res.data;
          this.operatorSync = response;
          this.messageSync =
            "Success " + this.title + " for user: " + response.username;
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Error happend";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
  updateOperator() {
    if (this.operatorSync.id) {
      updateOperator(this.operatorSync)
        .then(res => {
          console.log(res.data);
          const response: IOperator = res.data;
          this.operatorSync = response;
          this.messageSync =
            "Success " + this.title + " for user: " + response.username;
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Error happend";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
}
</script>
