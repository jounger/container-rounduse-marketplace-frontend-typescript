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
            style="margin-left:412px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-layout row>
            <v-flex xs9>
              <v-text-field
                label="Tên bến cảng"
                name="fullname"
                prepend-icon="mdi-account"
                type="text"
                v-model="portSync.fullname"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs9>
              <v-text-field
                label="Mã code"
                name="nameCode"
                prepend-icon="mdi-account"
                type="text"
                v-model="portSync.nameCode"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs9>
              <v-text-field
                label="Vị trí"
                name="address"
                prepend-icon="mdi-account"
                type="text"
                v-model="portSync.address"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn @click="updatePort()" color="primary" v-if="isUpdate"
          >Cập nhập</v-btn
        >
        <v-btn @click="addPort()" color="primary" v-else>Thêm mới</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { IPort } from "@/entity/port";
import { createPort, updatePort } from "@/api/port";

@Component
export default class CreatePort extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("port", { type: Object }) portSync!: IPort;
  @PropSync("ports", { type: Array }) portsSync!: Array<IPort>;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  get isUpdate() {
    if (typeof this.portSync.id !== "undefined") return true;
    return false;
  }
  addPort() {
    if (this.portSync) {
      createPort(this.portSync)
        .then(res => {
          console.log(res.data);
          const response: IPort = res.data;
          this.portSync = response;
          this.messageSync =
            "Thêm mới thành công bến tàu: " + this.portSync.fullname;
          this.portsSync.push(this.portSync);
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(
          () => ((this.snackbarSync = true), (this.dialogAddSync = false))
        );
    }
  }
  updatePort() {
    if (this.portSync.id) {
      updatePort(this.portSync)
        .then(res => {
          console.log(res.data);
          const response: IPort = res.data;
          this.portSync = response;
          this.messageSync =
            "Cập nhập thành công bến cảng: " + this.portSync.fullname;
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(
          () => ((this.snackbarSync = true), (this.dialogAddSync = false))
        );
    }
  }
}
</script>
