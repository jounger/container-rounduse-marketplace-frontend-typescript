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
        <v-toolbar-title>Thêm mới Bid</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialogAddSync = false">Save</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <!-- START CONTENT -->
      <v-list three-line subheader>
        <v-stepper v-model="stepper" vertical>
          <v-stepper-step :complete="stepper > 1" step="1" :editable="editable">
            Thông tin HSDT
            <small>Thông tin chung</small>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-form ref="bidForm" v-model="valid" lazy-validation>
              <v-text-field
                v-model="bidLocal.bidPrice"
                type="number"
                :rules="[minNumber('bid price', 5), maxNumber('bid price', 50)]"
                label="Giá gửi thầu"
              ></v-text-field>
              <v-menu
                ref="datePickerMenu"
                v-model="datePickerMenu"
                :close-on-content-click="false"
                :return-value.sync="bidLocal.bidDate"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="bidLocal.bidDate"
                    label="Thời gian lấy containers đặc từ cảng"
                    prepend-icon="event"
                    v-bind="attrs"
                    v-on="on"
                    required
                    :rules="[required('pickup time')]"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="bidLocal.bidDate" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="datePickerMenu = false"
                    >Cancel</v-btn
                  >
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.datePickerMenu.save(bidLocal.bidDate)"
                    >OK</v-btn
                  >
                </v-date-picker>
              </v-menu>

              <v-menu
                ref="datePickerMenu2"
                v-model="datePickerMenu2"
                :close-on-content-click="false"
                :return-value.sync="bidLocal.bidValidityPeriod"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="bidLocal.bidValidityPeriod"
                    label="Thời gian lấy containers đặc từ cảng"
                    prepend-icon="event"
                    v-bind="attrs"
                    v-on="on"
                    required
                    :rules="[required('pickup time')]"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="bidLocal.bidValidityPeriod"
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
                      $refs.datePickerMenu2.save(bidLocal.bidValidityPeriod)
                    "
                    >OK</v-btn
                  >
                </v-date-picker>
              </v-menu>
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
            >Chọn containers mong muốn</v-stepper-step
          >

          <!-- CREATE CONTAINER -->
          <v-stepper-content step="2">
            <v-data-table
              :headers="inboundHeaders"
              :items="inbounds"
              :single-expand="true"
              :expanded.sync="expanded"
              show-expand
              item-key="id"
              :loading="loading"
              :options.sync="options"
              :server-items-length="options.totalItems"
              :footer-props="{
                'items-per-page-options': options.itemsPerPageItems
              }"
              :actions-append="options.page"
              class="elevation-1 my-1"
            >
              <!--  -->
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>Danh sách hàng nhập phù hợp</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" dark class="mb-2" to="/inbound">
                    Thêm mới
                  </v-btn>
                </v-toolbar>
              </template>
              <!--  -->
              <template v-slot:item.pickUpTime="{ item }">
                {{ formatDatetime(item.pickUpTime) }}
              </template>
              <!-- Show containers expened -->
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length" class="px-0">
                  <v-data-table
                    :headers="containerHeaders"
                    :items="item.billOfLading.containers"
                    :hide-default-footer="true"
                    dark
                    dense
                  >
                    <template v-slot:item.actions="{ item }">
                      <v-btn
                        class="ma-1"
                        x-small
                        tile
                        outlined
                        color="success"
                        @click="selectContainer(item)"
                      >
                        <v-icon left>mdi-pencil</v-icon>
                        {{ checkDuplicateSelect(item) ? "Bỏ" : "Chọn" }}
                      </v-btn>
                    </template>
                  </v-data-table>
                </td>
              </template>
            </v-data-table>
            <v-btn color="primary" @click="stepper = 3" :disabled="!valid"
              >Tiếp tục</v-btn
            >
            <v-btn text @click="stepper = 1">Quay lại</v-btn>
          </v-stepper-content>

          <v-stepper-step step="3">Hoàn thành</v-stepper-step>
          <v-stepper-content step="3">
            <v-form ref="finishForm" v-model="valid" lazy-validation>
              <v-checkbox
                v-model="checkbox"
                :rules="[required('agree term')]"
                label="Bạn đồng ý rằng tất cả các thông tin đưa lên đều là chính xác."
              ></v-checkbox>
              <v-btn color="primary" @click="createBid()" :disabled="!valid"
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
import { IBid } from "@/entity/bid";
import { IContainer } from "@/entity/container";
import FormValidate from "@/mixin/form-validate";
import { IInbound } from "@/entity/inbound";
import Utils from "@/mixin/utils";

@Component({
  mixins: [FormValidate, Utils]
})
export default class CreateBid extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("bid", { type: Object }) bidSync!: IBid;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  expanded = [];
  dateInit = new Date().toISOString().substr(0, 10);
  bidLocal = {
    containers: [],
    bidPrice: 0,
    bidDate: this.dateInit,
    bidValidityPeriod: this.dateInit,
    status: ""
  } as IBid;
  loading = true;
  options = {
    descending: true,
    page: 1,
    itemsPerPage: 5,
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  // Form validate
  checkbox = false;
  editable = false;
  stepper = 1;
  valid = true;
  // API list

  // bidLocal form
  datePickerMenu = false;
  datePickerMenu2 = false;

  // Inbound
  inbounds: Array<IInbound> = [];
  inbound = {} as IInbound;
  inboundHeaders = [
    {
      text: "Mã",
      align: "start",
      sortable: false,
      value: "id"
    },
    { text: "Hãng tàu", value: "shippingLine" },
    { text: "Loại cont", value: "containerType" },
    { text: "Trạng thái", value: "status" },
    { text: "Time lấy cont", value: "pickUpTime" },
    { text: "B/L No.", value: "billOfLading.billOfLadingNumber" },
    { text: "Cảng lấy cont", value: "billOfLading.portOfDelivery" },
    { text: "Số lượng cont", value: "billOfLading.containers.length" }
  ];
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
    { text: "Hành động", value: "actions" }
  ];

  // Bid
  createBid() {
    // TODO: API create bid
    this.bidSync = this.bidLocal;
  }

  selectContainer(item: IContainer) {
    const isDuplicate = this.checkDuplicateSelect(item);
    if (!isDuplicate) {
      this.bidLocal.containers.push(item);
    } else {
      const index = this.bidLocal.containers.findIndex(x => x.id === item.id);
      this.bidLocal.containers.splice(index, 1);
    }
  }

  checkDuplicateSelect(item: IContainer) {
    return this.bidLocal.containers.filter(x => x.id == item.id).length > 0
      ? true
      : false;
  }

  mounted() {
    // TODO: API get
    this.options.totalItems = 10;
    this.loading = false;
  }
}
</script>
