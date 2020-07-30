<template>
  <v-dialog v-model="dialogAddSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            update ? "Cập nhập Đầu kéo" : "Thêm mới Đầu kéo"
          }}</span></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid" validation>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-row>
            <v-col cols="12" md="11">
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
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="11">
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
            </v-col>
          </v-row>
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
import { getErrorMessage } from "@/utils/tool";
import snackbar from "@/store/modules/snackbar";

@Component({
  mixins: [FormValidate, Utils]
})
export default class CreateTractor extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("tractors", { type: Array }) tractorsSync!: Array<
    IContainerTractor
  >;
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
  async createTractor() {
    if (this.tractorLocal) {
      const _tractor = await createContainerTractor(this.tractorLocal)
        .then(res => {
          const response: IContainerTractor = res.data;
          snackbar.setSnackbar({
            text: "Thêm mới thành công Đầu kéo: " + response.licensePlate,
            color: "success"
          });
          return response;
        })
        .catch(err => {
          console.log(err);
          snackbar.setSnackbar({
            text: getErrorMessage(err),
            color: "error"
          });
          return null;
        });
      if (_tractor) {
        this.tractorsSync.unshift(_tractor);
        this.totalItemsSync += 1;
        this.dialogAddSync = false;
      }
      snackbar.setDisplay(true);
    }
  }
  async updateTractor() {
    if (this.tractorLocal.id) {
      const _tractor = await updateContainerTractor(this.tractorLocal)
        .then(res => {
          console.log(res.data);
          const response: IContainerTractor = res.data;
          snackbar.setSnackbar({
            text: "Cập nhật thành công Đầu kéo: " + response.licensePlate,
            color: "success"
          });
          return response;
        })
        .catch(err => {
          console.log(err);
          snackbar.setSnackbar({
            text: getErrorMessage(err),
            color: "error"
          });
          return null;
        });
      if (_tractor) {
        const index = this.tractorsSync.findIndex(x => x.id == _tractor.id);
        this.tractorsSync.splice(index, 1, _tractor);
      }
      snackbar.setDisplay(true);
    }
  }
}
</script>
