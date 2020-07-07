<template>
  <v-dialog v-model="dialogAddSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            update ? "Cập nhập Rơ moóc" : "Thêm mới Rơ moóc"
          }}</span>
          <v-btn
            icon
            dark
            @click="dialogAddSync = false"
            style="margin-left:310px;"
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
                prepend-icon="format_strikethrough"
                type="text"
                :counter="20"
                :rules="[
                  minLength('licensePlate', 5),
                  maxLength('licensePlate', 20)
                ]"
                v-model="trailerLocal.licensePlate"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs9>
              <v-select
                v-model="trailerLocal.type"
                prepend-icon="format_strikethrough"
                :items="types"
                :rules="[required('type')]"
                label="Loại rơ moóc*"
              ></v-select>
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
                v-model="trailerLocal.numberOfAxles"
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
          @click="updateTrailer()"
          color="primary"
          v-if="update"
          :disabled="!valid"
          >Cập nhập</v-btn
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

@Component({
  mixins: [FormValidate]
})
export default class CreateTrailer extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("trailers", { type: Array }) trailersSync!: Array<
    IContainerSemiTrailer
  >;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) trailer!: IContainerSemiTrailer;
  @Prop(Boolean) update!: boolean;

  trailerLocal = {
    type: "",
    unitOfMeasurement: "ft",
    licensePlate: "",
    numberOfAxles: 0
  } as IContainerSemiTrailer;
  valid = false;
  types: Array<string> = [];
  created() {
    this.types = ["T28", "T32", "T34", "T36", "T40", "T45", "T48", "T53"];
    if (this.update) {
      this.trailerLocal = Object.assign({}, this.trailer);
    }
  }
  createTrailer() {
    if (this.trailerLocal) {
      // createTrailer(this.trailerLocal)
      //   .then(res => {
      //     const response: IContainerSemiTrailer = res.data;
      //     this.messageSync = "Thêm mới thành công vai trò: " + response.name;
      //     this.trailersSync.unshift(response);
      //     this.totalItemsSync += 1;
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     this.messageSync = "Đã có lỗi xảy ra";
      //   })
      //   .finally(() => (this.snackbarSync = true));
      this.messageSync =
        "Thêm mới thành công rơ moóc: " + this.trailerLocal.licensePlate;
      this.trailersSync.unshift(this.trailerLocal);
      this.totalItemsSync += 1;
      this.messageSync = "Đã có lỗi xảy ra";
    }
  }
  updateTrailer() {
    if (this.trailerLocal.id) {
      // updateTrailer(this.trailerLocal)
      //   .then(res => {
      //     console.log(res.data);
      //     const response: IContainerSemiTrailer = res.data;
      //     this.messageSync = "Cập nhập thành công vai trò: " + response.name;
      //     const index = this.trailersSync.findIndex(x => x.id == response.id);
      //     this.trailersSync.splice(index, 1, response);
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     this.messageSync = "Đã có lỗi xảy ra";
      //   })
      //   .finally(() => (this.snackbarSync = true));
      this.messageSync =
        "Cập nhập thành công rơ moóc: " + this.trailerLocal.licensePlate;
      const index = this.trailersSync.findIndex(
        x => x.id == this.trailerLocal.id
      );
      this.trailersSync.splice(index, 1, this.trailerLocal);
      this.messageSync = "Đã có lỗi xảy ra";
    }
  }
}
</script>
