<template>
  <v-dialog
    v-model="dialogAddSync"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialogAddSync = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="updateOutbound()" v-if="outboundSync.id"
            >Cập nhập</v-btn
          >
          <v-btn dark text @click="addOutbound()" v-else>Thêm mới</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Mã booking"
                  name="bookingNumber"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="outboundSync.bookingNumber"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-select
                  :items="categoryList"
                  attach
                  label="Loại hàng"
                  multiple
                  chips
                  v-model="outboundSync.categories"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-select
                  :items="shippingLines"
                  attach
                  label="Hãng tàu"
                  multiple
                  chips
                  v-model="outboundSync.shippingLine"
                ></v-select>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-select
                  :items="ports"
                  attach
                  label="Bến cảng"
                  multiple
                  chips
                  v-model="outboundSync.portOfLoading"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs4>
                <v-menu
                  ref="packingTimePicker"
                  v-model="laytimePicker"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="outboundSync.packingTime"
                      label="Thời gian xếp hàng"
                      hint="YYYY/MM/DD"
                      persistent-hint
                      prepend-icon="event"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="outboundSync.packingTime"
                    no-title
                    @input="packingTimePicker = false"
                  ></v-date-picker>
                </v-menu> </v-flex
              ><v-flex xs2>
                <v-dialog
                  ref="dialog"
                  v-model="modal2"
                  :return-value.sync="time"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="time"
                      label="Giờ xếp hàng"
                      prepend-icon="access_time"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker v-if="modal2" v-model="time" full-width>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modal2 = false"
                      >Cancel</v-btn
                    >
                    <v-btn text color="primary" @click="$refs.dialog.save(time)"
                      >OK</v-btn
                    >
                  </v-time-picker>
                </v-dialog>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Quốc gia"
                  name="country"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="outboundSync.packingStation.country"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Tỉnh/Thành phố"
                  name="city"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="outboundSync.packingStation.city"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Huyện"
                  name="county"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="outboundSync.packingStation.county"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Địa chỉ chi tiết"
                  name="street"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="outboundSync.packingStation.street"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Postal Code"
                  name="postalCode"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="outboundSync.packingStation.postalCode"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-menu
                  ref="laytimePicker"
                  v-model="laytimePicker"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="outboundSync.laytime"
                      label="Thời gian làm hàng"
                      hint="YYYY/MM/DD"
                      persistent-hint
                      prepend-icon="event"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="outboundSync.laytime"
                    no-title
                    @input="laytimePicker = false"
                  ></v-date-picker>
                </v-menu>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-menu
                  ref="cutOfTimePicker"
                  v-model="cutOfTimePicker"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="outboundSync.cutOffTime"
                      label="Thời gian tàu chạy"
                      hint="YYYY/MM/DD"
                      persistent-hint
                      prepend-icon="event"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="outboundSync.cutOffTime"
                    no-title
                    @input="cutOfTimePicker = false"
                  ></v-date-picker>
                </v-menu>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Loại cont"
                  name="containerType"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="outboundSync.containerType"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Khối lượng"
                  name="payload"
                  prepend-icon="mdi-lock"
                  type="number"
                  v-model="outboundSync.payload"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Đơn vị"
                  name="unitOfMeasurement"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="outboundSync.unitOfMeasurement"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-checkbox
                  v-model="outboundSync.fcl"
                  label="Full container loaded"
                ></v-checkbox>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-select
                  :items="statusList"
                  attach
                  label="Trạng thái"
                  multiple
                  chips
                  v-model="outboundSync.status"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { IOutbound } from "@/entity/outbound";
import { createOutbound, updateOutbound } from "@/api/outbound";

@Component
export default class CreateOutbound extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("outbound", { type: Object }) outboundSync!: IOutbound;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  title = this.outboundSync ? "Cập nhập" : "Thêm mới";
  packingTimePicker = false;
  laytimePicker = false;
  cutOfTimePicker = false;
  categoryList = ["Hàng nóng", "Hàng siêu nóng", "Hàng khủng", "abc"];
  statusList = ["CREATED"];
  shippingLines = ["apl"];
  ports = ["HAIPHONGPORT"];
  time = "";
  menu2 = false;
  dialog = false;
  modal2 = false;
  addOutbound() {
    console.log(this.time);
    console.log(this.outboundSync.packingTime);
    if (this.outboundSync) {
      const merchant = this.$auth.user().id;
      createOutbound(merchant, this.outboundSync)
        .then(res => {
          console.log(res.data);
          const response: IOutbound = res.data;
          this.outboundSync = response;
          this.messageSync =
            "Thêm mới thành công mặt hàng: " + this.outboundSync.id;
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
  updateOutbound() {
    if (this.outboundSync.id) {
      updateOutbound(this.outboundSync)
        .then(res => {
          console.log(res.data);
          const response: IOutbound = res.data;
          this.outboundSync = response;
          this.messageSync =
            "Cập nhập thành công mặt hàng: " + this.outboundSync.id;
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Error happend";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
}
</script>
