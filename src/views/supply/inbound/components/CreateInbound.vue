<template>
  <v-dialog
    v-model="dialogAddSync"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <!-- TITLE -->
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialogAddSync = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Thêm mới</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <!-- START CONTENT -->
      <v-list three-line subheader>
        <v-stepper v-model="stepper" vertical>
          <v-stepper-step :complete="stepper > 1" step="1" :editable="editable">
            Tạo hàng nhập
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
              <v-btn
                color="primary"
                @click="valid ? (stepper = 2) : (stepper = 1)"
                :disabled="!valid"
                >Tiếp tục</v-btn
              >
              <!-- <v-btn text @click="dialogAddSync = false">Hủy</v-btn> -->
            </v-form>
          </v-stepper-content>

          <v-stepper-step :complete="stepper > 2" step="2" :editable="editable"
            >Điền B/L</v-stepper-step
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
              <v-btn color="primary" @click="stepper = 3" :disabled="!valid"
                >Tiếp tục</v-btn
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
              :items="containers"
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
            <v-btn color="primary" @click="stepper = 4" :disabled="!valid"
              >Tiếp tục</v-btn
            >
            <v-btn text @click="stepper = 2">Quay lại</v-btn>
          </v-stepper-content>

          <v-stepper-step step="4">Hoàn thành</v-stepper-step>
          <v-stepper-content step="4">
            <v-form ref="finishForm" v-model="valid" lazy-validation>
              <v-checkbox
                v-model="checkbox"
                :rules="[required('agree term')]"
                label="Bạn đồng ý rằng tất cả các thông tin đưa lên đều là chính xác."
              ></v-checkbox>
              <v-btn
                color="primary"
                @click="createInbound()"
                :disabled="!checkbox"
                >Hoàn tất</v-btn
              >
              <v-btn text @click="stepper = 3">Quay lại</v-btn>
            </v-form>
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
import { IPort } from "@/entity/port";
import { IShippingLine } from "@/entity/shipping-line";
import { IContainerType } from "@/entity/container-type";
import { IDriver } from "@/entity/driver";
import { getPorts } from "@/api/port";
import { getShippingLines } from "@/api/shipping-line";
import { getDriversByForwarder } from "@/api/driver";
import { getContainerTypes } from "@/api/container-type";
import { PaginationResponse } from "@/api/payload";
import { addTimeToDate } from "@/utils/tool";
import { createInbound } from "@/api/inbound";

@Component({
  mixins: [FormValidate]
})
export default class CreateInbound extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("inbounds", { type: Array }) inboundsSync!: Array<IInbound>;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  dateInit = new Date().toISOString().substr(0, 10);
  inboundLocal = {
    shippingLine: "",
    containerType: "",
    returnStation: "",
    status: "",
    emptyTime: "",
    pickupTime: this.dateInit,
    billOfLading: {
      billOfLadingNumber: "",
      containers: [] as Array<IContainer>,
      portOfDelivery: "",
      freeTime: this.dateInit
    }
  } as IInbound;
  // Form validate
  checkbox = false;
  editable = false;
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

  // inboundLocal form
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
    { text: "Biển kiểm sát", value: "licensePlate" },
    { text: "Tài xế", value: "driver" },
    { text: "Rơ mọt", value: "trailer" },
    { text: "Đầu kéo", value: "tractor" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];
  containers = [] as Array<IContainer>;
  container = {} as IContainer;
  containerLocal = {} as IContainer;
  drivers: Array<IDriver> = [];
  dialogAddCont = false;
  dialogDelCont = false;
  createContainer() {
    // TODO: API create Container
    if (this.containers.length != 0) {
      if (
        this.containers.findIndex(
          x =>
            x.containerNumber == this.containerLocal.containerNumber ||
            x.licensePlate == this.containerLocal.licensePlate
        ) != -1
      ) {
        this.messageSync = "Container đã tồn tại";
        this.snackbarSync = true;
      } else if (
        this.containers.findIndex(
          x => x.driver == this.containerLocal.driver
        ) != -1
      ) {
        this.messageSync = "Lái xe đã thuộc Container khác";
        this.snackbarSync = true;
      } else {
        this.containers.unshift(this.containerLocal);
        this.messageSync =
          "Thêm mới thành công Container: " +
          this.containerLocal.containerNumber;
        this.snackbarSync = true;
      }
    } else {
      this.containers.unshift(this.containerLocal);
      this.messageSync =
        "Thêm mới thành công Container: " + this.containerLocal.containerNumber;
      this.snackbarSync = true;
    }
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
  updateContainer() {
    if (
      (this.containers.findIndex(
        x => x.containerNumber == this.containerLocal.containerNumber
      ) != -1 &&
        this.containerLocal.containerNumber !=
          this.container.containerNumber) ||
      (this.containers.findIndex(
        x => x.licensePlate == this.containerLocal.licensePlate
      ) != -1 &&
        this.containerLocal.licensePlate != this.container.licensePlate)
    ) {
      this.messageSync = "Container đã tồn tại";
      this.snackbarSync = true;
    } else if (
      this.containers.findIndex(x => x.driver == this.containerLocal.driver) !=
        -1 &&
      this.containerLocal.driver != this.container.driver
    ) {
      this.messageSync = "Lái xe đã thuộc Container khác";
      this.snackbarSync = true;
    } else {
      const copyContainer = Object.assign({}, this.containerLocal);
      this.container = Object.assign({}, this.containerLocal);
      const index = this.containers.findIndex(
        x => x.containerNumber === copyContainer.containerNumber
      );
      this.containers.splice(index, 1, copyContainer);
      this.messageSync =
        "Cập nhập thành công Container: " + copyContainer.containerNumber;
      this.snackbarSync = true;
    }
  }
  removeContainer() {
    // TODO
    const index = this.containers.findIndex(
      x => x.containerNumber === this.container.containerNumber
    );
    this.containers.splice(index, 1);
    console.log(this.containers);
    this.messageSync =
      "Xóa thành công Container: " + this.container.containerNumber;
    this.snackbarSync = true;
    this.dialogDelCont = false;
  }

  // Inbound
  createInbound() {
    // TODO: API create inbound
    this.inboundLocal.pickupTime = addTimeToDate(
      this.inboundLocal.pickupTime
    );
    this.inboundLocal.billOfLading.freeTime = addTimeToDate(
      this.inboundLocal.billOfLading.freeTime
    );
    this.inboundLocal.billOfLading.containers = this.containers;
    createInbound(this.$auth.user().id, this.inboundLocal)
      .then(res => {
        console.log(res.data);
        const response: IInbound = res.data;
        this.inboundLocal = response;
        this.messageSync =
          "Thêm mới thành công hàng nhập: " +
          this.inboundLocal.billOfLading.billOfLadingNumber;
        this.inboundsSync.unshift(this.inboundLocal);
      })
      .catch(err => {
        console.log(err);
        this.messageSync = "Đã có lỗi xảy ra";
      })
      .finally(() => (this.snackbarSync = true));
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
