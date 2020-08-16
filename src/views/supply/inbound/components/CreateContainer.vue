<template>
  <v-dialog v-model="dialogAddContSync" max-width="500px">
    <v-card>
      <v-card-title class="headline">{{
        update ? "Cập nhật Container" : "Thêm mới Container"
      }}</v-card-title>

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
                    :items="driversToString"
                    :rules="[required('lái xe')]"
                    :loading="loadingDrivers"
                    no-data-text="Danh sách lái xe rỗng."
                    label="Tài xế*"
                    ><v-btn
                      text
                      small
                      color="primary"
                      v-if="seeMoreDrivers"
                      slot="append-item"
                      style="margin-left:20px;"
                      @click="loadMoreDrivers()"
                      >Xem thêm</v-btn
                    ></v-select
                  >
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
                    :rules="[required('đầu kéo')]"
                    :loading="loadingTractors"
                    no-data-text="Danh sách đầu kéo rỗng."
                    label="Chọn đầu kéo*"
                    ><v-btn
                      text
                      small
                      color="primary"
                      v-if="seeMoreTractors"
                      slot="append-item"
                      style="margin-left:20px;"
                      @click="loadMoreTractors()"
                      >Xem thêm</v-btn
                    ></v-select
                  >
                </v-flex>
              </v-layout>
              <v-layout col>
                <v-flex xs10>
                  <v-select
                    v-model="containerLocal.trailer"
                    prepend-icon="format_strikethrough"
                    :items="trailersToString"
                    :rules="[required('rơ moóc')]"
                    :loading="loadingTrailers"
                    no-data-text="Danh sách rơ moóc rỗng."
                    label="Chọn rơ moóc*"
                    ><v-btn
                      text
                      small
                      color="primary"
                      v-if="seeMoreTrailers"
                      slot="append-item"
                      style="margin-left:20px;"
                      @click="loadMoreTrailers()"
                      >Xem thêm</v-btn
                    ></v-select
                  >
                </v-flex>
              </v-layout>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-space-between">
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
  loadingDrivers = false;
  seeMoreDrivers = true;
  limitDrivers = 5;
  loadingTractors = false;
  seeMoreTractors = true;
  limitTractors = 5;
  loadingTrailers = false;
  seeMoreTrailers = true;
  limitTrailers = 5;

  async getDrivers(limit: number) {
    this.loadingDrivers = true;
    this.drivers = [] as Array<IDriver>;
    const _res = await getDriversByForwarder({
      page: 0,
      limit: 100
    });
    const _drivers = _res.data;
    if (_drivers.data) {
      if (!this.update) {
        _drivers.data.forEach((x: IDriver, index: number) => {
          if (index != limit) {
            this.drivers.push(x);
          }
        });
      } else {
        _drivers.data.forEach((x: IDriver) => {
          if (x.username == this.containerLocal.driver) {
            this.drivers.push(x);
          }
        });
        _drivers.data.forEach((x: IDriver) => {
          let check = false;
          if (x.username == this.containerLocal.driver) {
            check = true;
          }
          if (check == false && this.drivers.length < this.limitDrivers) {
            this.drivers.push(x);
          }
        });
      }
    }
    if (!_res.data || _drivers.data.length <= this.limitDrivers) {
      this.seeMoreDrivers = false;
    }
    this.loadingDrivers = false;
  }

  async loadMoreDrivers() {
    this.limitDrivers += 5;
    await this.getDrivers(this.limitDrivers);
  }

  async getTractors(limit: number) {
    this.loadingTractors = true;
    this.tractors = [] as Array<IContainerTractor>;
    const _res = await getContainerTractorsByForwarder({
      page: 0,
      limit: limit + 1
    });
    const _tractors = _res.data;
    if (_tractors.data) {
      if (!this.update) {
        _tractors.data.forEach((x: IContainerTractor, index: number) => {
          if (index != limit) {
            this.tractors.push(x);
          }
        });
      } else {
        _tractors.data.forEach((x: IContainerTractor) => {
          if (x.licensePlate == this.containerLocal.tractor) {
            this.tractors.push(x);
          }
        });
        if (this.tractors.length < this.limitTractors) {
          _tractors.data.forEach((x: IContainerTractor) => {
            let check = false;
            if (x.licensePlate == this.containerLocal.tractor) {
              check = true;
            }
            if (check == false && this.tractors.length < this.limitTractors) {
              this.tractors.push(x);
            }
          });
        }
      }
    }
    if (!_tractors.data || _tractors.data.length <= this.limitTractors) {
      this.seeMoreTractors = false;
    }
    this.loadingTractors = false;
  }

  async loadMoreTractors() {
    this.limitTractors += 5;
    await this.getTractors(this.limitTractors);
  }

  async getTrailers(limit: number) {
    this.loadingTrailers = true;
    this.trailers = [] as Array<IContainerSemiTrailer>;
    const _res = await getContainerSemiTrailersByForwarder({
      page: 0,
      limit: 100
    });
    const _trailers = _res.data;
    if (_trailers.data) {
      if (!this.update) {
        _trailers.data.forEach((x: IContainerSemiTrailer, index: number) => {
          if (index != limit) {
            this.trailers.push(x);
          }
        });
      } else {
        _trailers.data.forEach((x: IContainerSemiTrailer) => {
          if (x.licensePlate == this.containerLocal.trailer) {
            this.trailers.push(x);
          }
        });
        if (this.trailers.length < this.limitTrailers) {
          _trailers.data.forEach((x: IContainerSemiTrailer) => {
            let check = false;
            if (x.licensePlate == this.containerLocal.trailer) {
              check = true;
            }
            if (check == false && this.trailers.length < this.limitTrailers) {
              this.trailers.push(x);
            }
          });
        }
      }
    }
    if (!_trailers.data || _trailers.data.length <= this.limitTrailers) {
      this.seeMoreTrailers = false;
    }
    this.loadingTrailers = false;
  }

  async loadMoreTrailers() {
    this.limitTrailers += 5;
    await this.getTrailers(this.limitTrailers);
  }

  async created() {
    if (this.update) {
      this.containerLocal = Object.assign({}, this.container);
      if (typeof this.containerLocal.trailer != "string") {
        this.containerLocal.trailer = this.containerLocal.trailer.licensePlate;
      }
      if (typeof this.containerLocal.tractor != "string") {
        this.containerLocal.tractor = this.containerLocal.tractor.licensePlate;
      }
      await this.getDrivers(100);
      await this.getTractors(100);
      await this.getTrailers(100);
    } else {
      await this.getDrivers(50);
      await this.getTractors(50);
      await this.getTrailers(50);
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
      this.containerLocal.id as number,
      this.containerLocal
    );
    if (_res.data) {
      const _container = _res.data.data;
      const index = this.containersSync.findIndex(x => x.id === _container.id);
      this.containersSync.splice(index, 1, _container);
    }
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
