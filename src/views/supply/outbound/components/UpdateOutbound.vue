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
              <v-select
                v-model="outboundSync.shippingLine"
                :items="shippingLinesToString"
                :rules="[required('shipping line')]"
                label="Hãng tàu"
                required
              ></v-select>
              <v-select
                v-model="outboundSync.containerType"
                :items="containerTypesToString"
                :rules="[required('container type')]"
                label="Loại container"
                required
              ></v-select>
              <v-menu
                ref="datePickerMenu"
                v-model="datePickerMenu"
                :close-on-content-click="false"
                :return-value.sync="outboundSync.packingTime"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="outboundSync.packingTime"
                    label="Thời gian đóng hàng"
                    prepend-icon="event"
                    v-bind="attrs"
                    v-on="on"
                    required
                    :rules="[required('packing time')]"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="outboundSync.packingTime"
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="datePickerMenu = false"
                    >Cancel</v-btn
                  >
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.datePickerMenu.save(outboundSync.packingTime)"
                    >OK</v-btn
                  >
                </v-date-picker>
              </v-menu>
              <v-text-field
                v-model="outboundSync.packingStation"
                :rules="[required('packing station')]"
                type="text"
                label="Nơi đóng hàng"
                required
              ></v-text-field>
              <v-text-field
                v-model="outboundSync.goodsDescription"
                :rules="[required('Good Description')]"
                type="text"
                label="Mô tả"
                required
              ></v-text-field>
              <v-text-field
                v-model="outboundSync.payload"
                :rules="[required('payload')]"
                type="number"
                label="Khối lượng hàng"
                required
              ></v-text-field>
              <v-select
                v-model="outboundSync.unitOfMeasurement"
                :items="unitOfMesurements"
                :rules="[required('unit of mesurement')]"
                label="Đơn vị đo"
                required
              ></v-select>
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
            <v-form ref="bookingForm" v-model="valid" lazy-validation>
              <v-text-field
                v-model="outboundSync.booking.bookingNumber"
                :counter="50"
                :rules="[
                  minLength('Booking number', 5),
                  maxLength('Booking number', 50)
                ]"
                label="bookingNumber"
                required
                readonly
              ></v-text-field>

              <v-select
                v-model="outboundSync.booking.portOfLoading"
                :items="portsToString"
                :rules="[required('port of loading')]"
                label="Cảng nhận container rỗng"
                required
              ></v-select>

              <v-menu
                ref="datePickerMenu2"
                v-model="datePickerMenu2"
                :close-on-content-click="false"
                :return-value.sync="outboundSync.booking.cutOffTime"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="outboundSync.booking.cutOffTime"
                    label="Thời gian tàu chạy"
                    prepend-icon="event"
                    v-bind="attrs"
                    v-on="on"
                    required
                    :rules="[required('det')]"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="outboundSync.booking.cutOffTime"
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="datePickerMenu2 = false"
                    >Cancel</v-btn
                  >
                  <v-btn
                    text
                    color="primary"
                    @click="
                      $refs.datePickerMenu2.save(
                        outboundSync.booking.cutOffTime
                      )
                    "
                    >OK</v-btn
                  >
                </v-date-picker>
              </v-menu>
              <v-text-field
                v-model="outboundSync.booking.unit"
                :rules="[required('unit')]"
                label="Số lượng Container"
                type="number"
                required
              ></v-text-field>
              <v-checkbox
                v-model="outboundSync.booking.isFcl"
                label="Hàng nguyên cont"
              ></v-checkbox>
              <v-btn
                color="primary"
                @click="updateOutbound()"
                :disabled="!valid"
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
import { Component, Vue, PropSync } from "vue-property-decorator";
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

@Component({
  mixins: [FormValidate]
})
export default class UpdateOutbound extends Vue {
  @PropSync("dialogEdit", { type: Boolean }) dialogEditSync!: boolean;
  @PropSync("outbound", { type: Object }) outboundSync!: IOutbound;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  // Form validate
  checkbox = false;
  editable = true;
  stepper = 1;
  valid = true;
  // API list
  ports: Array<IPort> = [];
  shippingLines: Array<IShippingLine> = [];
  containerTypes: Array<IContainerType> = [];
  unitOfMesurements: Array<string> = [];
  // outboundLocal form
  datePickerMenu = false;

  // B/L form
  datePickerMenu2 = false;

  // Outbound Update
  updateOutbound() {
    // TODO
    updateOutbound(this.outboundSync)
      .then(res => {
        console.log(res.data);
        const response: IOutbound = res.data;
        this.outboundSync = response;
        this.messageSync =
          "Cập nhập thành công hàng xuất: " +
          this.outboundSync.booking.bookingNumber;
      })
      .catch(err => {
        console.log(err);
        this.messageSync = "Đã có lỗi xảy ra";
      })
      .finally(() => (this.snackbarSync = true));
    this.stepper = 2;
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
  mounted() {
    // TODO: API get Ports
    // TODO: API get Shipping Line
    // TODO: API get Container Type
    //TODO: API get unit of mesurement
    this.unitOfMesurements = ["KG"];
  }
}
</script>
