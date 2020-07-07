<template>
  <v-dialog v-model="dialogAddSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            update ? "Cập nhập Đầu kéo" : "Thêm mới Đầu kéo"
          }}</span>
          <v-btn
            icon
            dark
            @click="dialogAddSync = false"
            style="margin-left:319px;"
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
                label="Biển số*"
                name="licensePlate"
                prepend-icon="tram"
                type="text"
                :counter="20"
                :rules="[
                  minLength('licensePlate', 5),
                  maxLength('licensePlate', 20)
                ]"
                v-model="tractorLocal.licensePlate"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs9>
              <v-text-field
                label="Số lượng trục*"
                name="numberOfAxles"
                prepend-icon="format_size"
                type="number"
                :rules="[required('numberOfAxles')]"
                v-model="tractorLocal.numberOfAxles"
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
          @click="updateTractor()"
          color="primary"
          v-if="update"
          :disabled="!valid"
          >Cập nhập</v-btn
        >
        <v-btn
          @click="createTractor()"
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
import { IContainerTractor } from "@/entity/container-tractor";
import FormValidate from "@/mixin/form-validate";

@Component({
  mixins: [FormValidate]
})
export default class CreateTractor extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("tractors", { type: Array }) tractorsSync!: Array<
    IContainerTractor
  >;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) tractor!: IContainerTractor;
  @Prop(Boolean) update!: boolean;

  tractorLocal = {
    licensePlate: "",
    numberOfAxles: 0
  } as IContainerTractor;
  valid = false;
  created() {
    if (this.update) {
      this.tractorLocal = Object.assign({}, this.tractor);
    }
  }
  createTractor() {
    if (this.tractorLocal) {
      // createTractor(this.tractorLocal)
      //   .then(res => {
      //     const response: IContainerTractor = res.data;
      //     this.messageSync = "Thêm mới thành công vai trò: " + response.name;
      //     this.tractorsSync.unshift(response);
      //     this.totalItemsSync += 1;
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     this.messageSync = "Đã có lỗi xảy ra";
      //   })
      //   .finally(() => (this.snackbarSync = true));
      this.messageSync =
        "Thêm mới thành công Đầu kéo: " + this.tractorLocal.licensePlate;
      this.tractorsSync.unshift(this.tractorLocal);
      this.totalItemsSync += 1;
      this.messageSync = "Đã có lỗi xảy ra";
    }
  }
  updateTractor() {
    if (this.tractorLocal.id) {
      // updateTractor(this.tractorLocal)
      //   .then(res => {
      //     console.log(res.data);
      //     const response: IContainerTractor = res.data;
      //     this.messageSync = "Cập nhập thành công vai trò: " + response.name;
      //     const index = this.tractorsSync.findIndex(x => x.id == response.id);
      //     this.tractorsSync.splice(index, 1, response);
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     this.messageSync = "Đã có lỗi xảy ra";
      //   })
      //   .finally(() => (this.snackbarSync = true));
      this.messageSync =
        "Cập nhập thành công Đầu kéo: " + this.tractorLocal.licensePlate;
      const index = this.tractorsSync.findIndex(
        x => x.id == this.tractorLocal.id
      );
      this.tractorsSync.splice(index, 1, this.tractorLocal);
      this.messageSync = "Đã có lỗi xảy ra";
    }
  }
}
</script>
