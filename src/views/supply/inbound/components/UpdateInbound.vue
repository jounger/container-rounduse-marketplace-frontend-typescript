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
            Thông tin hàng nhập
            <small>Thông tin chung</small>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-form ref="inboundForm" v-model="valid" lazy-validation>
              <v-select
                v-model="inboundSync.shippingLine"
                :items="shippingLines"
                :rules="[required('shipping line')]"
                label="Hãng tàu"
                required
              ></v-select>
              <v-select
                v-model="inboundSync.containerType"
                :items="containerTypes"
                :rules="[required('container type')]"
                label="Loại container"
                required
              ></v-select>
              <v-menu
                ref="datePickerMenu"
                v-model="datePickerMenu"
                :close-on-content-click="false"
                :return-value.sync="inboundSync.pickUpTime"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="inboundSync.pickUpTime"
                    label="Thời gian lấy containers đặc từ cảng"
                    prepend-icon="event"
                    v-bind="attrs"
                    v-on="on"
                    required
                    :rules="[required('pickup time')]"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="inboundSync.pickUpTime"
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
                    @click="$refs.datePickerMenu.save(inboundSync.pickUpTime)"
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
              ></v-text-field>

              <v-select
                v-model="inboundSync.billOfLading.portOfDelivery"
                :items="ports"
                :rules="[required('port of loading')]"
                label="Cảng lấy container đặc"
              ></v-select>

              <v-menu
                ref="datePickerMenu2"
                v-model="datePickerMenu2"
                :close-on-content-click="false"
                :return-value.sync="inboundSync.billOfLading.freeTime"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="inboundSync.billOfLading.freeTime"
                    label="Free Time (DEM/DET)"
                    prepend-icon="event"
                    v-bind="attrs"
                    v-on="on"
                    :rules="[required('det')]"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="inboundSync.billOfLading.freeTime"
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
                        inboundSync.billOfLading.freeTime
                      )
                    "
                    >OK</v-btn
                  >
                </v-date-picker>
              </v-menu>
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
              :items="inboundSync.billOfLading.containers"
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
                        v-bind="attrs"
                        v-on="on"
                        >Thêm mới</v-btn
                      >
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">Thông tin container</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="container.containerNumber"
                                label="Container No."
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="container.licensePlate"
                                label="Biển kiểm sát"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-select
                                v-model="container.driver"
                                :items="drivers"
                                :rules="[required('driver')]"
                                label="Tài xế"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-select
                                v-model="container.trailer"
                                :items="trailers"
                                :rules="[required('trailer')]"
                                label="Loại rờ mọt"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-select
                                v-model="container.tractor"
                                :items="tractors"
                                :rules="[required('tractor')]"
                                label="Loại đầu kéo"
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
                          >Cancel</v-btn
                        >
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="addContainer(container)"
                          >Save</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editContainer(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="deleteContainer(item)">
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
            <v-btn
              color="primary"
              @click="dialogEditSync = false"
              :disabled="!valid"
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

@Component({
  mixins: [FormValidate]
})
export default class UpdateInbound extends Vue {
  @PropSync("dialogEdit", { type: Boolean }) dialogEditSync!: boolean;
  @PropSync("inbound", { type: Object }) inboundSync!: IInbound;
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
  trailers: Array<string> = [];
  tractors: Array<string> = [];

  // inbound form
  datePickerMenu = false;

  // B/L form
  datePickerMenu2 = false;

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
  drivers: Array<string> = [];
  dialogAddCont = false;

  addContainer(item: IContainer) {
    // TODO: API create Container
    const copyItem = Object.assign({}, item);
    this.inboundSync.billOfLading.containers.push(copyItem);
  }

  editContainer(item: IContainer) {
    // TODO
    this.container = item;
    this.dialogAddCont = true;
    console.log(item);
  }

  deleteContainer(item: IContainer) {
    // TODO
    console.log(item);
  }

  // Inbound Update
  updateInbound() {
    // TODO
    this.stepper = 2;
  }

  updateBillOfLading() {
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
    // TODO: API get Drivers by Forwarder
    this.drivers = ["driver", "driver1"];
    // trailers & tractors
    this.trailers = ["2", "3"];
    this.tractors = ["2", "3"];
  }
}
</script>
