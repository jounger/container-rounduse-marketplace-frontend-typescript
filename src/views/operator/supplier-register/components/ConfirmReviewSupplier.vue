<template>
  <v-dialog v-model="dialogConfirmSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            status == true
              ? "Xác nhận kích hoạt tài khoản người dùng"
              : "Xác nhận từ chối tài khoản người dùng"
          }}</span></v-toolbar-title
        >
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
              >Bạn có chắc chắn muốn
              {{ status == true ? "kích hoạt" : "từ chối" }} tài khoản
              này?</span
            >
            <v-divider class="mt-3"></v-divider>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ supplier.username }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogConfirmSync = false">Hủy</v-btn>
        <v-btn @click="reviewSupplier(status)" color="green" v-if="status"
          ><span style="color: white;">Đồng ý</span></v-btn
        >
        <v-btn @click="reviewSupplier(status)" color="red" v-else
          ><span style="color: white;">Từ chối</span></v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { ISupplier } from "@/entity/supplier";
import { reviewSupplier } from "@/api/supplier";
import snackbar from "@/store/modules/snackbar";
import { getErrorMessage } from "@/utils/tool";

@Component
export default class ConfirmReviewSupplier extends Vue {
  @PropSync("dialogConfirm", { type: Boolean }) dialogConfirmSync!: boolean;
  @PropSync("dialogDetail", { type: Boolean }) dialogDetailSync!: boolean;
  @PropSync("suppliers", { type: Array }) suppliersSync!: Array<ISupplier>;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Boolean) status!: boolean;
  @Prop(Object) supplier!: ISupplier;

  async reviewSupplier(status: boolean) {
    if (this.supplier.id) {
      const _supplier = await reviewSupplier(this.supplier.id, {
        status: status == true ? "ACTIVE" : "BANNED"
      })
        .then(res => {
          console.log(res.data);
          const response: ISupplier = res.data;
          snackbar.setSnackbar({
            text:
              response.status == "ACTIVE"
                ? "Kích hoạt thành công tài khoản: " + response.username
                : "Từ chối thành công tài khoản: " + response.username,
            color: "success"
          });
          return response;
        })
        .catch(err => {
          console.log(err);
          snackbar.setSnackbar({
            text: getErrorMessage(err),
            color: "error"
          });
          return null;
        });
      if (_supplier) {
        const index = this.suppliersSync.findIndex(x => x.id == _supplier.id);
        this.suppliersSync.splice(index, 1);
        this.totalItemsSync -= 1;
        this.dialogConfirmSync = false;
        this.dialogDetailSync = false;
      }
      snackbar.setDisplay(true);
    }
  }
}
</script>
