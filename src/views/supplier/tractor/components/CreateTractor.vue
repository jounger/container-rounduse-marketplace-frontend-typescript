<template>
  <v-dialog v-model="dialogAddSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            update ? "Cập nhật Đầu kéo" : "Thêm mới Đầu kéo"
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
                :disabled="update"
                :counter="20"
                :rules="[minLength('Biển số', 5), maxLength('Biển số', 20)]"
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
                  required('số trục'),
                  minNumber('Số lượng trục', 1),
                  maxNumber('Số lượng trục', 5)
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
          >Cập nhật</v-btn
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
  editContainerTractor
} from "@/api/container-tractor";

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
    numberOfAxles: 2
  } as IContainerTractor;
  valid = false;
  created() {
    if (this.update) {
      this.tractorLocal = Object.assign({}, this.tractor);
    }
  }
  async createTractor() {
    if (this.tractorLocal) {
      const _res = await createContainerTractor(this.tractorLocal);
      if (_res.data) {
        const _tractor = _res.data.data;
        this.tractorsSync.unshift(_tractor);
        this.totalItemsSync += 1;
        this.dialogAddSync = false;
      }
    }
  }
  async updateTractor() {
    if (this.tractorLocal.id) {
      const _res = await editContainerTractor(
        this.tractorLocal.id,
        this.tractorLocal
      );
      if (_res.data) {
        const _tractor = _res.data.data;
        const index = this.tractorsSync.findIndex(x => x.id == _tractor.id);
        this.tractorsSync.splice(index, 1, _tractor);
      }
    }
  }
}
</script>
