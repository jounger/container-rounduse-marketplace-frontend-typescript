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
                :rules="[
                  required('numberOfAxles'),
                  minNumber('numberOfAxles', 1),
                  maxNumber('numberOfAxles', 4)
                ]"
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
import Utils from "@/mixin/utils";
import {
  createContainerTractor,
  updateContainerTractor
} from "@/api/container-tractor";

@Component({
  mixins: [FormValidate, Utils]
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
    numberOfAxles: 1
  } as IContainerTractor;
  valid = false;
  created() {
    if (this.update) {
      this.tractorLocal = Object.assign({}, this.tractor);
    }
  }
  createTractor() {
    if (this.tractorLocal) {
      createContainerTractor(this.tractorLocal)
        .then(res => {
          const response: IContainerTractor = res.data;
          this.messageSync =
            "Thêm mới thành công Đầu kéo: " + response.licensePlate;
          this.tractorsSync.unshift(response);
          this.totalItemsSync += 1;
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
  updateTractor() {
    if (this.tractorLocal.id) {
      updateContainerTractor(this.tractorLocal)
        .then(res => {
          console.log(res.data);
          const response: IContainerTractor = res.data;
          this.messageSync =
            "Cập nhập thành công Đầu kéo: " + response.licensePlate;
          const index = this.tractorsSync.findIndex(x => x.id == response.id);
          this.tractorsSync.splice(index, 1, response);
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
