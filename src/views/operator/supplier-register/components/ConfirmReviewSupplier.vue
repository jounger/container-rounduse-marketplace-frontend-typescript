<template>
  <v-dialog v-model="dialogConfirmSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            status == true
              ? "Xác nhận kích hoạt tài khoản người dùng"
              : "Xác nhận từ chối tài khoản người dùng"
          }}</span>
          <v-btn
            icon
            dark
            @click="dialogConfirmSync = false"
            style="margin-left:110px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
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
            <div class="line"></div>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ supplier.username }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
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

@Component
export default class ConfirmReviewSupplier extends Vue {
  @PropSync("dialogConfirm", { type: Boolean }) dialogConfirmSync!: boolean;
  @PropSync("messageSync", { type: String }) messageSyncSync!: string;
  @PropSync("snackbarSync", { type: Boolean }) snackbarSyncSync!: boolean;
  @PropSync("finish", { type: Boolean }) finishSync!: boolean;
  @PropSync("suppliersSync", { type: Array }) suppliersSyncSync!: Array<
    ISupplier
  >;
  @PropSync("totalItemsSync", { type: Number }) totalItemsSyncSync!: number;
  @Prop(Boolean) status!: boolean;
  @Prop(Object) supplier!: ISupplier;
  reviewSupplier(status: boolean) {
    if (this.supplier.id) {
      reviewSupplier(this.supplier.id, {
        status: status == true ? "ACTIVE" : "BANNED"
      })
        .then(res => {
          console.log(res.data);
          const response: ISupplier = res.data;
          this.messageSyncSync =
            response.status == "ACTIVE"
              ? "Kích hoạt thành công tài khoản: " + response.username
              : "Từ chối thành công tài khoản: " + response.username;
          const index = this.suppliersSyncSync.findIndex(
            x => x.id == response.id
          );
          this.suppliersSyncSync.splice(index, 1);
          this.totalItemsSyncSync -= 1;
          this.finishSync = true;
        })
        .catch(err => {
          console.log(err);
          this.messageSyncSync = "Đã có lỗi xảy ra";
        })
        .finally(
          () => (
            (this.snackbarSyncSync = true), (this.dialogConfirmSync = false)
          )
        );
    }
  }
}
</script>
