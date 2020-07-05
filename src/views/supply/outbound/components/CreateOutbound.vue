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
            Tạo hàng xuất
            <small>Thông tin chung</small>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-form ref="outboundForm" v-model="valid" validation>
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
                      :return-value.sync="outboundLocal.packingTime"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="outboundLocal.packingTime"
                          label="Thời gian đóng hàng"
                          prepend-icon="event"
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="outboundLocal.packingTime"
                        no-title
                        scrollable
                      >
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
                          @click="
                            $refs.packingTimePicker.save(
                              outboundLocal.packingTime
                            )
                          "
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
                      :items="unitOfMeasurements"
                      label="Đơn vị đo"
                    ></v-select> </v-flex></v-layout
              ></v-layout>
              <v-layout col
                ><v-layout row
                  ><v-flex xs5>
                    <v-text-field
                      v-model="outboundLocal.goodsDescription"
                      type="text"
                      label="Mô tả"
                    ></v-text-field> </v-flex></v-layout
              ></v-layout>

              <v-btn color="primary" @click="stepper = 2" :disabled="!valid"
                >Tiếp tục</v-btn
              >
              <!-- <v-btn text @click="dialogAddSync = false">Hủy</v-btn> -->
            </v-form>
          </v-stepper-content>

          <v-stepper-step :complete="stepper > 2" step="2" :editable="editable"
            >Điền Booking</v-stepper-step
          >

          <v-stepper-content step="2">
            <v-form ref="bookingForm" v-model="valid2" validation>
              <small>*Dấu sao là trường bắt buộc</small>
              <v-layout col
                ><v-layout row
                  ><v-flex xs10>
                    <v-text-field
                      v-model="outboundLocal.booking.bookingNumber"
                      :rules="[required('booking number')]"
                      label="bookingNumber*"
                      required
                    ></v-text-field> </v-flex></v-layout
                ><v-layout row
                  ><v-flex xs10>
                    <v-select
                      v-model="outboundLocal.booking.portOfLoading"
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
                      :return-value.sync="outboundLocal.booking.cutOffTime"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="outboundLocal.booking.cutOffTime"
                          label="Thời gian tàu chạy*"
                          prepend-icon="event"
                          v-bind="attrs"
                          v-on="on"
                          required
                          :rules="[required('cut off time')]"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="outboundLocal.booking.cutOffTime"
                        no-title
                        scrollable
                      >
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
                          @click="
                            $refs.cutOffTimePicker.save(
                              outboundLocal.booking.cutOffTime
                            )
                          "
                          >OK</v-btn
                        >
                      </v-date-picker>
                    </v-menu>
                  </v-flex></v-layout
                ><v-layout row
                  ><v-flex xs10>
                    <v-text-field
                      v-model="outboundLocal.booking.unit"
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
              <v-btn color="primary" @click="stepper = 3" :disabled="!valid2"
                >Tiếp tục</v-btn
              >
              <v-btn text @click="stepper = 1">Quay lại</v-btn>
            </v-form>
          </v-stepper-content>

          <v-stepper-step :complete="stepper > 3" step="3" :editable="editable"
            >Hoàn thành</v-stepper-step
          >

          <v-stepper-content step="3">
            <v-form ref="finishForm" v-model="checkbox" validation>
              <v-checkbox
                v-model="checkbox"
                :rules="[required('agree term')]"
                label="Bạn đồng ý rằng tất cả các thông tin đưa lên đều là chính xác."
              ></v-checkbox>
              <v-btn
                color="primary"
                @click="createOutbound()"
                :disabled="!checkbox"
                >Hoàn tất</v-btn
              >
              <v-btn text @click="stepper = 2">Quay lại</v-btn>
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
import { IOutbound } from "@/entity/outbound";
import FormValidate from "@/mixin/form-validate";
import { createOutbound } from "@/api/outbound";
import { getPorts } from "@/api/port";
import { PaginationResponse } from "@/api/payload";
import { IPort } from "@/entity/port";
import { getShippingLines } from "@/api/shipping-line";
import { IShippingLine } from "@/entity/shipping-line";
import { getContainerTypes } from "@/api/container-type";
import { IContainerType } from "@/entity/container-type";
import { addTimeToDate } from "@/utils/tool";
import { addHoursToDate } from "../../../../utils/tool";

@Component({
  mixins: [FormValidate]
})
export default class CreateOutbound extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("outbounds", { type: Array }) outboundsSync!: Array<IOutbound>;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  dateInit = new Date().toISOString().substr(0, 10);
  outboundLocal = {
    shippingLine: "",
    containerType: "",
    status: "",
    packingTime: this.dateInit,
    goodsDescription: "",
    packingStation: "",
    deliveryTime: "",
    grossWeight: 0,
    unitOfMeasurement: "KG",
    booking: {
      bookingNumber: "",
      unit: 0,
      cutOffTime: this.dateInit,
      isFcl: true,
      portOfLoading: ""
    }
  } as IOutbound;
  // Form validate
  checkbox = false;
  editable = false;
  stepper = 1;
  valid = true;
  valid2 = true;
  // API list
  ports: Array<IPort> = [];
  shippingLines: Array<IShippingLine> = [];
  containerTypes: Array<IContainerType> = [];
  unitOfMeasurements: Array<string> = [];
  // outboundLocal form
  packingTimePicker = false;

  // B/L form
  cutOffTimePicker = false;

  // Outbound
  createOutbound() {
    // TODO: API create outbound
    this.outboundLocal.packingTime = addTimeToDate(
      this.outboundLocal.packingTime
    );
    this.outboundLocal.booking.cutOffTime = addTimeToDate(
      this.outboundLocal.booking.cutOffTime
    );
    /* TODO: Calculate Delivery Time:
     * deliveryTime = (duration: packingStation -> portOfLoading) + packingTime (+ bias)
     */
    this.outboundLocal.deliveryTime = addHoursToDate(
      new Date(this.outboundLocal.packingTime),
      5
    );
    console.log(this.outboundLocal);
    createOutbound(this.outboundLocal)
      .then(res => {
        console.log(res.data);
        const response: IOutbound = res.data;
        this.outboundLocal = response;
        this.messageSync =
          "Thêm mới thành công hàng xuất: " +
          this.outboundLocal.booking.bookingNumber;
        this.outboundsSync.unshift(this.outboundLocal);
        this.totalItemsSync += 1;
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
        this.shippingLines = response.data;
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
