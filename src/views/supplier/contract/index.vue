<template>
  <v-content>
    <v-card class="ma-5">
      <DetailEvidence
        v-if="dialogDetail"
        :dialogDetail.sync="dialogDetail"
        :evidences.sync="evidences"
        :checkValid.sync="checkValid"
        :evidence="evidence"
      />
      <CreateEvidence
        v-if="dialogAddEvidence"
        :dialogAdd.sync="dialogAddEvidence"
        :evidences.sync="evidences"
        :totalItems.sync="evidenceServerSideOptions.totalItems"
        :contract="contract"
      />
      <CreatePayment
        v-if="dialogAddPayment"
        :dialogAdd.sync="dialogAddPayment"
        :combined="combined"
        :merchant="merchant"
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
          :merchant="merchant"
          :totalItems.sync="serverSideOptions.totalItems"
        />
      </v-row>
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
        no-data-text="Danh sách Hợp đồng rỗng."
        disable-sort
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title style="font-weight:bold; font-size: 25px;"
              >Danh sách Hợp đồng</v-toolbar-title
            >
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
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
              <v-list-item @click="openCreatePayment(item)">
                <v-list-item-icon>
                  <v-icon small>add</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Tạo hóa đơn</v-list-item-title>
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
                @click="openDetailDialog(item)"
                v-if="$auth.check('ROLE_FORWARDER')"
              >
                <v-list-item-icon>
                  <v-icon small>details</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Xem chi tiết</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="openCreateEvidence(item)"
                v-if="$auth.check('ROLE_FORWARDER')"
              >
                <v-list-item-icon>
                  <v-icon small>cloud_upload</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Tải lên hợp đồng</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <template v-slot:item.contract.price="{ item }">
          {{ currencyFormatter(item.contract.price) }}
        </template>
        <template v-slot:item.contract.required="{ item }">
          {{ item.contract.required ? "Có" : "Không" }}
        </template>
        <template v-slot:expanded-item="{ headers }">
          <td :colspan="headers.length" class="px-0">
            <v-data-table
              :headers="evidenceHeaders"
              :items="evidences"
              :loading="loading"
              :options.sync="evidenceOptions"
              :server-items-length="evidenceServerSideOptions.totalItems"
              :footer-props="{
                'items-per-page-options':
                  evidenceServerSideOptions.itemsPerPageItems
              }"
              :actions-append="evidenceOptions.page"
              disable-sort
              dense
              dark
              ><template v-slot:item.actions="{ item }">
                <v-btn
                  class="ma-1"
                  x-small
                  tile
                  outlined
                  color="success"
                  @click.stop="openDetailEvidence(item)"
                >
                  <v-icon left dense>details </v-icon>Chi tiết
                </v-btn>
              </template>
              <template v-slot:item.documentPath="{ item }">
                <v-icon>picture_as_pdf</v-icon>
                {{
                  item.documentPath
                    ? item.documentPath.split("/")[4].substring(14)
                    : "N/A"
                }}
              </template>
              <template v-slot:item.status="{ item }">
                <v-chip dark x-small>{{ item.status }}</v-chip>
              </template>
            </v-data-table>
          </td>
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IContract } from "@/entity/contract";
import { DataOptions } from "vuetify";
import { IEvidence } from "@/entity/evidence";
import { getEvidencesByContract } from "@/api/evidence";
import { getCombineds } from "@/api/combined";
import { ICombined } from "@/entity/combined";
import DetailEvidence from "../combined/components/DetailEvidence.vue";
import UpdateContract from "./components/UpdateContract.vue";
import CreatePayment from "../payment/components/CreatePayment.vue";
import CreateEvidence from "../combined/components/CreateEvidence.vue";
import Utils from "@/mixin/utils";

@Component({
  mixins: [Utils],
  components: {
    DetailEvidence,
    UpdateContract,
    CreatePayment,
    CreateEvidence
  }
})
export default class Contract extends Vue {
  combineds: Array<ICombined> = [];
  contract = null as IContract | null;
  combined = null as ICombined | null;
  dialogDetail = false;
  dialogAdd = false;
  dialogAddPayment = false;
  dialogAddEvidence = false;
  loading = true;
  update = false;
  readonly = false;
  checkValid = false;
  expanded: Array<ICombined> = [];
  evidences: Array<IEvidence> = [];
  merchants: Array<string> = [];
  merchant = "";
  evidence = null as IEvidence | null;
  singleExpand = true;
  options = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  serverSideOptions = {
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  evidenceOptions = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  evidenceServerSideOptions = {
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
    { text: "Y/c hợp đồng", value: "contract.required" },
    { text: "Giá hợp đồng", value: "contract.price" },
    {
      text: "% Tiền phạt",
      value: "contract.finesAgainstContractViolation"
    },
    {
      text: "Hành động",
      value: "actions",
      sortable: false
    }
  ];
  evidenceHeaders = [
    {
      text: "Mã",
      align: "start",
      value: "id",
      class: "elevation-1 primary"
    },
    { text: "Chứng cớ", value: "documentPath", class: "elevation-1 primary" },
    {
      text: "Bên gửi hợp đồng",
      value: "sender.companyName",
      class: "elevation-1 primary"
    },
    { text: "Hợp lệ", value: "status", class: "elevation-1 primary" },
    {
      text: "Hành động",
      value: "actions",
      sortable: false,
      class: "elevation-1 primary"
    }
  ];

  openCreatePayment(item: ICombined) {
    this.contract = item.contract as IContract;
    this.combined = item;
    const index = this.combineds.findIndex((x: ICombined) => x.id == item.id);
    this.merchant = this.merchants[index];
    this.dialogAddPayment = true;
  }

  openDetailEvidence(item: IEvidence) {
    this.evidence = item;
    this.dialogDetail = true;
  }

  openCreateEvidence(item: ICombined) {
    this.contract = item.contract as IContract;
    this.dialogAddEvidence = true;
  }

  openUpdateDialog(item: ICombined) {
    this.contract = item.contract as IContract;
    this.combined = item;
    const index = this.combineds.findIndex((x: ICombined) => x.id == item.id);
    this.merchant = this.merchants[index];
    this.readonly = false;
    this.dialogAdd = true;
  }

  openDetailDialog(item: ICombined) {
    this.contract = item.contract as IContract;
    this.combined = item;
    const index = this.combineds.findIndex((x: ICombined) => x.id == item.id);
    this.merchant = this.merchants[index];
    this.readonly = true;
    this.dialogAdd = true;
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

  @Watch("evidenceOptions")
  async onEvidenceOptionsChange(val: DataOptions) {
    if (typeof val != "undefined" && this.contract) {
      this.loading = true;
      const _res = await getEvidencesByContract(this.contract.id as number, {
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_res.data) {
        const _evidences = _res.data.data;
        this.evidences = _evidences;
        this.evidenceServerSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }

  async clicked(value: ICombined) {
    if (this.singleExpand) {
      if (this.expanded.length > 0 && this.expanded[0].id === value.id) {
        this.expanded.splice(0, this.expanded.length);
        this.contract = {} as IContract;
      } else {
        if (this.expanded.length > 0) {
          this.expanded.splice(0, this.expanded.length);
          if (value.contract) {
            this.expanded.push(value);
            this.contract = value.contract;
            this.evidenceOptions.page = 1;
            await this.onEvidenceOptionsChange(this.evidenceOptions);
          }
        } else {
          if (value.contract) {
            this.expanded.push(value);
            this.contract = value.contract;
          }
        }
      }
    }
  }
}
</script>
