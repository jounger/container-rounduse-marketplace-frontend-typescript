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
            Thông tin hàng xuất
            <small>Thông tin chung</small>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-form ref="outboundForm" v-model="valid" lazy-validation>
              <small>*Dấu sao là trường bắt buộc</small>
              <v-layout col
                ><v-layout row
                  ><v-flex xs10>
                    <v-select
                      v-model="outboundLocal.shippingLine"
                      prepend-icon="directions_boat"
                      :items="shippingLinesToString"
                      :rules="[required('shipping line')]"
                      label="Hãng tàu*"
                    ></v-select> </v-flex></v-layout
                ><v-layout row
                  ><v-flex xs10>
                    <v-select
                      v-model="outboundLocal.containerType"
                      prepend-icon="directions_bus"
                      :items="containerTypesToString"
                      :rules="[required('container type')]"
                      label="Loại container*"
                    ></v-select> </v-flex></v-layout
              ></v-layout>
              <v-layout col
                ><v-layout row
                  ><v-flex xs10>
                    <v-menu
                      ref="packingTimePicker"
                      v-model="packingTimePicker"
                      :close-on-content-click="false"
                      :return-value.sync="packingTime"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="packingTime"
                          label="Thời gian đóng hàng"
                          prepend-icon="event"
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="packingTime" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="packingTimePicker = false"
                          >Cancel</v-btn
                        >
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.packingTimePicker.save(packingTime)"
                          >OK</v-btn
                        >
                      </v-date-picker>
                    </v-menu>
                  </v-flex></v-layout
                ><v-layout row
                  ><v-flex xs10>
                    <v-text-field
                      v-model="outboundLocal.packingStation"
                      prepend-icon="location_on"
                      type="text"
                      label="Nơi đóng hàng"
                    ></v-text-field> </v-flex></v-layout
              ></v-layout>
              <v-layout col
                ><v-layout row
                  ><v-flex xs10>
                    <v-text-field
                      v-model="outboundLocal.grossWeight"
                      prepend-icon="fitness_center"
                      type="number"
                      label="Khối lượng hàng"
                    ></v-text-field> </v-flex></v-layout
                ><v-layout row
                  ><v-flex xs10>
                    <v-select
                      v-model="outboundLocal.unitOfMeasurement"
                      prepend-icon="strikethrough_s"
                      :items="unitOfMeasurements"
                      label="Đơn vị đo"
                    ></v-select> </v-flex></v-layout
              ></v-layout>
              <v-layout col
                ><v-layout row
                  ><v-flex xs5>
                    <v-text-field
                      v-model="outboundLocal.goodsDescription"
                      prepend-icon="description"
                      type="text"
                      label="Mô tả"
                    ></v-text-field> </v-flex></v-layout
              ></v-layout>
              <v-btn
                color="primary"
                @click="updateOutbound()"
                :disabled="!valid"
                >Lưu và tiếp tục</v-btn
              >
              <!-- <v-btn text @click="dialogEditSync = false">Hủy</v-btn> -->
            </v-form>
          </v-stepper-content>

          <v-stepper-step :complete="stepper > 2" step="2" :editable="editable"
            >Thông tin Booking</v-stepper-step
          >

          <v-stepper-content step="2">
            <v-form ref="bookingForm" v-model="valid2" lazy-validation>
              <small>*Dấu sao là trường bắt buộc</small>
              <v-layout col
                ><v-layout row
                  ><v-flex xs10>
                    <v-text-field
                      v-model="outboundLocal.booking.bookingNumber"
                      prepend-icon="child_friendly"
                      :rules="[required('booking number')]"
                      label="bookingNumber*"
                      required
                    ></v-text-field> </v-flex></v-layout
                ><v-layout row
                  ><v-flex xs10>
                    <v-select
                      v-model="outboundLocal.booking.portOfLoading"
                      prepend-icon="flag"
                      :items="portsToString"
                      :rules="[required('port of loading')]"
                      label="Cảng nhận container rỗng*"
                      required
                    ></v-select> </v-flex></v-layout
              ></v-layout>
              <v-layout col
                ><v-layout row
                  ><v-flex xs10>
                    <v-menu
                      ref="cutOffTimePicker"
                      v-model="cutOffTimePicker"
                      :close-on-content-click="false"
                      :return-value.sync="cutOffTime"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="cutOffTime"
                          label="Thời gian tàu chạy*"
                          prepend-icon="flight_takeoff"
                          v-bind="attrs"
                          v-on="on"
                          required
                          :rules="[required('cut off time')]"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="cutOffTime" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="cutOffTimePicker = false"
                          >Cancel</v-btn
                        >
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.cutOffTimePicker.save(cutOffTime)"
                          >OK</v-btn
                        >
                      </v-date-picker>
                    </v-menu>
                  </v-flex></v-layout
                ><v-layout row
                  ><v-flex xs10>
                    <v-text-field
                      v-model="outboundLocal.booking.unit"
                      prepend-icon="commute"
                      :rules="[required('unit')]"
                      label="Số lượng Container*"
                      type="number"
                      required
                    ></v-text-field> </v-flex></v-layout
              ></v-layout>
              <v-checkbox
                v-model="outboundLocal.booking.isFcl"
                label="Hàng nguyên cont"
              ></v-checkbox>
              <v-btn
                color="primary"
                @click="updateBooking()"
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
import { IOutbound } from "@/entity/outbound";
import FormValidate from "@/mixin/form-validate";
import { IPort } from "@/entity/port";
import { IContainerType } from "@/entity/container-type";
import { IShippingLine } from "@/entity/shipping-line";
import { getContainerTypes } from "@/api/container-type";
import { getPorts } from "@/api/port";
import { getShippingLines } from "@/api/shipping-line";
import { PaginationResponse } from "@/api/payload";
import { updateOutbound } from "@/api/outbound";
import { updateBooking } from "@/api/booking";
import { IBooking } from "@/entity/booking";
import { addTimeToDate } from "@/utils/tool";
import { addHoursToDate } from "@/utils/tool";

