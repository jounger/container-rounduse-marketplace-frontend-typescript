<template>
  <v-dialog v-model="dialogAddSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            update ? "Cập nhập Bến cảng" : "Thêm mới Bến cảng"
          }}</span>
          <v-btn
            icon
            dark
            @click="dialogAddSync = false"
            style="margin-left:307px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid" validation>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-layout row>
            <v-flex xs9>
              <v-text-field
                label="Mã code*"
                name="nameCode"
                prepend-icon="mdi-account"
                type="text"
                v-model="portLocal.nameCode"
                :rules="[required('namecode')]"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs9>
              <v-text-field
                label="Tên bến cảng*"
                name="fullname"
                prepend-icon="mdi-account"
                type="text"
                v-model="portLocal.fullname"
                :rules="[required('fullname')]"
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
                v-model="portLocal.address"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn
          @click="updatePort()"
          color="primary"
          v-if="update"
          :disabled="!valid"
          >Cập nhập</v-btn
        >
        <v-btn @click="createPort()" color="primary" v-else :disabled="!valid"
          >Thêm mới</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IPort } from "@/entity/port";
import { createPort, updatePort } from "@/api/port";
import FormValidate from "@/mixin/form-validate";

@Component({
  mixins: [FormValidate]
})
export default class CreatePort extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("ports", { type: Array }) portsSync!: Array<IPort>;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Boolean) update!: boolean;
  @Prop(Object) port!: IPort;

  portLocal = {
    fullname: "",
    nameCode: "",
    address: ""
  } as IPort;
  valid = false;
  created() {
    if (this.update) {
      this.portLocal = Object.assign({}, this.port);
    }
  }
  createPort() {
    if (this.portLocal) {
      createPort(this.portLocal)
        .then(res => {
          console.log(res.data);
          const response: IPort = res.data;
          this.messageSync =
            "Thêm mới thành công bến tàu: " + response.fullname;
          this.portsSync.unshift(response);
          this.totalItemsSync += 1;
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
  updatePort() {
    if (this.portLocal.id) {
      updatePort(this.portLocal)
        .then(res => {
          console.log(res.data);
          const response: IPort = res.data;
          this.messageSync =
            "Cập nhập thành công bến cảng: " + response.fullname;
          const index = this.portsSync.findIndex(x => x.id == response.id);
          this.portsSync.splice(index, 1, response);
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
