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
            <v-form ref="billOfLadingForm" v-model="valid2" lazy-validation>
              <small>*Dấu sao là trường bắt buộc</small>
              <v-layout col
                ><v-layout row
                  ><v-flex xs10>
                    <v-text-field
                      v-model="inboundLocal.billOfLading.billOfLadingNumber"
                      prepend-icon="play_for_work"
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
              <v-btn
                color="primary"
                @click="updateBillOfLading()"
                :disabled="!valid2"
                >Hoàn tất</v-btn
              >
              <v-btn text @click="stepper = 1">Quay lại</v-btn>
            </v-form>
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
import FormValidate from "@/mixin/form-validate";
import { IPort } from "@/entity/port";
import { IShippingLine } from "@/entity/shipping-line";
import { IContainerType } from "@/entity/container-type";
import { addTimeToDate } from "@/utils/tool";
import { editInbound } from "@/api/inbound";
import { getPorts } from "@/api/port";
import { getContainerTypes } from "@/api/container-type";
import { getShippingLines } from "@/api/shipping-line";
import { PaginationResponse } from "@/api/payload";
import { editBillOfLading } from "@/api/bill-of-lading";
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

  dateInit = new Date().toISOString().substr(0, 10);
  inboundLocal = {} as IInbound;
  checkbox = false;
  editable = true;
  stepper = 1;
  valid = true;
  valid2 = true;
  // API list
  ports: Array<IPort> = [];
  shippingLines: Array<IShippingLine> = [];
  containerTypes: Array<IContainerType> = [];

  // inbound form
  pickupTimePicker = false;

  // B/L form
  freeTimePicker = false;
  pickupTime = this.dateInit;
  freeTime = this.dateInit;

  updateInbound() {
    // TODO: API update inbound
    if (this.inboundLocal.id) {
      this.inboundLocal.pickupTime = addTimeToDate(this.pickupTime);
      this.inboundLocal.billOfLading.freeTime = addTimeToDate(this.freeTime);
      console.log(this.inboundLocal);
      editInbound(this.inboundLocal.id, this.inboundLocal)
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
  }
  created() {
    this.inboundLocal = Object.assign({}, this.inbound);
    this.pickupTime = this.inboundLocal.pickupTime.slice(0, 10);
    this.freeTime = this.inboundLocal.billOfLading.freeTime.slice(0, 10);
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
  updateBillOfLading() {
    if (this.inboundLocal.billOfLading.id) {
      this.inboundLocal.billOfLading.freeTime = addTimeToDate(this.freeTime);
      editBillOfLading(
        this.inboundLocal.billOfLading.id,
        this.inboundLocal.billOfLading
      )
        .then(res => {
          const response: IBillOfLading = res.data;
          this.messageSync =
            "Cập nhập thành công B/L: " + response.billOfLadingNumber;
          const copyBL = Object.assign({}, this.inboundLocal);
          const index = this.inboundsSync.findIndex(x => x.id === copyBL.id);
          this.inboundsSync.splice(index, 1, copyBL);
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
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