@Component({
  mixins: [FormValidate]
})
export default class UpdateOutbound extends Vue {
  @PropSync("dialogEdit", { type: Boolean }) dialogEditSync!: boolean;
  @Prop(Object) outbound!: IOutbound;
  @PropSync("outbounds", { type: Array }) outboundsSync!: Array<IOutbound>;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  // Form validate
  checkbox = false;
  editable = true;
  stepper = 1;
  valid = true;
  valid2 = true;
  // API list
  dateInit = new Date().toISOString().substr(0, 10);
  ports: Array<IPort> = [];
  shippingLines: Array<IShippingLine> = [];
  containerTypes: Array<IContainerType> = [];
  unitOfMeasurements: Array<string> = [];
  outboundLocal = {} as IOutbound;
  packingTime = this.dateInit;
  cutOffTime = this.dateInit;
  // outboundLocal form
  packingTimePicker = false;

  // B/L form
  cutOffTimePicker = false;

  // Outbound Update
  updateOutbound() {
    // TODO
    this.outboundLocal.packingTime = addTimeToDate(this.packingTime);
    this.outboundLocal.booking.cutOffTime = addTimeToDate(this.cutOffTime);
    this.outboundLocal.deliveryTime = addHoursToDate(
      new Date(this.outboundLocal.packingTime),
      5
    );
    updateOutbound(this.outboundLocal)
      .then(res => {
        console.log(res.data);
        const response: IOutbound = res.data;
        this.messageSync =
          "Cập nhập thành công hàng xuất: " + response.booking.bookingNumber;
        const index = this.outboundsSync.findIndex(x => x.id == response.id);
        this.outboundsSync.splice(index, 1, response);
        this.outboundLocal.booking.cutOffTime = this.outboundLocal.booking.cutOffTime.slice(
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
  updateBooking() {
    this.outboundLocal.booking.cutOffTime = addTimeToDate(this.cutOffTime);
    updateBooking(this.outboundLocal.booking)
      .then(res => {
        const response: IBooking = res.data;
        this.messageSync =
          "Cập nhập thành công Booking: " + response.bookingNumber;
        const index = this.outboundsSync.findIndex(
          x => x.id === this.outboundLocal.id
        );
        this.outboundsSync.splice(index, 1, this.outboundLocal);
      })
      .catch(err => {
        console.log(err);
        this.messageSync = "Đã có lỗi xảy ra";
      })
      .finally(() => (this.snackbarSync = true));
  }

  created() {
    this.outboundLocal = Object.assign({}, this.outbound);
    this.packingTime = this.outboundLocal.packingTime.slice(0, 10);
    this.cutOffTime = this.outboundLocal.booking.cutOffTime.slice(0, 10);
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
  mounted() {
    // TODO: API get Ports
    // TODO: API get Shipping Line
    // TODO: API get Container Type
    //TODO: API get unit of mesurement
    this.unitOfMeasurements = ["KG"];
  }
}
</script>
