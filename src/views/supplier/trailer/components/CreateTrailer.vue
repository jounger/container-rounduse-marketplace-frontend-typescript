<template>
  <v-dialog v-model="dialogAddSync" max-width="600">
    <v-card>
      <v-card-title class="headline">{{
        update ? "Cập nhật Rơ moóc" : "Thêm mới Rơ moóc"
      }}</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form v-model="valid" validation>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-row>
            <v-col cols="12" md="11">
              <v-text-field
                label="Biển số*"
                name="licensePlate"
                prepend-icon="format_strikethrough"
                type="text"
                :disabled="update"
                :counter="20"
                :rules="[minLength('Biển số', 5), maxLength('Biển số', 20)]"
                v-model="trailerLocal.licensePlate"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="11">
              <v-select
                v-model="trailerLocal.type"
                prepend-icon="timeline"
                :items="types"
                :rules="[required('loại rơ moóc')]"
                no-data-text="Danh sách loại rơ moóc rỗng."
                label="Loại rơ moóc*"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="11">
              <v-text-field
                label="Số lượng giàn*"
                name="numberOfAxles"
                prepend-icon="format_size"
                type="number"
                :rules="[
                  required('số lượng giàn'),
                  minNumber('Số lượng giàn', 2),
                  maxNumber('Số lượng giàn', 3)
                ]"
                v-model="trailerLocal.numberOfAxles"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn
          @click="updateTrailer()"
          color="primary"
          v-if="update"
          :disabled="!valid"
          >Cập nhật</v-btn
        >
        <v-btn
          @click="createTrailer()"
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
import { IContainerSemiTrailer } from "@/entity/container-semi-trailer";
import FormValidate from "@/mixin/form-validate";
import {
  createContainerSemiTrailer,
  editContainerSemiTrailer
} from "@/api/container-semi-trailer";

@Component({
  mixins: [FormValidate]
})
export default class CreateTrailer extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("trailers", { type: Array }) trailersSync!: IContainerSemiTrailer[];
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) trailer!: IContainerSemiTrailer;
  @Prop(Boolean) update!: boolean;

  trailerLocal = {
    type: "",
    unitOfMeasurement: "ft",
    licensePlate: "",
    numberOfAxles: 2
  } as IContainerSemiTrailer;
  valid = false;
  types: Array<string> = [];

  created() {
    this.types = ["T28", "T32", "T34", "T36", "T40", "T45", "T48", "T53"];
    if (this.update) {
      this.trailerLocal = Object.assign({}, this.trailer);
    }
  }

  async createTrailer() {
    if (this.trailerLocal) {
      const _res = await createContainerSemiTrailer(this.trailerLocal);
      if (_res.data) {
        const _trailer = _res.data.data;
        this.trailersSync.unshift(_trailer);
        this.totalItemsSync += 1;
        this.dialogAddSync = false;
      }
    }
  }

  async updateTrailer() {
    if (this.trailerLocal.id) {
      const _res = await editContainerSemiTrailer(
        this.trailerLocal.id,
        this.trailerLocal
      );
      if (_res.data) {
        const _trailer = _res.data.data;
        const index = this.trailersSync.findIndex(x => x.id == _trailer.id);
        this.trailersSync.splice(index, 1, _trailer);
      }
    }
  }
}
</script>
