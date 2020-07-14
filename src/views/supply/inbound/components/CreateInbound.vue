<template>
  <v-dialog
    v-model="dialogAddSync"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-row justify="center">
      <DeleteContainer
        v-if="dialogDelCont"
        :message.sync="messageSync"
        :snackbar.sync="snackbarSync"
        :container="container"
        :containers.sync="containers"
        :dialogDelCont.sync="dialogDelCont"
      />
    </v-row>
    <v-row justify="center">
      <CreateContainer
        v-if="dialogAddCont"
        :message.sync="messageSync"
        :snackbar.sync="snackbarSync"
        :container="container"
        :containers.sync="containers"
        :dialogAddCont.sync="dialogAddCont"
        :billOfLading="inboundLocal.billOfLading"
        :update="update"
      />
    </v-row>
    <v-card tile>
      <!-- TITLE -->
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialogAddSync = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Thêm mới Hàng nhập</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <!-- START CONTENT -->
      <v-list three-line subheader>
        <v-stepper v-model="stepper" vertical>
          <v-stepper-step :complete="stepper > 1" step="1" :editable="editable">
            Thêm mới Hàng nhập
            <small>Thông tin chung</small>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-form ref="inboundForm" v-model="valid" validation>
              <small>*Dấu sao là trường bắt buộc</small>
              <v-layout col
                ><v-layout row
                  ><v-flex xs10>
                    <v-select
                      v-model="inboundLocal.shippingLine"
                      prepend-icon="directions_boat"
                      :items="shippingLinesToString"
                      :rules="[required('shipping line')]"
                      label="Hãng tàu*"
                    ></v-select> </v-flex></v-layout
                ><v-layout row
                  ><v-flex xs10>
                    <v-select
                      v-model="inboundLocal.containerType"
                      prepend-icon="directions_bus"
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
                      prepend-icon="location_on"
                      type="text"
                      :rules="[required('return station')]"
                      label="Nơi trả hàng*"
                    ></v-text-field> </v-flex></v-layout
                ><v-layout row
                  ><v-flex xs10>
                    <v-menu
                      ref="pickupTimePicker"
                      v-model="pickupTimePicker"
                      :close-on-content-click="false"
                      :return-value.sync="pickupTime"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="pickupTime"
                          label="Thời gian lấy containers đặc từ cảng*"
                          prepend-icon="flight_land"
                          v-bind="attrs"
                          v-on="on"
                          :rules="[required('pickup time')]"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="pickupTime" no-title scrollable>
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
                          @click="$refs.pickupTimePicker.save(pickupTime)"
                          >OK</v-btn
                        >
                      </v-date-picker>
                    </v-menu>
                  </v-flex></v-layout
                ></v-layout
              >
              <v-btn color="primary" @click="stepper = 2" :disabled="!valid"
                >Tiếp tục</v-btn
              >
              <!-- <v-btn text @click="dialogAddSync = false">Hủy</v-btn> -->
            </v-form>
          </v-stepper-content>

          <v-stepper-step :complete="stepper > 2" step="2" :editable="editable"
            >Điền B/L</v-stepper-step
          >

          <v-stepper-content step="2">
            <v-form ref="billOfLadingForm" v-model="valid2" validation>
              <small>*Dấu sao là trường bắt buộc</small>
              <v-layout col
                ><v-layout row
                  ><v-flex xs10>
                    <v-text-field
                      v-model="inboundLocal.billOfLading.billOfLadingNumber"
                      prepend-icon="play_for_work"
                      type="text"
                      :rules="[required('B/L No.')]"
                      label="B/L No.*"
                    ></v-text-field> </v-flex></v-layout
                ><v-layout row
                  ><v-flex xs10>
                    <v-select
                      v-model="inboundLocal.billOfLading.portOfDelivery"
                      prepend-icon="flag"
                      :items="portsToString"
                      :rules="[required('port of loading')]"
                      label="Cảng lấy container đặc*"
                    ></v-select> </v-flex></v-layout
              ></v-layout>
              <v-layout col
                ><v-layout row
                  ><v-flex xs10>
                    <v-menu
                      ref="freeTimePicker"
                      v-model="freeTimePicker"
                      :close-on-content-click="false"
                      :return-value.sync="freeTime"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="freeTime"
                          label="Thời gian được thuê cont"
                          prepend-icon="event_available"
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="freeTime" no-title scrollable>
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
                          @click="$refs.freeTimePicker.save(freeTime)"
                          >OK</v-btn
                        >
                      </v-date-picker>
                    </v-menu>
                  </v-flex></v-layout
                >
                <v-layout row
                  ><v-flex xs10>
                    <v-text-field
                      v-model="inboundLocal.billOfLading.unit"
                      prepend-icon="local_shipping"
                      type="number"
                      :rules="[required('unit')]"
                      label="Số lượng Cont*"
                    ></v-text-field> </v-flex
                ></v-layout>
              </v-layout>
              <v-btn color="primary" @click="stepper = 3" :disabled="!valid2"
                >Tiếp tục</v-btn
              >
              <v-btn text @click="stepper = 1">Quay lại</v-btn>
            </v-form>
          </v-stepper-content>
          <v-stepper-step :complete="stepper > 3" step="3" :editable="editable"
            >Tạo hàng nhập</v-stepper-step
          >
          <v-stepper-content step="3">
            <v-form ref="finishForm" v-model="valid" validation>
              <v-checkbox
                v-model="checkbox"
                :rules="[required('agree term')]"
                label="Bạn đồng ý rằng tất cả các thông tin đưa lên đều là chính xác."
              ></v-checkbox>
              <v-btn
                color="primary"
                @click="createInbound()"
                :disabled="!checkbox"
                >Tạo hàng nhập</v-btn
              >
              <v-btn text @click="stepper = 3">Quay lại</v-btn>
            </v-form>
          </v-stepper-content>
          <v-stepper-step :complete="stepper > 4" step="4" :editable="editable"
            >Thêm mới Containers hàng nhập</v-stepper-step
          >
          <!-- CREATE CONTAINER -->
          <v-stepper-content step="4">
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
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    @click="openCreateContainer()"
                    >Thêm mới</v-btn
                  >
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
              <template v-slot:item.trailer="{ item }">
                {{ item.trailer.licensePlate }}
              </template>
              <template v-slot:item.tractor="{ item }">
                {{ item.tractor.licensePlate }}
              </template>
            </v-data-table>
            <v-btn
              color="primary"
              @click="dialogAddSync = false"
              :disabled="containers.length == 0"
              >Hoàn tất</v-btn
            >
            <v-btn text @click="stepper = 3">Quay lại</v-btn>
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
import { getPorts } from "@/api/port";
import { getShippingLines } from "@/api/shipping-line";
import { getContainerTypes } from "@/api/container-type";
import { PaginationResponse } from "@/api/payload";
import { addTimeToDate, addMinutesToDate } from "@/utils/tool";
import { createInbound } from "@/api/inbound";
import DeleteContainer from "./DeleteContainer.vue";
import CreateContainer from "./CreateContainer.vue";

