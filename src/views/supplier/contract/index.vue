<template>
  <v-container fluid>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="combineds"
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        item-key="id"
        show-expand
        @click:row="clicked"
        :loading="loading"
        :options.sync="options"
        :server-items-length="serverSideOptions.totalItems"
        :footer-props="{
          'items-per-page-options': serverSideOptions.itemsPerPageItems
        }"
        :actions-append="options.page"
        no-data-text="Danh sách hợp đồng rỗng."
        disable-sort
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title style="font-weight:bold; font-size: 25px;"
              >Danh sách Hợp đồng</v-toolbar-title
            >
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-menu :close-on-click="true">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" icon outlined v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item @click="openCreateInvoice(item)">
                <v-list-item-icon>
                  <v-icon small>add</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Tạo hóa đơn</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="openDetailInvoice(item)">
                <v-list-item-icon>
                  <v-icon small>remove_red_eye</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Xem hóa đơn</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="openUpdateDialog(item)"
                v-if="$auth.check('ROLE_MERCHANT')"
              >
                <v-list-item-icon>
                  <v-icon small>edit</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Chỉnh sửa</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="openCreateContractDocument(item)"
                v-if="$auth.check('ROLE_FORWARDER')"
              >
                <v-list-item-icon>
                  <v-icon small>cloud_upload</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Tải lên hợp đồng</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="openCreateRating(item)">
                <v-list-item-icon>
                  <v-icon small>stars</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Đánh giá nhà cung cấp</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <template v-slot:item.contract.price="{ item }">
          {{ currencyFormatter(item.contract.price) }}
        </template>
        <template v-slot:item.contract.required="{ item }">
          <div>{{ item.contract.required ? "Có" : "Không" }}</div>
          <small v-if="item.contract.required"
            >Phạt vi phạm:
            {{ item.contract.finesAgainstContractViolations }}%</small
          >
        </template>
        <template v-slot:item.contract.creationDate="{ item }">
          {{ formatDatetime(item.contract.creationDate) }}
        </template>
        <template v-slot:item.contract.paymentPercentage="{ item }">
          <v-progress-linear
            :color="item.isCanceled ? 'red' : 'success'"
            height="25"
            :value="item.contract.paymentPercentage || 0"
          >
            <template v-slot="{ value }">
              <strong>{{ value >= 100 ? 100 : Math.ceil(value) }}%</strong>
            </template></v-progress-linear
          >
        </template>
        <template v-slot:expanded-item="{ headers }">
          <td :colspan="headers.length" class="px-0" v-if="loading == false">
            <v-data-table
              :headers="contractDocumentHeaders"
              :items="contractDocuments"
              :loading="loading"
              :options.sync="contractDocumentOptions"
              :server-items-length="
                contractDocumentServerSideOptions.totalItems
              "
              :footer-props="{
                'items-per-page-options':
                  contractDocumentServerSideOptions.itemsPerPageItems
              }"
              :actions-append="contractDocumentOptions.page"
              disable-sort
              dense
              ><template v-slot:item.actions="{ item }">
                <v-btn
                  class="ma-1"
                  x-small
                  tile
                  outlined
                  color="info"
                  @click.stop="openDetailContractDocument(item)"
                >
                  <v-icon left dense>remove_red_eye </v-icon>Chi tiết
                </v-btn>
              </template>
              <template v-slot:item.documentPath="{ item }">
                <div @click="openDetailContractDocument(item)">
                  <v-icon>picture_as_pdf</v-icon>
                  {{
                    item.documentPath
                      ? item.documentPath.split("/")[4].substring(14)
                      : "N/A"
                  }}
                </div>
              </template>
              <template v-slot:item.status="{ item }">
                <ChipStatus :status="item.status" :sub="true" />
              </template>
            </v-data-table>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <DetailContractDocument
      v-if="dialogDetail"
      :dialogDetail.sync="dialogDetail"
      :contractDocuments.sync="contractDocuments"
      :checkValid.sync="checkValid"
      :contractDocument="contractDocument"
    />
    <CreateContractDocument
      v-if="dialogAddContractDocument"
      :dialogAdd.sync="dialogAddContractDocument"
      :contractDocuments.sync="contractDocuments"
      :totalItems.sync="contractDocumentServerSideOptions.totalItems"
      :contract="contract"
    />
    <CreateInvoice
      v-if="dialogAddInvoice"
      :dialogAdd.sync="dialogAddInvoice"
      :combined="combined"
      :update="false"
      :readonly="false"
    />
    <v-row justify="center">
      <UpdateContract
        v-if="dialogAdd"
        :combined="combined"
        :contract.sync="contract"
        :dialogAdd.sync="dialogAdd"
        :readonly="readonly"
        :totalItems.sync="serverSideOptions.totalItems"
      />
      <RatingContract
        v-if="dialogRating"
        :dialogRating.sync="dialogRating"
        :combined="combined"
      />
      <DetailInvoiceByContract
        v-if="dialogDetailInvoice"
        :dialogDetail.sync="dialogDetailInvoice"
        :contract="contract"
        :combined="combined"
      />
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IContract } from "@/entity/contract";
import { DataOptions } from "vuetify";
import { IContractDocument } from "@/entity/contract-document";
import { getContractDocumentsByContract } from "@/api/contract-document";
import { getCombineds } from "@/api/combined";
import { ICombined } from "@/entity/combined";
import DetailContractDocument from "../combined/components/DetailContractDocument.vue";
import UpdateContract from "./components/UpdateContract.vue";
import CreateInvoice from "../invoice/components/CreateInvoice.vue";
import CreateContractDocument from "../combined/components/CreateContractDocument.vue";
import Utils from "@/mixin/utils";
import ChipStatus from "@/components/ChipStatus.vue";
import RatingContract from "./components/RatingContract.vue";
import DetailInvoiceByContract from "../invoice/components/DetailInvoiceByContract.vue";

