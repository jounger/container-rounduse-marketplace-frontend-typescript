<template>
  <v-dialog v-model="dialogAddContSync" max-width="500px">
    <v-card>
      <v-card-title class="headline">{{
        update ? "Cập nhật Container" : "Thêm mới Container"
      }}</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form v-model="valid" validation>
          <v-container>
            <small>*Dấu sao là trường bắt buộc</small>
            <v-layout row>
              <v-layout col>
                <v-flex xs10>
                  <v-text-field
                    v-model="containerLocal.number"
                    prepend-icon="directions_bus"
                    :rules="[required('mã Container')]"
                    label="Container No.*"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout col>
                <v-flex xs10>
                  <v-select
                    v-model="containerLocal.driver"
                    prepend-icon="airline_seat_recline_normal"
                    :items="drivers"
                    :rules="[required('lái xe')]"
                    item-text="fullname"
                    item-value="username"
                    no-data-text="Danh sách lái xe rỗng."
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
                    :items="tractors"
                    :rules="[required('đầu kéo')]"
                    item-text="licensePlate"
                    item-value="licensePlate"
                    no-data-text="Danh sách đầu kéo rỗng."
                    label="Chọn đầu kéo*"
                  ></v-select>
                </v-flex>
              </v-layout>
              <v-layout col>
                <v-flex xs10>
                  <v-select
                    v-model="containerLocal.trailer"
                    prepend-icon="format_strikethrough"
                    :items="trailers"
                    :rules="[required('rơ moóc')]"
                    item-text="licensePlate"
                    item-value="licensePlate"
                    no-data-text="Danh sách rơ moóc rỗng."
                    label="Chọn rơ moóc*"
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-space-between">
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
          >Cập nhật</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { createContainer, editContainer } from "@/api/container";
import { IContainer } from "@/entity/container";
import { IBillOfLading } from "@/entity/bill-of-lading";
import FormValidate from "@/mixin/form-validate";
import { IContainerSemiTrailer } from "@/entity/container-semi-trailer";
import { IContainerTractor } from "@/entity/container-tractor";
import { getContainerTractorsByForwarder } from "@/api/container-tractor";
import { getContainerSemiTrailersByForwarder } from "@/api/container-semi-trailer";
import { getDriversByForwarder } from "@/api/driver";
import { IDriver } from "@/entity/driver";

@Component({
  mixins: [FormValidate]
})
export default class CreateContainer extends Vue {
  @PropSync("dialogAddCont", { type: Boolean }) dialogAddContSync!: boolean;
  @PropSync("containers", { type: Array }) containersSync!: Array<IContainer>;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) container!: IContainer;
  @Prop(Object) billOfLading!: IBillOfLading;
  @Prop(Boolean) update!: boolean;

  valid = false;
  containerLocal = {
    number: "",
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
      // REFACTOR CONTAINER
      const _driver = this.container.driver as IDriver;
      const _trailer = this.container.trailer as IContainerSemiTrailer;
      const _tractor = this.container.tractor as IContainerTractor;

      this.containerLocal.driver = _driver.username;
      this.containerLocal.trailer = _trailer.licensePlate;
      this.containerLocal.tractor = _tractor.licensePlate;
      // END
    }
    const _resD = await getDriversByForwarder({
      page: 0,
      limit: 100
    });
    if (_resD.data) {
      const _drivers = _resD.data.data;
      this.drivers = _drivers;
    }
    const _resT = await getContainerTractorsByForwarder({
      page: 0,
      limit: 100
    });
    if (_resT.data) {
      const _tractors = _resT.data.data;
      this.tractors = _tractors;
    }
    const _resSt = await getContainerSemiTrailersByForwarder({
      page: 0,
      limit: 100
    });
    if (_resSt.data) {
      const _trailers = _resSt.data.data;
      this.trailers = _trailers;
    }
  }

  async createContainer() {
    if (this.billOfLading.id) {
      const _res = await createContainer(
        this.billOfLading.id,
        this.containerLocal
      );
      if (_res.data) {
        const _container = _res.data.data;
        this.containersSync.unshift(_container);
        this.totalItemsSync += 1;
        this.dialogAddContSync = false;
      }
    }
  }

  async updateContainer() {
    const _res = await editContainer(
      this.container.id as number,
      this.containerLocal
    );
    if (_res.data) {
      const _container = _res.data.data;
      const index = this.containersSync.findIndex(x => x.id === _container.id);
      this.containersSync.splice(index, 1, _container);
    }
  }
}
</script>
