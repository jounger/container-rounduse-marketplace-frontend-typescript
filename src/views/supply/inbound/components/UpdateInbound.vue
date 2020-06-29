<template>
  <v-dialog
    v-model="dialogEditSync"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <!-- TITLE -->
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialogEditSync = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Chỉnh sửa</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <!-- START CONTENT -->
      <v-list three-line subheader>
        <v-stepper v-model="stepper" vertical>
          <v-stepper-step :complete="stepper > 1" step="1" :editable="editable">
            Thông tin hàng nhập
            <small>Thông tin chung</small>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-form ref="inboundForm" v-model="valid" lazy-validation>
              <v-select
                v-model="inboundSync.shippingLine"
                :items="shippingLinesToString"
                :rules="[required('shipping line')]"
                label="Hãng tàu"
                required
              ></v-select>
              <v-select
                v-model="inboundSync.containerType"
                :items="containerTypesToString"
                :rules="[required('container type')]"
                label="Loại container"
                required
              ></v-select>
              <v-menu
                ref="pickupTimePicker"
                v-model="pickupTimePicker"
                :close-on-content-click="false"
                :return-value.sync="inboundSync.pickupTime"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="inboundSync.pickupTime"
                    label="Thời gian lấy containers đặc từ cảng"
                    prepend-icon="event"
                    v-bind="attrs"
                    v-on="on"
                    required
                    :rules="[required('pickup time')]"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="inboundSync.pickupTime"
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="pickupTimePicker = false"
                    >Cancel</v-btn
                  >
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.pickupTimePicker.save(inboundSync.pickupTime)"
                    >OK</v-btn
                  >
                </v-date-picker>
              </v-menu>
              <v-menu
                ref="emptyTimePicker"
                v-model="emptyTimePicker"
                :close-on-content-click="false"
                :return-value.sync="inboundSync.emptyTime"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="inboundSync.emptyTime"
                    label="Thời gian lấy containers đặc từ cảng"
                    prepend-icon="event"
                    v-bind="attrs"
                    v-on="on"
                    required
                    :rules="[required('empty time')]"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="inboundSync.emptyTime"
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="emptyTimePicker = false"
                    >Cancel</v-btn
                  >
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.emptyTimePicker.save(inboundSync.emptyTime)"
                    >OK</v-btn
                  >
                </v-date-picker>
              </v-menu>
              <v-btn color="primary" @click="updateInbound()" :disabled="!valid"
                >Lưu và tiếp tục</v-btn
              >
              <!-- <v-btn text @click="dialogEditSync = false">Hủy</v-btn> -->
            </v-form>
          </v-stepper-content>

          <v-stepper-step :complete="stepper > 2" step="2" :editable="editable"
            >Thông tin B/L</v-stepper-step
          >

          <v-stepper-content step="2">
            <v-form ref="billOfLadingForm" v-model="valid" lazy-validation>
              <v-text-field
                v-model="inboundSync.billOfLading.billOfLadingNumber"
                :counter="50"
                :rules="[
                  minLength('B/L number', 5),
                  maxLength('B/L number', 50)
                ]"
                label="B/L No."
                readonly
              ></v-text-field>

              <v-select
                v-model="inboundSync.billOfLading.portOfDelivery"
                :items="portsToString"
                :rules="[required('port of loading')]"
                label="Cảng lấy container đặc"
              ></v-select>
              <v-btn
                color="primary"
                @click="updateBillOfLading()"
                :disabled="!valid"
                >Lưu và tiếp tục</v-btn
              >
              <v-btn text @click="stepper = 1">Quay lại</v-btn>
            </v-form>
          </v-stepper-content>

          <v-stepper-step :complete="stepper > 3" step="3" :editable="editable"
            >Containers hàng nhập</v-stepper-step
          >
          <!-- CREATE CONTAINER -->
          <v-stepper-content step="3">
            <v-data-table
              :headers="containerHeaders"
              :items="this.inboundSync.billOfLading.containers"
              sort-by="calories"
              class="elevation-1 my-1"
            >
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>Container List</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="dialogAddCont" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="primary"
                        dark
                        class="mb-2"
                        @click="openCreateContainer()"
                        v-bind="attrs"
                        v-on="on"
                        >Thêm mới</v-btn
                      >
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">{{ title }}</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="container.containerNumber"
                                label="Container No."
                                :readonly="readonly || !checkAdd"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="container.licensePlate"
                                label="Biển kiểm sát"
                                :readonly="readonly"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-select
                                v-model="container.driver"
                                :items="driversToString"
                                :rules="[required('driver')]"
                                label="Tài xế"
                                :readonly="readonly"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-select
                                v-model="container.trailer"
                                :items="trailers"
                                :rules="[required('trailer')]"
                                label="Loại rờ mọt"
                                :readonly="readonly"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-select
                                v-model="container.tractor"
                                :items="tractors"
                                :rules="[required('tractor')]"
                                label="Loại đầu kéo"
                                :readonly="readonly"
                              ></v-select>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="dialogAddCont = false"
                          >Trở về</v-btn
                        >
                        <v-btn
                          color="blue darken-1"
                          text
                          v-if="checkAdd"
                          @click="createContainer()"
                          >Thêm mới</v-btn
                        >
                        <v-btn
                          color="blue darken-1"
                          text
                          v-if="!checkAdd"
                          @click="updateContainer()"
                          >Cập nhập</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="openUpdateContainer(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="deleteContainer(item)">
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
            <v-btn
              color="primary"
              @click="updateBillOfLading()"
              :disabled="!checkbox"
              >Hoàn tất</v-btn
            >
            <v-btn text @click="stepper = 2">Quay lại</v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-list>
      <!-- END CONTENT -->
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { IInbound } from "@/entity/inbound";
import { IContainer } from "@/entity/container";
import FormValidate from "@/mixin/form-validate";
import {
  createContainer,
  updateContainer,
  removeContainer
} from "@/api/container";
import { IPort } from "@/entity/port";
import { IShippingLine } from "@/entity/shipping-line";
import { IContainerType } from "@/entity/container-type";
import { IDriver } from "@/entity/driver";
import { convertToDateTime } from "@/utils/tool";
import { calculateFreeTime } from "@/utils/tool";
import { updateInbound } from "@/api/inbound";
import { getPorts } from "@/api/port";
import { getContainerTypes } from "@/api/container-type";
import { getDriverByForwarder } from "@/api/driver";
import { getShippingLines } from "@/api/shipping-line";
import { PaginationResponse } from "@/api/payload";
import { updateBillOfLading } from "@/api/bill-of-lading";
import { IBillOfLading } from "@/entity/bill-of-lading";