@Component({
  mixins: [Utils],
  components: {
    DetailContractDocument,
    UpdateContract,
    CreateInvoice,
    CreateContractDocument,
    ChipStatus,
    RatingContract,
    DetailInvoiceByContract
  }
})
export default class Contract extends Vue {
  combineds: Array<ICombined> = [];
  contract = null as IContract | null;
  combined = null as ICombined | null;
  dialogDetail = false;
  dialogAdd = false;
  dialogAddInvoice = false;
  dialogDetailInvoice = false;
  dialogAddContractDocument = false;
  dialogRating = false;
  loading = true;
  update = false;
  readonly = false;
  checkValid = false;
  expanded: Array<ICombined> = [];
  contractDocuments: Array<IContractDocument> = [];
  contractDocument = null as IContractDocument | null;
  singleExpand = true;
  options = {
    page: 1,
    itemsPerPage: 10
  } as DataOptions;
  serverSideOptions = {
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  contractDocumentOptions = {
    page: 1,
    itemsPerPage: 10
  } as DataOptions;
  contractDocumentServerSideOptions = {
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  headers = [
    {
      text: "Mã",
      align: "start",
      value: "id"
    },
    { text: "Bên chủ hàng", value: "contract.sender.companyName" },
    { text: "Bên chủ xe", value: "bid.bidder.companyName" },
    { text: "Giá hợp đồng", value: "contract.price" },
    { text: "Y/c hợp đồng", value: "contract.required" },
    { text: "Đã thanh toán (%)", value: "contract.paymentPercentage" },
    { text: "Ngày tạo hợp đồng", value: "contract.creationDate" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];
  contractDocumentHeaders = [
    {
      text: "Mã",
      align: "start",
      value: "id",
      class: "tertiary"
    },
    { text: "File hợp đồng", value: "documentPath", class: "tertiary" },
    {
      text: "Bên gửi hợp đồng",
      value: "sender.companyName",
      class: "tertiary"
    },
    { text: "Hợp lệ", value: "status", class: "tertiary" },
    { text: "Hành động", value: "actions", class: "tertiary" }
  ];

  openCreateInvoice(item: ICombined) {
    this.contract = item.contract as IContract;
    this.combined = item;
    this.dialogAddInvoice = true;
  }

  openDetailInvoice(item: ICombined) {
    this.contract = item.contract as IContract;
    this.combined = item;
    this.dialogDetailInvoice = true;
  }

  openDetailContractDocument(item: IContractDocument) {
    this.contractDocument = item;
    this.dialogDetail = true;
  }

  openCreateContractDocument(item: ICombined) {
    this.contract = item.contract as IContract;
    this.dialogAddContractDocument = true;
  }

  openUpdateDialog(item: ICombined) {
    this.contract = item.contract as IContract;
    this.combined = item;
    this.readonly = false;
    this.dialogAdd = true;
  }

  openDetailDialog(item: ICombined) {
    this.contract = item.contract as IContract;
    this.combined = item;
    this.readonly = true;
    this.dialogAdd = true;
  }

  openCreateRating(item: ICombined) {
    this.combined = item;
    this.dialogRating = true;
  }

  @Watch("options", { immediate: true })
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _res = await getCombineds({
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_res.data) {
        const _combineds = _res.data.data;
        this.combineds = _combineds;
        this.serverSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }

  @Watch("contractDocumentOptions")
  async onContractDocumentOptionsChange(val: DataOptions, oldVal: DataOptions) {
    if (typeof val != "undefined" && val.page != oldVal.page) {
      await this.loadMoreContractDocuments(val);
    }
  }

  async loadMoreContractDocuments(val: DataOptions) {
    if (this.contract) {
      this.loading = true;
      const _res = await getContractDocumentsByContract(
        this.contract.id as number,
        {
          page: val.page - 1,
          limit: val.itemsPerPage
        }
      );
      if (_res.data) {
        const _contractDocuments = _res.data.data;
        this.contractDocuments = _contractDocuments;
        this.contractDocumentServerSideOptions.totalItems =
          _res.data.totalElements;
      }
      this.loading = false;
    }
  }

  async clicked(value: ICombined) {
    if (this.singleExpand) {
      if (this.expanded.length > 0 && this.expanded[0].id === value.id) {
        this.expanded = [];
        this.contract = null;
      } else {
        if (this.expanded.length > 0) this.expanded = [];
        this.expanded.push(value);
        this.contract = value.contract as IContract;
        await this.loadMoreContractDocuments({
          ...this.contractDocumentOptions,
          page: 1
        });
      }
    }
  }
}
</script>