@Component({
  mixins: [FormValidate],
  components: {
    DeleteContainer,
    CreateContainer
  }
})
export default class CreateInbound extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("inbounds", { type: Array }) inboundsSync!: Array<IInbound>;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
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
      freeTime: this.dateInit,
      unit: 0
    }
  } as IInbound;
  // Form validate
  checkbox = false;
  editable = false;
  stepper = 1;
  valid = true;
  valid2 = true;
  update = true;
  // API list
  ports: Array<IPort> = [];
  shippingLines: Array<IShippingLine> = [];
  containerTypes: Array<IContainerType> = [];
  pickupTime = this.dateInit;
  freeTime = this.dateInit;
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
  dialogAddCont = false;
  dialogDelCont = false;
  openCreateContainer() {
    this.update = false;
    this.container = {} as IContainer;
    this.dialogAddCont = true;
  }
  openUpdateContainer(item: IContainer) {
    // TODO
    this.update = true;
    this.container = item;
    this.dialogAddCont = true;
  }
  openRemoveContainer(item: IContainer) {
    this.container = item;
    this.dialogDelCont = true;
  }

  // Inbound
  createInbound() {
    // TODO: API create inbound
    this.inboundLocal.pickupTime = addTimeToDate(this.pickupTime);
    this.inboundLocal.billOfLading.freeTime = addTimeToDate(this.freeTime);
    this.inboundLocal.billOfLading.containers = this.containers;

    /* TODO: Calculate Empty Time:
     * emptyTime = (duration: portOfDelivery -> returnStation) + pickupTime (+ bias)
     */
    this.inboundLocal.emptyTime = addMinutesToDate(
      this.inboundLocal.pickupTime,
      5
    );
    createInbound(this.inboundLocal)
      .then(res => {
        console.log(res.data);
        const response: IInbound = res.data;
        this.inboundLocal = response;
        this.messageSync =
          "Thêm mới thành công hàng nhập: " +
          this.inboundLocal.billOfLading.billOfLadingNumber;
        this.inboundsSync.unshift(response);
        this.totalItemsSync += 1;
        this.stepper = 4;
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
}
</script>
