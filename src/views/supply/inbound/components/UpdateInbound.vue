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
              <small>*Dấu sao là trường bắt buộc</small>
              <v-layout col
                ><v-layout row
                  ><v-flex xs10>
                    <v-select
                      v-model="inboundLocal.shippingLine"
                      :items="shippingLinesToString"
                      :rules="[required('shipping line')]"
                      label="Hãng tàu*"
                    ></v-select> </v-flex></v-layout
                ><v-layout row
                  ><v-flex xs10>
                    <v-select
                      v-model="inboundLocal.containerType"
                      :items="containerTypesToString"
                      :rules="[required('container type')]"
                      label="Loại container*"
                    ></v-select> </v-flex></v-layout
              ></v-layout>
              <v-layout col
                ><v-layout row
                  ><v-flex xs10>
                    <v-text-field
                      v-model="inboundLocal.returnStation"
                      :rules="[required('return station')]"
                      label="Nơi trả hàng*"
                    ></v-text-field> </v-flex></v-layout
                ><v-layout row
                  ><v-flex xs10>
                    <v-menu
                      ref="pickupTimePicker"
                      v-model="pickupTimePicker"
                      :close-on-content-click="false"
                      :return-value.sync="inboundLocal.pickupTime"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="inboundLocal.pickupTime"
                          label="Thời gian lấy containers đặc từ cảng*"
                          prepend-icon="event"
                          v-bind="attrs"
                          v-on="on"
                          :rules="[required('pickup time')]"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="inboundLocal.pickupTime"
                        no-title
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="pickupTimePicker = false"
                          >Cancel</v-btn
                        >
                        <v-btn
                          text
                          color="primary"
                          @click="
                            $refs.pickupTimePicker.save(inboundLocal.pickupTime)
                          "
                          >OK</v-btn
                        >
                      </v-date-picker>
                    </v-menu>
                  </v-flex></v-layout
                ></v-layout
              >
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
              <small>*Dấu sao là trường bắt buộc</small>
              <v-layout col
                ><v-layout row
                  ><v-flex xs10>
                    <v-text-field
                      v-model="inboundLocal.billOfLading.billOfLadingNumber"
                      :rules="[required('B/L No.')]"
                      label="B/L No.*"
                    ></v-text-field> </v-flex></v-layout
                ><v-layout row
                  ><v-flex xs10>
                    <v-select
                      v-model="inboundLocal.billOfLading.portOfDelivery"
                      :items="portsToString"
                      :rules="[required('port of loading')]"
                      label="Cảng lấy container đặc*"
                    ></v-select> </v-flex></v-layout
              ></v-layout>
              <v-layout col
                ><v-layout row
                  ><v-flex xs5>
                    <v-menu
                      ref="freeTimePicker"
                      v-model="freeTimePicker"
                      :close-on-content-click="false"
                      :return-value.sync="inboundLocal.billOfLading.freeTime"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="inboundLocal.billOfLading.freeTime"
                          label="Thời gian được thuê cont"
                          prepend-icon="event"
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="inboundLocal.billOfLading.freeTime"
                        no-title
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="freeTimePicker = false"
                          >Cancel</v-btn
                        >
                        <v-btn
                          text
                          color="primary"
                          @click="
                            $refs.freeTimePicker.save(
                              inboundLocal.billOfLading.freeTime
                            )
                          "
                          >OK</v-btn
                        >
                      </v-date-picker>
                    </v-menu>
                  </v-flex></v-layout
                ></v-layout
              >
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
              :items="this.inboundLocal.billOfLading.containers"
              sort-by="calories"
              class="elevation-1 my-1"
            >
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>Danh sách Container</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-row justify="center">
                    <v-dialog
                      v-model="dialogDelCont"
                      persistent
                      max-width="600px"
                    >
                      <v-card>
                        <v-toolbar color="primary" light flat>
                          <v-toolbar-title
                            ><span class="headline" style="color:white;"
                              >Xóa Container</span
                            >
                            <v-btn
                              icon
                              dark
                              @click="dialogDelCont = false"
                              style="margin-left:369px;"
                            >
                              <v-icon>mdi-close</v-icon>
                            </v-btn></v-toolbar-title
                          >
                        </v-toolbar>

                        <v-card-text>
                          <v-form>
                            <v-container>
                              <span style="color: black; font-size:22px;"
                                >Bạn có chắc chắn muốn xóa Container này?</span
                              >
                              <div class="line"></div>
                              <v-list>
                                <v-list-item>
                                  <v-list-item-content>
                                    <v-list-item-title>{{
                                      container.containerNumber
                                    }}</v-list-item-title>
                                  </v-list-item-content>
                                </v-list-item>
                              </v-list>
                            </v-container>
                            <v-btn
                              type="submit"
                              class="d-none"
                              id="submitForm"
                            ></v-btn>
                          </v-form>
                        </v-card-text>
                        <v-card-actions style="margin-left: 205px;">
                          <v-btn @click="dialogDelCont = false">Hủy</v-btn>
                          <v-btn @click="removeContainer()" color="red"
                            >Xóa</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-row>
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
                      <v-toolbar color="primary" light flat>
                        <v-toolbar-title
                          ><span class="headline" style="color:white;">{{
                            title
                          }}</span>
                          <v-btn
                            icon
                            dark
                            @click="dialogAddCont = false"
                            style="margin-left:205px;"
                          >
                            <v-icon>mdi-close</v-icon>
                          </v-btn></v-toolbar-title
                        >
                      </v-toolbar>

                      <v-card-text>
                        <v-container>
                          <small>*Dấu sao là trường bắt buộc</small>
                          <v-layout col>
                            <v-layout row>
                              <v-flex xs8>
                                <v-text-field
                                  v-model="containerLocal.containerNumber"
                                  label="Container No."
                                  :readonly="!checkAdd"
                                ></v-text-field>
                              </v-flex>
                            </v-layout>
                            <v-layout row>
                              <v-flex xs8>
                                <v-text-field
                                  v-model="containerLocal.licensePlate"
                                  label="Biển kiểm sát"
                                ></v-text-field>
                              </v-flex>
                            </v-layout>
                          </v-layout>
                          <v-layout col>
                            <v-layout row>
                              <v-flex xs8>
                                <v-select
                                  v-model="containerLocal.tractor"
                                  :items="tractors"
                                  :rules="[required('tractor')]"
                                  label="Loại đầu kéo"
                                ></v-select>
                              </v-flex>
                            </v-layout>
                            <v-layout row>
                              <v-flex xs8>
                                <v-select
                                  v-model="containerLocal.trailer"
                                  :items="trailers"
                                  :rules="[required('trailer')]"
                                  label="Loại rờ mọt"
                                ></v-select>
                              </v-flex>
                            </v-layout>
                          </v-layout>
                          <v-layout col>
                            <v-layout row>
                              <v-flex xs5>
                                <v-select
                                  v-model="containerLocal.driver"
                                  :items="driversToString"
                                  :rules="[required('driver')]"
                                  label="Tài xế"
                                ></v-select>
                              </v-flex>
                            </v-layout>
                          </v-layout>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="dialogAddCont = false">Trở về</v-btn>
                        <v-btn
                          color="primary"
                          v-if="checkAdd"
                          :disabled="!valid"
                          @click="createContainer()"
                          >Thêm mới</v-btn
                        >
                        <v-btn
                          color="primary"
                          v-if="!checkAdd"
                          :disabled="!valid"
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
                <v-icon small @click="openRemoveContainer(item)">
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
            <v-btn
              color="primary"
              @click="updateBillOfLading()"
              :disabled="!valid"
              >Hoàn tất</v-btn
            >
          </v-stepper-content>
        </v-stepper>
      </v-list>
      <!-- END CONTENT -->
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
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
import { addTimeToDate } from "@/utils/tool";
import { updateInbound } from "@/api/inbound";
import { getPorts } from "@/api/port";
import { getContainerTypes } from "@/api/container-type";
import { getDriversByForwarder } from "@/api/driver";
import { getShippingLines } from "@/api/shipping-line";
import { PaginationResponse } from "@/api/payload";
import { updateBillOfLading } from "@/api/bill-of-lading";
import { IBillOfLading } from "@/entity/bill-of-lading";

