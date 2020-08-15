<template>
  <v-dialog
    v-model="dialogAddSync"
    fullscreen
    persistent
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <!-- TITLE -->
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialogAddSync = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Tạo hàng ghép</v-toolbar-title>
      </v-toolbar>
      <!-- START CONTENT -->
      <v-list three-line subheader>
        <v-stepper v-model="stepper" vertical>
          <v-stepper-step :complete="stepper > 1" step="1" :editable="editable">
            Cont đã chọn
            <small>Thông tin bắt buộc</small>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-data-table
              :headers="containerHeaders"
              :items="containersSelected"
              item-key="id"
              :loading="loading"
              :options.sync="containerOptions"
              :server-items-length="containerServerSideOptions.totalItems"
              :footer-props="{
                'items-per-page-options':
                  containerServerSideOptions.itemsPerPageItems
              }"
              :actions-append="containerOptions.page"
              no-data-text="Danh sách Container đã chọn"
              disable-sort
              class="elevation-0"
            >
              <template v-slot:item.bid="{ item }">
                {{ getBidFromContainer(item).id }}
              </template>
            </v-data-table>
            <v-btn color="primary" @click="stepper = 2">Tiếp tục</v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="stepper > 2" step="2" :editable="editable"
            >Tạo hợp đồng</v-stepper-step
          >

          <v-stepper-content step="2">
            <v-form ref="contractForm" v-model="valid" validation>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="merchant"
                    prepend-icon="money"
                    type="text"
                    label="Chủ hàng"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="forwarder.companyName"
                    prepend-icon="money"
                    type="text"
                    label="Công ty vận chuyển"
                    disabled
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-checkbox
                    v-model="combinedLocal.contract.required"
                    label="Yêu cầu hợp đồng"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-if="combinedLocal.contract.required"
                    v-model="
                      combinedLocal.contract.finesAgainstContractViolations
                    "
                    prepend-icon="money"
                    type="number"
                    :rules="[required('phần trăm tiền phạt')]"
                    label="% tiền phạt"
                  ></v-text-field>
                </v-col>
              </v-row>
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
import { Component, Vue, PropSync, Prop, Watch } from "vue-property-decorator";
import { ICombined } from "@/entity/combined";
import FormValidate from "@/mixin/form-validate";
import Utils from "@/mixin/utils";
import { createCombined } from "@/api/combined";
import { IBid } from "@/entity/bid";
import { IContract } from "@/entity/contract";
import { DataOptions } from "vuetify";
import { IContainer } from "@/entity/container";
import { IForwarder } from "@/entity/forwarder";

@Component({
  mixins: [FormValidate, Utils]
})
export default class CreateCombined extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("numberWinner", { type: Number }) numberWinnerSync!: number;
  @Prop() isMultipleAward!: boolean;
  @PropSync("bid", { type: Object }) bidSync!: IBid;

  dateInit = new Date().toISOString().substr(0, 10);
  containersSelected: Array<IContainer> = [];
  combinedLocal = {
    bid: this.bidSync ? this.bidSync.id : -1,
    containers: [],
    contract: {
      finesAgainstContractViolation: 0,
      required: false
    } as IContract
  } as ICombined;
  // Form validate
  checkbox = false;
  editable = false;
  stepper = 1;
  merchant = "";
  forwarder = null as IForwarder | null;
  valid = true;

  // Outbound form
  loading = false;
  containerOptions = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  containerServerSideOptions = {
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };

  containerHeaders = [
    {
      text: "Mã",
      align: "start",
      sortable: false,
      value: "id"
    },
    {
      text: "Container No.",
      value: "number"
    },
    { text: "HSDT", value: "bid" },
    { text: "Tài xế", value: "driver.fullname" },
    {
      text: "Rơ moóc",
      value: "trailer.licensePlate"
    },
    {
      text: "Đầu kéo",
      value: "tractor.licensePlate"
    },
    {
      text: "Trạng thái",
      value: "status"
    }
  ];

  // Create combined
  async createCombined() {
    if (this.bidSync.id) {
      this.combinedLocal.containers = this.getSelectedContainer.map(
        x => x.id
      ) as number[];
      const _res = await createCombined(this.bidSync.id, this.combinedLocal);
      if (_res.data) {
        const _combined = _res.data.data;
        this.getSelectedContainer.forEach(x => (x.status = "COMBINED"));
        this.bidSync.status = _combined.bid.status;
        this.numberWinnerSync += 1;
        this.dialogAddSync = false;
      }
    }
  }

  @Watch("containerOptions", { immediate: true })
  async onContainerOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      const _containers = this.getDataFromApi();
      this.containersSelected = _containers;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getBidFromContainer(item: IContainer) {
    // TODO: use
    return this.bidSync;
  }

  get getSelectedContainer() {
    const containers = this.bidSync.containers as IContainer[];
    if (this.isMultipleAward) {
      return containers.filter(x => x.isSelected == true);
    } else {
      return containers;
    }
  }

  getDataFromApi() {
    this.loading = true;
    const { page, itemsPerPage } = this.containerOptions;

    let items = this.getSelectedContainer;
    this.containerServerSideOptions.totalItems = items.length;

    if (itemsPerPage > 0) {
      items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    }
    this.loading = false;
    return items;
  }

  created() {
    // TODO: API get Outbound
    this.merchant = this.$auth.user().fullname;
    this.forwarder = this.bidSync.bidder as IForwarder;
  }
}
</script>
