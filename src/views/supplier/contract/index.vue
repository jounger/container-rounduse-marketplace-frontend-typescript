<template>
  <v-content>
    <v-card class="ma-5">
      <DetailEvidence
        v-if="dialogDetail"
        :dialogDetail.sync="dialogDetail"
        :evidences.sync="evidences"
        :checkValid.sync="checkValid"
        :finalEvidence="finalEvidence"
        :evidence="evidence"
      />
      <CreatePayment
        v-if="dialogAddPayment"
        :dialogAddPayment.sync="dialogAddPayment"
        :contract="contract"
        :update="false"
      />
      <v-row justify="center">
        <DeleteContract
          :dialogDel.sync="dialogDel"
          :contract="contract"
          :contracts.sync="contracts"
          :totalItems.sync="serverSideOptions.totalItems"
        />
      </v-row>
      <v-row justify="center">
        <UpdateContract
          v-if="dialogAdd"
          :contract="contract"
          :contracts.sync="contracts"
          :dialogAdd.sync="dialogAdd"
          :totalItems.sync="serverSideOptions.totalItems"
        />
      </v-row>
      <v-data-table
        :headers="headers"
        :items="combineds"
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        show-expand
        @click:row="clicked"
        :loading="loading"
        :options.sync="options"
        :server-items-length="serverSideOptions.totalItems"
        :footer-props="{
          'items-per-page-options': serverSideOptions.itemsPerPageItems
        }"
        :actions-append="options.page"
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
              <v-btn color="pink" icon outlined v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="openCreatePayment(item)">
                <v-list-item-icon>
                  <v-icon small>add</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Tạo hóa đơn</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="openUpdateDialog(item)">
                <v-list-item-icon>
                  <v-icon small>edit</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Chỉnh sửa</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <template v-slot:item.merchant="{}">
          {{
            $auth.user().roles == "ROLE_MERCHANT" ? $auth.user().username : ""
          }}
        </template>
        <template v-slot:item.forwarder="{ item }">
          {{
            $auth.user().roles == "ROLE_FORWARDER"
              ? $auth.user().username
              : item.bid.bidder
          }}
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
                  <v-icon left>library_add_check </v-icon>Chi tiết
                </v-btn>
              </template>
              <template v-slot:item.isValid="{ item }">
                {{ item.isValid ? "Đã xác nhận" : "Chưa xác nhận" }}
              </template>
              <template v-slot:footer>
                <v-row justify="center">
                  <v-btn
                    class="ma-1"
                    tile
                    color="success"
                    @click.stop="openCreateEvidence()"
                    small
                    v-if="$auth.user().roles[0] == 'ROLE_FORWARDER'"
                  >
                    <span style="color:white;">Thêm Chứng cứ</span>
                  </v-btn>
                </v-row>
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
import DeleteContract from "./components/DeleteContract.vue";
import { PaginationResponse } from "@/api/payload";
import { DataOptions } from "vuetify";
import { IEvidence } from "@/entity/evidence";
import { getEvidencesByContract } from "@/api/evidence";
import { getCombinedsByUser } from "@/api/combined";
import { ICombined } from "@/entity/combined";
import DetailEvidence from "../combined/components/DetailEvidence.vue";
import UpdateContract from "./components/UpdateContract.vue";
import CreatePayment from "../payment/components/CreatePayment.vue";

@Component({
  components: {
    DeleteContract,
    DetailEvidence,
    UpdateContract,
    CreatePayment
  }
})
export default class Contract extends Vue {
  contracts: Array<IContract> = [];
  combineds: Array<ICombined> = [];
  contract = {} as IContract;
  dialogDetail = false;
  dialogAdd = false;
  dialogAddPayment = false;
  dialogDel = false;
  checkValid = false;
  finalEvidence = false;
  loading = true;
  update = false;
  expanded: Array<IContract> = [];
  evidences: Array<IEvidence> = [];
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
    { text: "Bên chủ hàng", value: "merchant" },
    { text: "Bên chủ xe", value: "forwarder" },
    {
      text: "% Tiền phạt",
      value: "contract.finesAgainstContractViolation"
    },
    { text: "Hợp lệ", value: "isValid" },
    { text: "Bắt buộc", value: "contract.required" },
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
    { text: "Chứng cớ", value: "evidence", class: "elevation-1 primary" },
    { text: "Hợp lệ", value: "isValid", class: "elevation-1 primary" },
    {
      text: "Actions",
      value: "actions",
      sortable: false,
      class: "elevation-1 primary"
    }
  ];
  openCreatePayment(item: ICombined) {
    this.contract = item.contract as IContract;
    this.dialogAddPayment = true;
  }
  openDetailEvidence(item: IEvidence) {
    this.finalEvidence = false;
    this.evidence = item;
    const index = this.evidences.findIndex((x: IEvidence) => x.id == item.id);
    if (index == 0) {
      this.finalEvidence = true;
    }
    this.dialogDetail = true;
  }
  openCreateDialog() {
    this.contract = {} as IContract;
    this.update = false;
    this.dialogAdd = true;
  }

  openUpdateDialog(item: ICombined) {
    console.log(item);
    this.contract = item.contract as IContract;
    this.dialogAdd = true;
  }

  openDeleteDialog(item: IContract) {
    this.contract = item;
    this.dialogDel = true;
  }
  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _combineds = await getCombinedsByUser({
        page: val.page - 1,
        limit: val.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<ICombined> = res.data;
          console.log("watch", response);
          return response;
        })
        .catch(err => {
          console.log(err);
          return null;
        });
      if (_combineds) {
        this.combineds = _combineds.data;
        this.serverSideOptions.totalItems = _combineds.totalElements;
      }
      this.loading = false;
    }
  }
  @Watch("evidenceOptions")
  async onEvidenceOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      if (this.contract && this.contract.id) {
        const _evidences = await getEvidencesByContract(this.contract.id, {
          page: val.page - 1,
          limit: val.itemsPerPage
        })
          .then(res => {
            const response: PaginationResponse<IEvidence> = res.data;
            return response;
          })
          .catch(err => {
            console.log(err);
            return null;
          });
        if (_evidences) {
          this.evidences = _evidences.data;
          this.evidenceServerSideOptions.totalItems = _evidences.totalElements;
          if (this.evidences.length > 0 && this.evidences[0].isValid == true) {
            this.checkValid = true;
          }
        }
      }
      this.loading = false;
    }
  }
  async clicked(value: IContract) {
    if (this.singleExpand) {
      if (this.expanded.length > 0 && this.expanded[0].id === value.id) {
        this.expanded.splice(0, this.expanded.length);
        this.contract = {} as IContract;
      } else {
        if (this.expanded.length > 0) {
          this.expanded.splice(0, this.expanded.length);
          this.expanded.push(value);
          this.contract = value;
          await this.onEvidenceOptionsChange(this.evidenceOptions);
        } else {
          this.expanded.push(value);
          this.contract = value;
        }
      }
    }
  }
}
</script>