@Component({
  mixins: [FormValidate]
})
export default class UpdateInbound extends Vue {
  @PropSync("dialogEdit", { type: Boolean }) dialogEditSync!: boolean;
  @PropSync("inbound", { type: Object }) inboundSync!: IInbound;
  @PropSync("inbounds", { type: Array }) inboundsSync!: Array<IInbound>;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  // Form validate
  checkbox = false;
  editable = true;
  stepper = 1;
  valid = true;
  title = "Thêm mới Container";
  checkAdd = true;
  // API list
  ports: Array<IPort> = [];
  shippingLines: Array<IShippingLine> = [];
  containerTypes: Array<IContainerType> = [];
  trailers: Array<string> = [];
  tractors: Array<string> = [];

  // inbound form
  pickupTimePicker = false;

  // B/L form
  emptyTimePicker = false;

  // Container form
  containerHeaders = [
    {
      text: "Container No.",
      align: "start",
      sortable: false,
      value: "containerNumber"
    },
    { text: "Biển kiểm sát", value: "licensePlate" },
    { text: "Tài xế", value: "driver" },
    { text: "Rơ mọt", value: "trailer" },
    { text: "Đầu kéo", value: "tractor" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];
  container = {
    containerNumber: "",
    driver: "",
    trailer: "",
    tractor: "",
    licensePlate: ""
  } as IContainer;
  drivers: Array<IDriver> = [];
  dialogAddCont = false;
  readonly = false;

  updateInbound() {
    // TODO: API update inbound
    this.inboundSync.emptyTime = convertToDateTime(this.inboundSync.emptyTime);
    this.inboundSync.pickupTime = convertToDateTime(
      this.inboundSync.pickupTime
    );
    this.inboundSync.billOfLading.freeTime = calculateFreeTime(
      this.inboundSync.pickupTime,
      this.inboundSync.emptyTime
    );
    console.log(this.inboundSync);
    updateInbound(this.inboundSync)
      .then(res => {
        console.log(res.data);
        const response: IInbound = res.data;
        this.inboundSync = response;
        this.messageSync =
          "Cập nhập thành công hàng nhập: " +
          this.inboundSync.billOfLading.billOfLadingNumber;
      })
      .catch(err => {
        console.log(err);
        this.messageSync = "Đã có lỗi xảy ra";
      })
      .finally(() => ((this.snackbarSync = true), (this.stepper = 2)));
  }
  openCreateContainer() {
    this.title = "Thêm mới container";
    this.checkAdd = true;
    this.readonly = false;
    this.container = {} as IContainer;
  }
  openUpdateContainer(item: IContainer) {
    // TODO
    this.title = "Cập nhập Container";
    this.checkAdd = false;
    this.readonly = false;
    this.container = item;
    this.dialogAddCont = true;
    console.log(item);
  }

  createContainer() {
    // TODO: API create Container
    if (this.inboundSync.billOfLading.id) {
      createContainer(this.inboundSync.billOfLading.id, this.container)
        .then(res => {
          console.log(res.data);
          const response: IContainer = res.data;
          console.log(response);
          this.container.id = response.id;
          this.messageSync =
            "Thêm mới thành công Container: " + this.container.containerNumber;
          this.inboundSync.billOfLading.containers.push(this.container);
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
  updateContainer() {
    updateContainer(this.container)
      .then(res => {
        const response: IContainer = res.data;
        this.container = response;
        this.messageSync =
          "Cập nhập thành công Container: " + this.container.containerNumber;
        const index = this.inboundSync.billOfLading.containers.findIndex(
          x => x.id === this.container.id
        );
        this.inboundSync.billOfLading.containers.splice(
          index,
          1,
          this.container
        );
      })
      .catch(err => {
        console.log(err);
        this.messageSync = "Đã có lỗi xảy ra";
      })
      .finally(() => (this.snackbarSync = true));
  }
  deleteContainer(item: IContainer) {
    // TODO
    if (item.id) {
      removeContainer(item.id)
        .then(res => {
          console.log(res.data);
          const response: IContainer = res.data;
          this.container = response;
          this.messageSync =
            "Xóa thành công vai trò: " + this.container.containerNumber;
          const index = this.inboundSync.billOfLading.containers.findIndex(
            x => x.id === this.container.id
          );
          this.inboundSync.billOfLading.containers.splice(index, 1);
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Error happend";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
  created() {
    getPorts({
      page: 0,
      limit: 100
    })
      .then(res => {
        const response: PaginationResponse<IPort> = res.data;
        this.ports = response.data;
      })
      .catch(err => console.log(err))
      .finally();
    getShippingLines({
      page: 0,
      limit: 100
    })
      .then(res => {
        const response: PaginationResponse<IShippingLine> = res.data;
        this.shippingLines = response.data.filter(
          x => x.roles[0] == "ROLE_SHIPPINGLINE"
        );
      })
      .catch(err => console.log(err))
      .finally();
    getContainerTypes({
      page: 0,
      limit: 100
    })
      .then(res => {
        const response: PaginationResponse<IContainerType> = res.data;
        this.containerTypes = response.data;
      })
      .catch(err => console.log(err))
      .finally();
    getDriverByForwarder(this.$auth.user().id, {
      page: 0,
      limit: 100
    })
      .then(res => {
        const response: PaginationResponse<IDriver> = res.data;
        console.log("watch", response);
        this.drivers = response.data;
      })
      .catch(err => console.log(err))
      .finally();
  }
  updateBillOfLading() {
    this.inboundSync.billOfLading.containers;
    updateBillOfLading(this.inboundSync.billOfLading)
      .then(res => {
        const response: IBillOfLading = res.data;
        this.inboundSync.billOfLading = response;
        this.messageSync =
          "Cập nhập thành công B/L: " +
          this.inboundSync.billOfLading.billOfLadingNumber;
        const index = this.inboundsSync.findIndex(
          x => x.id === this.inboundSync.id
        );
        this.inboundsSync.splice(index, 1, this.inboundSync);
      })
      .catch(err => {
        console.log(err);
        this.messageSync = "Đã có lỗi xảy ra";
      })
      .finally(() => ((this.snackbarSync = true), (this.stepper = 3)));
  }
  get driversToString() {
    return this.drivers.map(x => x.username);
  }
  get portsToString() {
    return this.ports.map(x => x.nameCode);
  }
  get shippingLinesToString() {
    return this.shippingLines.map(x => x.companyCode);
  }
  get containerTypesToString() {
    return this.containerTypes.map(x => x.name);
  }
  mounted() {
    // trailers & tractors
    this.trailers = ["2", "3"];
    this.tractors = ["2", "3"];
  }
}
</script>
