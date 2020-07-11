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
      </v-toolbar>
      <!-- START CONTENT -->
      <v-list three-line subheader>
        <v-stepper v-model="stepper" vertical>
          <v-stepper-step :complete="stepper > 1" step="1" :editable="editable">
            Chọn HSDT
            <small>Thông tin bắt buộc</small>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-data-table
              :headers="bidHeaders"
              :items="bids"
              :single-expand="singleExpand"
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
              class="elevation-0"
            >
              <template v-slot:item.bidDate="{ item }">
                {{ formatDatetime(item.bidDate) }}
              </template>

              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length" class="px-0">
                  <v-data-table
                    :headers="containerHeaders"
                    :items="item.containers"
                    :hide-default-footer="true"
                    dark
                    dense
                  >
                  </v-data-table>
                </td>
              </template>
            </v-data-table>
            <v-btn color="primary" @click="stepper = 2">Tiếp tục</v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="stepper > 2" step="2" :editable="editable"
            >Tạo hợp đồng</v-stepper-step
          >

          <v-stepper-content step="2">
            <v-form ref="contractForm" v-model="valid" validation>
              <v-text-field
                v-model="merchant"
                prepend-icon="money"
                type="text"
                label="Bên chủ hàng"
                readonly
              ></v-text-field>
              <v-text-field
                v-model="forwarder"
                prepend-icon="money"
                type="text"
                label="Bên chủ xe"
                readonly
              ></v-text-field>
              <v-checkbox
                v-model="contract.required"
                label="Yêu cầu hợp đồng"
              />
              <v-text-field
                v-if="contract.required"
                v-model="contract.finesAgainstContractViolations"
                prepend-icon="money"
                type="number"
                :rules="[required('finesAgainstContractViolations')]"
                label="% tiền phạt"
              ></v-text-field>
              <v-btn color="primary" @click="stepper = 3" :disabled="!valid"
                >Tiếp tục</v-btn
              >
              <v-btn text @click="stepper = 1">Quay lại</v-btn>
            </v-form>
          </v-stepper-content>
          <!-- FINISH -->
          <v-stepper-step step="3">Hoàn thành</v-stepper-step>
          <v-stepper-content step="3">
            <v-form ref="finishForm">
              <v-checkbox
                v-model="checkbox"
                label="Bạn đồng ý rằng tất cả các thông tin đưa lên đều là chính xác."
              ></v-checkbox>
              <v-btn
                color="primary"
                @click="createCombined()"
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
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { ICombined } from "@/entity/combined";
import { IOutbound } from "@/entity/outbound";
import FormValidate from "@/mixin/form-validate";
import Utils from "@/mixin/utils";
import { isEmptyObject, addTimeToDate } from "@/utils/tool";
// import { createCombined } from "@/api/combined";
import { getOutboundByMerchant } from "@/api/outbound";
import { PaginationResponse } from "@/api/payload";
import { IBid } from "@/entity/bid";
import { IContract } from "@/entity/contract";

@Component({
  mixins: [FormValidate, Utils]
})
export default class CreateCombined extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("bid", { type: Object }) bidSync!: IBid;

  dateInit = new Date().toISOString().substr(0, 10);
  bids: Array<IBid> = [];
  combinedLocal = {
    bid: this.bidSync,
    status: "INFO_RECEIVED"
  } as ICombined;
  // Form validate
  contract = {
    finesAgainstContractViolations: 0,
    required: false
  } as IContract;
  checkbox = false;
  editable = false;
  expanded: Array<IBid> = [];
  singleExpand = true;
  stepper = 1;
  valid = true;

  // Outbound form
  loading = false;
  options = {
    descending: true,
    page: 1,
    itemsPerPage: 5,
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  bidHeaders = [
    {
      text: "Mã",
      align: "start",
      sortable: false,
      value: "id"
    },
    { text: "Cont qty", value: "containers.length" },
    { text: "Giá thầu", value: "bidPrice" },
    { text: "Ngày thầu", value: "bidDate" },
    { text: "", value: "actions", sortable: false }
  ];
  containerHeaders = [
    {
      text: "Container No.",
      align: "start",
      sortable: false,
      value: "containerNumber",
      class: "elevation-1 primary"
    },
    { text: "Tài xế", value: "driver", class: "elevation-1 primary" },
    {
      text: "Rơ moóc",
      value: "trailer.licensePlate",
      class: "elevation-1 primary"
    },
    {
      text: "Đầu kéo",
      value: "tractor.licensePlate",
      class: "elevation-1 primary"
    }
  ];

  clicked(value: IBid) {
    console.log(value);
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
  // Combined
  createCombined() {
    // TODO: API create combined
    // this.combinedLocal.bidOpening = addTimeToDate(this.bidOpening);
    // this.combinedLocal.bidClosing = addTimeToDate(this.bidClosing);
    // if (this.selectedBid && this.selectedBid.id) {
    //   this.combinedLocal.outbound = this.selectedBid.id as number;
    // }
    // console.log(this.combinedLocal);
    // createCombined(this.combinedLocal)
    //   .then(res => {
    //     console.log(res.data);
    //     const response: ICombined = res.data;
    //     this.messageSync = "Thêm mới thành công HSMT: " + response.id;
    //     if (typeof this.combinedsSync != "undefined") {
    //       this.combinedsSync.unshift(response);
    //       this.totalItemsSync += 1;
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     this.messageSync = "Đã có lỗi xảy ra";
    //   })
    //   .finally(() => (this.snackbarSync = true));
  }

  created() {
    // TODO: API get Outbound
    this.bids.push(this.bidSync);
  }
}
</script>