<template>
  <v-dialog
    v-model="dialogSync"
    persistent
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <v-toolbar dark color="primary">
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
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Email"
                name="email"
                prepend-icon="alternate_email"
                type="text"
                v-model="supplier.email"
                disabled
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
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Quyền đăng ký"
                name="role"
                prepend-icon="security"
                type="text"
                v-model="role"
                disabled
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
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Mã công ty"
                name="companyCode"
                prepend-icon="verified_user"
                type="text"
                v-model="supplier.companyCode"
                disabled
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
                disabled
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Người liên hệ"
                name="fullname"
                prepend-icon="add_ic_call"
                type="text"
                v-model="supplier.fullname"
                disabled
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
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Fax"
                name="fax"
                prepend-icon="perm_phone_msg"
                type="number"
                v-model="supplier.fax"
                disabled
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
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Mô tả"
                name="companyDescription"
                prepend-icon="description"
                type="text"
                v-model="supplier.companyDescription"
                disabled
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
                disabled
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

@Component
export default class RequestDetail extends Vue {
  @PropSync("dialog", { type: Boolean }) dialogSync!: boolean;

  supplier = null as ISupplier | null;
  role = "";

  async created() {
    const _res = await getSupplier(this.$auth.user().username);
    if (_res.data) {
      const _supplier = _res.data;
      this.supplier = _supplier;
      this.role = _supplier.roles[0];
    }
  }
}
</script>