@Component({
  mixins: [FormValidate]
})
export default class UpdateInbound extends Vue {
  @PropSync("dialogEdit", { type: Boolean }) dialogEditSync!: boolean;
  @Prop(Object) inbound!: IInbound;
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
  dialogDelCont = false;
  // API list
  ports: Array<IPort> = [];
  shippingLines: Array<IShippingLine> = [];
  containerTypes: Array<IContainerType> = [];
  trailers: Array<string> = [];
  tractors: Array<string> = [];

  // inbound form
  pickupTimePicker = false;

  // B/L form
  freeTimePicker = false;
  // Container form
  containerHeaders = [
    {
      text: "Container No.",
      align: "start",
      sortable: false,
      value: "containerNumber"
    },
    { text: "Trạng thái", value: "status" },
    { text: "Biển kiểm sát", value: "licensePlate" },
    { text: "Tài xế", value: "driver" },
    { text: "Rơ mọt", value: "trailer" },
    { text: "Đầu kéo", value: "tractor" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];
  container = {} as IContainer;
  containerLocal = {} as IContainer;
  drivers: Array<IDriver> = [];
  dialogAddCont = false;
  inboundLocal = {} as IInbound;

  updateInbound() {
    // TODO: API update inbound

    this.inboundLocal.pickupTime = addTimeToDate(
      this.inboundLocal.pickupTime
    );
    this.inboundLocal.billOfLading.freeTime = addTimeToDate(
      this.inboundLocal.billOfLading.freeTime
    );
    console.log(this.inboundLocal);
    updateInbound(this.inboundLocal)
      .then(res => {
        console.log(res.data);
        const response: IInbound = res.data;
        this.messageSync =
          "Cập nhập thành công hàng nhập: " +
          response.billOfLading.billOfLadingNumber;
        const index = this.inboundsSync.findIndex(x => x.id == response.id);
        this.inboundsSync.splice(index, 1, response);
        this.inboundLocal.billOfLading.freeTime = this.inboundLocal.billOfLading.freeTime.slice(
          0,
          10
        );
        this.stepper = 2;
      })
      .catch(err => {
        console.log(err);
        this.messageSync = "Đã có lỗi xảy ra";
      })
      .finally(() => (this.snackbarSync = true));
  }
  openCreateContainer() {
    this.title = "Thêm mới container";
    this.checkAdd = true;
    this.containerLocal = {} as IContainer;
  }
  openUpdateContainer(item: IContainer) {
    // TODO
    this.title = "Cập nhập Container";
    this.checkAdd = false;
    this.containerLocal = Object.assign({}, item);
    this.container = Object.assign({}, this.containerLocal);
    this.dialogAddCont = true;
  }
  openRemoveContainer(item: IContainer) {
    this.container = item;
    this.dialogDelCont = true;
  }
  createContainer() {
    // TODO: API create Container
    if (this.inboundLocal.billOfLading.id) {
      createContainer(this.inboundLocal.billOfLading.id, this.containerLocal)
        .then(res => {
          console.log(res.data);
          const response: IContainer = res.data;
          this.containerLocal = response;
          this.messageSync =
            "Thêm mới thành công Container: " +
            this.containerLocal.containerNumber;
          this.inboundLocal.billOfLading.containers.unshift(
            this.containerLocal
          );
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
  updateContainer() {
    updateContainer(this.containerLocal)
      .then(res => {
        const response: IContainer = res.data;
        this.messageSync =
          "Cập nhập thành công Container: " + response.containerNumber;
        const index = this.inboundLocal.billOfLading.containers.findIndex(
          x => x.id === response.id
        );
        this.inboundLocal.billOfLading.containers.splice(index, 1, response);
      })
      .catch(err => {
        console.log(err);
        this.messageSync = "Đã có lỗi xảy ra";
      })
      .finally(() => (this.snackbarSync = true));
  }
  removeContainer() {
    // TODO
    if (this.container.id) {
      removeContainer(this.container.id)
        .then(res => {
          console.log(res.data);
          this.messageSync =
            "Xóa thành công Container: " + this.container.containerNumber;
          const index = this.inboundLocal.billOfLading.containers.findIndex(
            x => x.id === this.container.id
          );
          this.inboundLocal.billOfLading.containers.splice(index, 1);
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Error happend";
        })
        .finally(
          () => ((this.snackbarSync = true), (this.dialogDelCont = false))
        );
    }
  }
  created() {
    this.inboundLocal = Object.assign({}, this.inbound);
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
    getDriversByForwarder(this.$auth.user().id, {
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
    this.inboundLocal.billOfLading.freeTime = addTimeToDate(
      this.inboundLocal.billOfLading.freeTime
    );
    updateBillOfLading(this.inboundLocal.billOfLading)
      .then(res => {
        const response: IBillOfLading = res.data;
        this.messageSync =
          "Cập nhập thành công B/L: " + response.billOfLadingNumber;
        const copyBL = Object.assign({}, this.inboundLocal);
        const index = this.inboundsSync.findIndex(x => x.id === copyBL.id);
        this.inboundsSync.splice(index, 1, copyBL);
        this.stepper = 3;
      })
      .catch(err => {
        console.log(err);
        this.messageSync = "Đã có lỗi xảy ra";
      })
      .finally(() => (this.snackbarSync = true));
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
