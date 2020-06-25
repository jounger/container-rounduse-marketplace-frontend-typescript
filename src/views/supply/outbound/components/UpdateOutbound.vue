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
        <v-toolbar-items>
          <v-btn dark text @click="dialogEditSync = false">Save</v-btn>
        </v-toolbar-items>
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
                :items="shippingLines"
                :rules="[required('shipping line')]"
                label="Hãng tàu"
                required
              ></v-select>
              <v-select
                v-model="outboundSync.containerType"
                :items="containerTypes"
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
                v-model="outboundSync.grossWeight"
                :rules="[required('gross weight')]"
                type="number"
                label="Khối lượng hàng"
                required
              ></v-text-field>
              <v-select
                v-model="outboundSync.unitOfMesurement"
                :items="UOMS"
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
              ></v-text-field>

              <v-select
                v-model="outboundSync.booking.portOfLoading"
                :items="ports"
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
              <v-select
                v-model="outboundSync.booking.isFcl"
                :items="fcls"
                :rules="[required('fcl')]"
                label="Full container loaded"
                required
              ></v-select>
              <v-btn
                color="primary"
                @click="dialogEditSync = false"
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
  ports: Array<string> = [];
  shippingLines: Array<string> = [];
  containerTypes: Array<string> = [];
  UOMS: Array<string> = [];
  fcls: Array<boolean> = [];

  // inbound form
  datePickerMenu = false;

  // Booking form
  datePickerMenu2 = false;

  // Outbound Update
  updateOutbound() {
    // TODO
    this.stepper = 2;
  }

  updateBooking() {
    // TODO
    this.stepper = 3;
  }

  mounted() {
    // TODO: API get Ports
    this.ports = ["HPH", "APL"];
    // TODO: API get Shipping Line
    this.shippingLines = ["APL", "GREEN"];
    // TODO: API get Container Type
    this.containerTypes = ["40HC", "20DC"];
    //TODO: API get unit of mesurement
    this.UOMS = ["KG", "tấn"];
    this.fcls = [true, false];
  }
}
</script>
