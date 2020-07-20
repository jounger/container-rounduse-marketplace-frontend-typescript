<template>
  <v-dialog v-model="dialogAddContSync" max-width="500px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            update ? "Cập nhập Container" : "Thêm mới Container"
          }}</span>
          <v-btn
            icon
            dark
            @click="dialogAddContSync = false"
            style="margin-left:202px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>

      <v-card-text>
        <v-form v-model="valid" validation>
          <v-container>
            <small>*Dấu sao là trường bắt buộc</small>
            <v-layout row>
              <v-layout col>
                <v-flex xs10>
                  <v-text-field
                    v-model="containerLocal.containerNumber"
                    prepend-icon="directions_bus"
                    :rules="[required('container number')]"
                    label="Container No.*"
                    :readonly="update"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout col>
                <v-flex xs10>
                  <v-select
                    v-model="containerLocal.driver"
                    prepend-icon="airline_seat_recline_normal"
                    :items="driversToString"
                    :rules="[required('driver')]"
                    label="Tài xế*"
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-layout>
            <v-layout row>
              <v-layout col>
                <v-flex xs10>
                  <v-select
                    v-model="containerLocal.tractor"
                    prepend-icon="tram"
                    :items="tractorsToString"
                    :rules="[required('tractor')]"
                    label="Chọn đầu kéo*"
                  ></v-select>
                </v-flex>
              </v-layout>
              <v-layout col>
                <v-flex xs10>
                  <v-select
                    v-model="containerLocal.trailer"
                    prepend-icon="format_strikethrough"
                    :items="trailersToString"
                    :rules="[required('trailer')]"
                    label="Chọn rơ moóc*"
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialogAddContSync = false">Trở về</v-btn>
        <v-btn
          color="primary"
          v-if="!update"
          :disabled="!valid"
          @click="createContainer()"
          >Thêm mới</v-btn
        >
        <v-btn
          color="primary"
          v-else
          :disabled="!valid"
          @click="updateContainer()"
          >Cập nhập</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { createContainer, updateContainer } from "@/api/container";
import { IContainer } from "@/entity/container";
import { IBillOfLading } from "@/entity/bill-of-lading";
import FormValidate from "@/mixin/form-validate";
import { IContainerSemiTrailer } from "@/entity/container-semi-trailer";
import { IContainerTractor } from "@/entity/container-tractor";
import { getContainerTractorsByForwarder } from "@/api/container-tractor";
import { getContainerSemiTrailersByForwarder } from "@/api/container-semi-trailer";
import { PaginationResponse } from "@/api/payload";
import { getDriversByForwarder } from "@/api/driver";
import { IDriver } from "@/entity/driver";
import { getErrorMessage } from "@/utils/tool";
import snackbar from "@/store/modules/snackbar";

@Component({
  mixins: [FormValidate]
})
export default class CreateContainer extends Vue {
  @PropSync("dialogAddCont", { type: Boolean }) dialogAddContSync!: boolean;
  @PropSync("containers", { type: Array }) containersSync!: Array<IContainer>;
  @Prop(Object) container!: IContainer;
  @Prop(Object) billOfLading!: IBillOfLading;
  @Prop(Boolean) update!: boolean;

  valid = false;
  containerLocal = {
    containerNumber: "",
    trailer: "",
    tractor: "",
    driver: "",
    status: ""
  } as IContainer;
  trailers: Array<IContainerSemiTrailer> = [];
  tractors: Array<IContainerTractor> = [];
  drivers: Array<IDriver> = [];
  async created() {
    if (this.update) {
      this.containerLocal = Object.assign({}, this.container);
      if (typeof this.containerLocal.trailer != "string") {
        this.containerLocal.trailer = this.containerLocal.trailer.licensePlate;
      }
      if (typeof this.containerLocal.tractor != "string") {
        this.containerLocal.tractor = this.containerLocal.tractor.licensePlate;
      }
    }
    const _tractor = await getContainerTractorsByForwarder({
      page: 0,
      limit: 100
    })
      .then(res => {
        const response: PaginationResponse<IContainerTractor> = res.data;
        return response.data;
      })
      .catch(err => console.log(err));
    this.tractors = _tractor || [];
    const _trailer = await getContainerSemiTrailersByForwarder({
      page: 0,
      limit: 100
    })
      .then(res => {
        const response: PaginationResponse<IContainerSemiTrailer> = res.data;
        return response.data;
      })
      .catch(err => console.log(err));
    this.trailers = _trailer || [];
    const _driver = await getDriversByForwarder({
      page: 0,
      limit: 100
    })
      .then(res => {
        const response: PaginationResponse<IDriver> = res.data;
        console.log("watch", response);
        return response.data;
      })
      .catch(err => console.log(err));
    this.drivers = _driver || [];
  }
  async createContainer() {
    // TODO: API create Container
    if (this.billOfLading.id) {
      const _container = await createContainer(
        this.billOfLading.id,
        this.containerLocal
      )
        .then(res => {
          console.log(res.data);
          const response: IContainer = res.data;
          snackbar.setSnackbar({
            text: "Thêm mới thành công Container: " + response.containerNumber,
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
      if (_container) {
        this.containersSync.unshift(_container);
      }
      snackbar.setDisplay(true);
    }
  }
  async updateContainer() {
    const _container = await updateContainer(this.containerLocal)
      .then(res => {
        const response: IContainer = res.data;
        snackbar.setSnackbar({
          text: "Cập nhập thành công Container: " + response.containerNumber,
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
    if (_container) {
      const index = this.containersSync.findIndex(x => x.id === _container.id);
      this.containersSync.splice(index, 1, _container);
    }
    snackbar.setDisplay(true);
  }

  get trailersToString() {
    return this.trailers.map(x => x.licensePlate);
  }
  get tractorsToString() {
    return this.tractors.map(x => x.licensePlate);
  }
  get driversToString() {
    return this.drivers.map(x => x.username);
  }
}
</script>
