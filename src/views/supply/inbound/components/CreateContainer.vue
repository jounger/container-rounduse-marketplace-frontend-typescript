<template>
  <v-dialog v-model="dialogAddContSync" max-width="500px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            update ? "Cập nhập Container" : "Thêm mới Container"
          }}</span></v-toolbar-title
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
                    :rules="[required('mã Container')]"
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
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
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
    const _drivers = await getDriversByForwarder({
      page: 0,
      limit: 100
    })
      .then(res => {
        const response: PaginationResponse<IDriver> = res.data;
        console.log("watch", response);
        return response.data;
      })
      .catch(err => {
        console.log(err);
        return null;
      });
    if (_drivers) {
      if (!this.update) {
        _drivers.forEach((x: IDriver, index: number) => {
          if (index != limit) {
            this.drivers.push(x);
          }
        });
      } else {
        _drivers.forEach((x: IDriver) => {
          if (x.username == this.containerLocal.driver) {
            this.drivers.push(x);
          }
        });
        _drivers.forEach((x: IDriver) => {
          let check = false;
          if (x.username == this.containerLocal.driver) {
            check = true;
          }
          if (check == false && this.drivers.length < this.limitDrivers) {
            console.log(this.limitDrivers);
            this.drivers.push(x);
          }
        });
      }
    }
    if (!_drivers || _drivers.length <= this.limitDrivers) {
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
    const _tractors = await getContainerTractorsByForwarder({
      page: 0,
      limit: limit + 1
    })
      .then(res => {
        const response: PaginationResponse<IContainerTractor> = res.data;
        return response.data;
      })
      .catch(err => {
        console.log(err);
        return null;
      });
    if (_tractors) {
      if (!this.update) {
        _tractors.forEach((x: IContainerTractor, index: number) => {
          if (index != limit) {
            this.tractors.push(x);
          }
        });
      } else {
        _tractors.forEach((x: IContainerTractor) => {
          if (x.licensePlate == this.containerLocal.tractor) {
            this.tractors.push(x);
          }
        });
        if (this.tractors.length < this.limitTractors) {
          _tractors.forEach((x: IContainerTractor) => {
            let check = false;
            if (x.licensePlate == this.containerLocal.tractor) {
              check = true;
            }
            if (check == false && this.tractors.length < this.limitTractors) {
              console.log(this.limitTractors);
              this.tractors.push(x);
            }
          });
        }
      }
    }
    if (!_tractors || _tractors.length <= this.limitTractors) {
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
    const _trailers = await getContainerSemiTrailersByForwarder({
      page: 0,
      limit: 100
    })
      .then(res => {
        const response: PaginationResponse<IContainerSemiTrailer> = res.data;
        return response.data;
      })
      .catch(err => {
        console.log(err);
        return null;
      });
    if (_trailers) {
      if (!this.update) {
        _trailers.forEach((x: IContainerSemiTrailer, index: number) => {
          if (index != limit) {
            this.trailers.push(x);
          }
        });
      } else {
        _trailers.forEach((x: IContainerSemiTrailer) => {
          if (x.licensePlate == this.containerLocal.trailer) {
            this.trailers.push(x);
          }
        });
        if (this.trailers.length < this.limitTrailers) {
          _trailers.forEach((x: IContainerSemiTrailer) => {
            let check = false;
            if (x.licensePlate == this.containerLocal.trailer) {
              check = true;
            }
            if (check == false && this.trailers.length < this.limitTrailers) {
              console.log(this.limitTrailers);
              this.trailers.push(x);
            }
          });
        }
      }
    }
    if (!_trailers || _trailers.length <= this.limitTrailers) {
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
      await this.getDrivers(5);
      await this.getTractors(5);
      await this.getTrailers(5);
    }
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
        this.totalItemsSync += 1;
        this.dialogAddContSync = false;
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
