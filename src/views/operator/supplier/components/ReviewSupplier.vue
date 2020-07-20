<template>
  <v-dialog v-model="dialogReviewSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            supplier.status == "ACTIVE" ? "Khóa tài khoản" : "Mở khóa tài khoản"
          }}</span>
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="12" md="11">
              <v-text-field
                label="Tên đăng nhập"
                name="username"
                prepend-icon="mdi-account"
                type="text"
                v-model="supplier.username"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row v-if="supplier.status == 'ACTIVE'">
            <v-col cols="12" md="11">
              <v-text-field
                label="Lý do khóa tài khoản"
                name="reason"
                prepend-icon="comment"
                type="text"
                v-model="reason"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogReviewSync = false">Hủy</v-btn>
        <v-btn
          @click="reviewSupplier('BANNED')"
          color="red"
          v-if="supplier.status == 'ACTIVE'"
          :disabled="finish"
          ><span style="color:white;">Khóa tài khoản</span></v-btn
        >
        <v-btn
          @click="reviewSupplier('ACTIVE')"
          color="green"
          v-if="supplier.status == 'BANNED'"
          :disabled="finish"
          ><span style="color:white;">Mở khóa</span></v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { ISupplier } from "@/entity/supplier";
import { reviewSupplier } from "@/api/supplier";
import { getErrorMessage } from "@/utils/tool";
import snackbar from "@/store/modules/snackbar";

@Component
export default class ReviewSupplier extends Vue {
  @PropSync("dialogReview", { type: Boolean }) dialogReviewSync!: boolean;
  @PropSync("suppliers", { type: Array }) suppliersSync!: Array<ISupplier>;
  @Prop(Object) supplier!: ISupplier;

  reason = "";
  finish = false;
  async reviewSupplier(status: string) {
    if (this.supplier.id) {
      const _supplier = await reviewSupplier(this.supplier.id, {
        status: status
      })
        .then(res => {
          console.log(res.data);
          const response: ISupplier = res.data;
          snackbar.setSnackbar({
            text:
              response.status == "ACTIVE"
                ? "Mở khóa thành công tài khoản: " + response.username
                : "Khóa thành công tài khoản: " + response.username,
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
        this.suppliersSync.splice(index, 1, _supplier);
        this.finish = true;
      }
      snackbar.setDisplay(true);
    }
  }
}
</script>
