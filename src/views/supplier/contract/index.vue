<template>
  <v-content>
    <v-card>
      <v-row justify="center">
        <DeleteContract
          :dialogDel.sync="dialogDel"
          :contract="contract"
          :contracts.sync="contracts"
          :totalItems.sync="options.totalItems"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <v-row justify="center">
        <CreateContract
          v-if="dialogAdd"
          :contract="contract"
          :contracts.sync="contracts"
          :dialogAdd.sync="dialogAdd"
          :message.sync="message"
          :totalItems.sync="options.totalItems"
          :snackbar.sync="snackbar"
          :update="update"
        />
      </v-row>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <v-data-table
        :headers="headers"
        :items="contracts"
        :search="search"
        :loading="loading"
        :options.sync="options"
        :server-items-length="options.totalItems"
        :footer-props="{ 'items-per-page-options': options.itemsPerPageItems }"
        :actions-append="options.page"
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
          <v-icon small class="mr-2" @click="openUpdateDialog(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="openDeleteDialog(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IContract } from "@/entity/contract";
import CreateContract from "./components/CreateContract.vue";
import DeleteContract from "./components/DeleteContract.vue";
// import { getContracts } from "@/api/contract";
import { PaginationResponse } from "@/api/payload";
import Snackbar from "@/components/Snackbar.vue";
import { ContractData } from "./data";
import { searchContracts, getContractsByUser } from "@/api/contract";

@Component({
  components: {
    CreateContract,
    DeleteContract,
    Snackbar
  }
})
export default class Contract extends Vue {
  contracts: Array<IContract> = [];
  contract = {} as IContract;
  dialogAdd = false;
  dialogDel = false;
  search = "";
  roleSearch = "";
  message = "";
  snackbar = false;
  loading = true;
  update = false;
  options = {
    descending: true,
    page: 1,
    itemsPerPage: 5,
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  headers = [
    {
      text: "Mã",
      align: "start",
      value: "id"
    },
    { text: "Người gửi", value: "evidence.sender" },
    {
      text: "% Tiền phạt",
      value: "finesAgainstContractViolations"
    },
    { text: "Chứng cớ", value: "evidence.evidence" },
    { text: "Hợp lệ", value: "evidence.isValid" },
    { text: "Bắt buộc", value: "required" },
    {
      text: "Hành động",
      value: "actions",
      sortable: false
    }
  ];
  openCreateDialog() {
    this.contract = {} as IContract;
    this.update = false;
    this.dialogAdd = true;
  }

  openUpdateDialog(item: IContract) {
    console.log(item);
    this.contract = item;
    this.update = true;
    this.dialogAdd = true;
  }

  openDeleteDialog(item: IContract) {
    this.contract = item;
    this.dialogDel = true;
  }

  @Watch("options", { deep: true })
  onOptionsChange(val: object, oldVal: object) {
    if (val !== oldVal) {
      getContractsByUser({
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IContract> = res.data;
          console.log("watch", response);
          this.contracts = response.data;
          this.options.totalItems = response.totalElements;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    }
  }
}
</script>
<style type="text/css">
.line {
  margin-top: 10px;
  width: 520px;
  border-bottom: 1px solid black;
  position: absolute;
}
</style>