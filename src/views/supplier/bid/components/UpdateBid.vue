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
        <v-toolbar-title>Chỉnh sửa HSDT</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialogEditSync = false">Trở về</v-btn>
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
                :rules="[
                  minNumber('bid price', biddingDocumentSync.bidFloorPrice + 1)
                ]"
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
                    label="Thời gian gửi thầu"
                    prepend-icon="event"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="bidLocal.bidDate"
                  no-title
                  scrollable
                  readonly
                  disabled
                >
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
                    label="Hiệu lực HSDT"
                    prepend-icon="event"
                    v-bind="attrs"
                    v-on="on"
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
              <v-text-field
                label="Label Text"
                value="12:30:00"
                type="time"
                suffix="PST"
              ></v-text-field>
              <v-btn
                color="primary"
                @click="
                  updateBid();
                  valid = false;
                "
                :disabled="!valid"
                >Lưu và Tiếp tục</v-btn
              >
            </v-form>
          </v-stepper-content>
          <v-stepper-step :complete="stepper > 2" step="2" :editable="editable"
            >Chọn containers mong muốn</v-stepper-step
          >
          <!-- SELECT CONTAINER -->
          <v-stepper-content step="2">
            <v-tabs background-color="white" color="deep-purple accent-4" left>
              <v-tab>Danh sach Inbound</v-tab>
              <v-tab>Selected Containers</v-tab>

              <v-tab-item>
                <v-container fluid>
                  <v-data-table
                    :headers="inboundHeaders"
                    :items="inbounds"
                    :single-expand="true"
                    :expanded.sync="expanded"
                    show-expand
                    @click:row="clicked"
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
                    <template v-slot:item.pickUpTime="{ item }">
                      {{ formatDatetime(item.pickupTime) }}
                    </template>
                    <template v-slot:item.status="{ item }">
                      {{
                        typeof item.billOfLading !== "undefined"
                          ? item.billOfLading.containers[0].status
                          : ""
                      }}
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
                </v-container>
              </v-tab-item>
              <v-tab-item>
                <v-container fluid>
                  <v-data-table
                    :headers="containerHeaders"
                    :items="containers"
                    item-key="id"
                    :footer-props="{
                      'items-per-page-options': options.itemsPerPageItems
                    }"
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
                </v-container>
              </v-tab-item>
            </v-tabs>
            <v-btn color="primary" @click="updateBid()" :disabled="!valid"
              >Hoàn thành</v-btn
            >
            <v-btn
              text
              @click="
                stepper = 1;
                valid = true;
              "
              >Quay lại</v-btn
            >
          </v-stepper-content>
        </v-stepper>
      </v-list>
      <!-- END CONTENT -->
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IBid } from "@/entity/bid";
import FormValidate from "@/mixin/form-validate";
import { updateBid } from "@/api/bid";
import { IBiddingDocument } from "@/entity/bidding-document";
import { IInbound } from "@/entity/inbound";
import { IContainer } from "@/entity/container";

@Component({
  mixins: [FormValidate]
})
export default class UpdateBid extends Vue {
  @PropSync("dialogEdit", { type: Boolean }) dialogEditSync!: boolean;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("bid", { type: Object }) bidSync!: IBid;
  @PropSync("biddingDocument", { type: Object })
  biddingDocumentSync!: IBiddingDocument;

  // Form validate
  checkbox = false;
  editable = true;
  datePickerMenu = false;
  datePickerMenu2 = false;
  expanded: Array<IInbound> = [];
  singleExpand = true;
  loading = true;
  options = {
    descending: true,
    page: 1,
    itemsPerPage: 5,
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
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
  stepper = 1;
  valid = true;
  bidLocal = {} as IBid;
  inbounds = [] as Array<IInbound>;
  containers = [] as Array<IContainer>;
  created() {
    this.bidLocal = Object.assign({}, this.bidSync);
  }
  // Bid Update
  updateBid() {
    if (this.bidLocal.id) {
      updateBid(this.bidLocal)
        .then(res => {
          console.log(res.data);
          const response: IBid = res.data;
          this.messageSync = "Cập nhập thành công HSDT: " + response.id;
          this.bidSync = response;
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
  clicked(value: IInbound) {
    if (this.singleExpand) {
      if (this.expanded.length > 0 && this.expanded[0].id === value.id) {
        this.expanded.splice(0, this.expanded.length);
      } else {
        this.expanded.splice(0, this.expanded.length);
        this.expanded.push(value);
      }
    } else {
      const index = this.expanded.findIndex(x => x.id === value.id);
      if (index === -1) {
        this.expanded.push(value);
      } else {
        this.expanded.splice(index, 1);
      }
    }
  }
}
</script>
