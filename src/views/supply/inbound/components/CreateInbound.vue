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
        <v-toolbar-title>Settings</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialogAddSync = false">Save</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <!-- START CONTENT -->
      <v-list three-line subheader>
        <v-stepper v-model="stepper" vertical>
          <v-stepper-step :complete="stepper > 1" step="1" :editable="true">
            Tạo hàng nhập
            <small>Thông tin chung</small>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-form ref="inboundForm" v-model="valid" lazy-validation>
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
            </v-form>
            <v-btn color="primary" @click="stepper = 2" :disabled="!valid"
              >Tiếp tục</v-btn
            >
            <v-btn text @click="dialogAddSync = false">Hủy</v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="stepper > 2" step="2" :editable="true"
            >Điền B/L</v-stepper-step
          >

          <v-stepper-content step="2">
            <v-form ref="billOfLadingForm" v-model="valid" lazy-validation>
              <v-text-field
                v-model="inboundSync.billOfLading.billOfLadingNumber"
                :counter="10"
                :rules="maxRules"
                label="B/L No."
                required
              ></v-text-field>

              <v-select
                v-model="inboundSync.billOfLading.portOfDelivery"
                :items="ports"
                :rules="[v => !!v || 'Port is required']"
                label="Cảng lấy container đặc"
                required
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
                    required
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
            </v-form>
            <v-btn color="primary" @click="stepper = 3" :disabled="!valid"
              >Tiếp tục</v-btn
            >
            <v-btn text @click="dialogAddSync = false">Hủy</v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="stepper > 3" step="3" :editable="true"
            >Thêm các container hàng nhập</v-stepper-step
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
                        <span class="headline">Thêm mới cont</span>
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
                                :rules="[v => !!v || 'Driver is required']"
                                label="Tài xế"
                                required
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-select
                                v-model="container.trailer"
                                :items="trailers"
                                :rules="[v => !!v || 'Trailer is required']"
                                label="Loại rờ mọt"
                                required
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-select
                                v-model="container.tractor"
                                :items="tractors"
                                :rules="[v => !!v || 'Tractor is required']"
                                label="Loại đầu kéo"
                                required
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
            <v-btn color="primary" @click="stepper = 4" :disabled="!valid"
              >Tiếp tục</v-btn
            >
            <v-btn text @click="dialogAddSync = false">Hủy</v-btn>
          </v-stepper-content>

          <v-stepper-step step="4">Hoàn thành</v-stepper-step>
          <v-stepper-content step="4">
            <v-form ref="finishForm" v-model="valid" lazy-validation>
              <v-checkbox
                v-model="checkbox"
                :rules="[v => !!v || 'You must agree to continue!']"
                label="Bạn đồng ý rằng tất cả các thông tin đưa lên đều là chính xác."
                required
              ></v-checkbox>
            </v-form>
            <v-btn
              color="primary"
              @click="dialogAddSync = false"
              :disabled="!valid"
              >Hoàn tất</v-btn
            >
            <v-btn text @click="dialogAddSync = false">Hủy</v-btn>
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

@Component
export default class CreateInbound extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("inbound", { type: Object }) inboundSync!: IInbound;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  stepper = 1;
  valid = true;
  ports: Array<string> = [];
  trailers: Array<string> = [];
  tractors: Array<string> = [];

  // rules
  maxRules = [
    (v: string) => !!v || "Field is required",
    (v: string) =>
      (v && v.length <= 100) || "Field must be less than 100 characters"
  ];

  // inbound form
  datePickerMenu = false;

  // B/L form
  datePickerMenu2 = false;

  // Container form
  containerHeaders = [
    {
      text: "Mã",
      align: "start",
      value: "id"
    },
    { text: "Container No.", value: "containerNumber" },
    { text: "Biển kiểm sát", value: "licensePlate" },
    { text: "Tài xế", value: "driver" },
    { text: "Rơ mọt", value: "trailer" },
    { text: "Đầu kéo", value: "tractor" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];
  // containers: Array<IContainer> = [];
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

  mounted() {
    // TODO: API get Ports
    this.ports = ["HPH", "APL"];
    // TODO: API get Drivers by Forwarder
    this.drivers = ["driver", "driver1"];
    // trailers & tractors
    this.trailers = ["2", "3"];
    this.tractors = ["2", "3"];
  }
}
</script>
