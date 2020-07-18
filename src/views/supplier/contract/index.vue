<template>
  <v-content>
    <v-card>
      <v-row justify="center">
        <DeleteContract
          :dialogDel.sync="dialogDel"
          :contract="contract"
          :contracts.sync="contracts"
          :totalItems.sync="serverSideOptions.totalItems"
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
          :totalItems.sync="serverSideOptions.totalItems"
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
        :server-items-length="serverSideOptions.totalItems"
        :footer-props="{
          'items-per-page-options': serverSideOptions.itemsPerPageItems
        }"
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
        <template v-slot:item.sender="{}">
          {{ $auth.user().username }}
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
import { getContractsByUser } from "@/api/contract";
import { DataOptions } from "vuetify";

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
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  serverSideOptions = {
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  headers = [
    {
      text: "Mã",
      align: "start",
      value: "id"
    },
    { text: "Người gửi", value: "sender" },
    {
      text: "% Tiền phạt",
      value: "finesAgainstContractViolation"
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

  @Watch("options")
  onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      getContractsByUser({
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IContract> = res.data;
          console.log("watch", response);
          this.contracts = response.data;
          this.serverSideOptions.totalItems = response.totalElements;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    }
  }
}
</script>
