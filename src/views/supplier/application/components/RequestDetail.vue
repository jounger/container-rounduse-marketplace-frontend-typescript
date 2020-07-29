<template>
  <v-dialog
    v-model="dialogSync"
    persistent
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-btn icon dark @click="dialogSync = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title
          ><span class="headline" style="color:white;"
            >Chi tiết đơn đăng ký</span
          >
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialogSync = false">Trở về</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Tên đăng nhập"
                name="username"
                prepend-icon="mdi-account"
                type="text"
                v-model="supplier.username"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Email"
                name="email"
                prepend-icon="alternate_email"
                type="text"
                v-model="supplier.email"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Số điện thoại"
                name="phone"
                prepend-icon="phone"
                type="number"
                v-model="supplier.phone"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Quyền đăng ký"
                name="role"
                prepend-icon="security"
                type="text"
                v-model="role"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Địa chỉ"
                name="address"
                prepend-icon="location_on"
                type="text"
                v-model="supplier.address"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Mã công ty"
                name="companyCode"
                prepend-icon="verified_user"
                type="text"
                v-model="supplier.companyCode"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Tên công ty"
                name="companyName"
                prepend-icon="contacts"
                type="text"
                v-model="supplier.companyName"
                readonly
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Người liên hệ"
                name="contactPerson"
                prepend-icon="add_ic_call"
                type="text"
                v-model="supplier.contactPerson"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Mã số thuế"
                name="tin"
                prepend-icon="card_travel"
                type="number"
                v-model="supplier.tin"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Fax"
                name="fax"
                prepend-icon="perm_phone_msg"
                type="number"
                v-model="supplier.fax"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Website"
                name="website"
                prepend-icon="copyright"
                type="text"
                v-model="supplier.website"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Mô tả"
                name="companyDescription"
                prepend-icon="description"
                type="text"
                v-model="supplier.companyDescription"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Địa chỉ công ty"
                name="companyAddress"
                prepend-icon="room"
                type="text"
                v-model="supplier.companyAddress"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { ISupplier } from "@/entity/supplier";
import { getSupplier } from "@/api/supplier";
import snackbar from "@/store/modules/snackbar";
import { getErrorMessage } from "@/utils/tool";

@Component({
  name: "RequestDetail"
})
export default class RequestDetail extends Vue {
  @PropSync("dialog", { type: Boolean }) dialogSync!: boolean;

  supplier = {} as ISupplier;
  role = "";
  async created() {
    const _supplier = await getSupplier(this.$auth.user().username)
      .then(res => {
        const response: ISupplier = res.data;
        return response;
      })
      .catch(err => {
        console.log(err);
        snackbar.setSnackbar({
          text: getErrorMessage(err),
          color: "error"
        });
        snackbar.setDisplay(true);
        return null;
      });
    if (_supplier) {
      this.supplier = _supplier;
      this.role = _supplier.roles[0];
    }
  }
}
</script>
