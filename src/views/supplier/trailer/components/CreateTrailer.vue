<template>
  <v-dialog v-model="dialogAddSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            update ? "Cập nhập Rơ moóc" : "Thêm mới Rơ moóc"
          }}</span>
        </v-toolbar-title>
      </v-toolbar>
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
                :counter="20"
                :rules="[
                  minLength('licensePlate', 5),
                  maxLength('licensePlate', 20)
                ]"
                v-model="trailerLocal.licensePlate"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="11">
              <v-select
                v-model="trailerLocal.type"
                prepend-icon="timeline"
                :items="typesLoad"
                :rules="[required('type')]"
                :loading="loading"
                no-data-text="Danh sách loại rơ moóc rỗng."
                label="Loại rơ moóc*"
                ><v-btn
                  text
                  small
                  color="primary"
                  v-if="seeMore"
                  slot="append-item"
                  style="margin-left:185px;"
                  @click="loadMore()"
                  >Xem thêm</v-btn
                ></v-select
              >
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
                v-model="trailerLocal.numberOfAxles"
              ></v-text-field>
            </v-col>
          </v-row>
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
import {
  createContainerSemiTrailer,
  updateContainerSemiTrailer
} from "@/api/container-semi-trailer";
import { getErrorMessage } from "@/utils/tool";
import snackbar from "@/store/modules/snackbar";

@Component({
  mixins: [FormValidate]
})
export default class CreateTrailer extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("trailers", { type: Array }) trailersSync!: Array<
    IContainerSemiTrailer
  >;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) trailer!: IContainerSemiTrailer;
  @Prop(Boolean) update!: boolean;

  trailerLocal = {
    type: "",
    unitOfMeasurement: "ft",
    licensePlate: "",
    numberOfAxles: 1
  } as IContainerSemiTrailer;
  valid = false;
  loading = false;
  seeMore = true;
  limit = 5;
  types: Array<string> = [];
  typesLoad: Array<string> = [];

  getTypes(limit: number) {
    this.typesLoad = [] as Array<string>;
    if (!this.update) {
      this.types.forEach((x: string, index: number) => {
        if (index < limit) {
          this.typesLoad.push(x);
        }
      });
    } else {
      this.types.forEach((x: string) => {
        if (x == this.trailerLocal.type) {
          this.typesLoad.push(x);
        }
      });
      this.types.forEach((x: string) => {
        let check = false;
        if (x == this.trailerLocal.type) {
          check = true;
        }
        if (check == false && this.typesLoad.length < this.limit) {
          this.typesLoad.push(x);
        }
      });
    }
    if (this.types.length <= this.limit) {
      this.seeMore = false;
    }
    this.loading = false;
  }
  loadMore() {
    this.limit += 5;
    this.getTypes(this.limit);
  }
  created() {
    this.types = ["T28", "T32", "T34", "T36", "T40", "T45", "T48", "T53"];
    if (this.update) {
      this.trailerLocal = Object.assign({}, this.trailer);
      this.getTypes(10);
    } else {
      this.getTypes(5);
    }
  }
  async createTrailer() {
    if (this.trailerLocal) {
      const _trailer = await createContainerSemiTrailer(this.trailerLocal)
        .then(res => {
          const response: IContainerSemiTrailer = res.data;
          snackbar.setSnackbar({
            text: "Thêm mới thành công Rơ moóc: " + response.licensePlate,
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
      if (_trailer) {
        this.trailersSync.unshift(_trailer);
        this.totalItemsSync += 1;
        this.dialogAddSync = false;
      }
      snackbar.setDisplay(true);
    }
  }
  async updateTrailer() {
    if (this.trailerLocal.id) {
      const _trailer = await updateContainerSemiTrailer(this.trailerLocal)
        .then(res => {
          console.log(res.data);
          const response: IContainerSemiTrailer = res.data;
          snackbar.setSnackbar({
            text: "Cập nhật thành công Rơ moóc: " + response.licensePlate,
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
      if (_trailer) {
        const index = this.trailersSync.findIndex(x => x.id == _trailer.id);
        this.trailersSync.splice(index, 1, _trailer);
      }
      snackbar.setDisplay(true);
    }
  }
}
</script>
