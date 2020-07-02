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
        <v-btn icon dark @click="dialogAddSync = false">
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
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Tên đăng nhập"
                  name="username"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="supplier.username"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Email"
                  name="email"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="supplier.email"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Số điện thoại"
                  name="phone"
                  prepend-icon="mdi-lock"
                  type="number"
                  v-model="supplier.phone"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Quyền đăng ký"
                  name="role"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="role"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Địa chỉ"
                  name="address"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="supplier.address"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Mã công ty"
                  name="companyCode"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="supplier.companyCode"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Tên công ty"
                  name="companyName"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="supplier.companyName"
                  readonly
                >
                </v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Người liên hệ"
                  name="contactPerson"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="supplier.contactPerson"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Website"
                  name="website"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="supplier.website"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Tin"
                  name="tin"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="supplier.tin"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Fax"
                  name="fax"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="supplier.fax"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Mô tả"
                  name="companyDescription"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="supplier.companyDescription"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Địa chỉ công ty"
                  name="companyAddress"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="supplier.companyAddress"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { ISupplier } from "@/entity/supplier";
import { getSuppliersById } from "@/api/supplier";

@Component({
  name: "RequestDetail"
})
export default class RequestDetail extends Vue {
  @PropSync("dialog", { type: Boolean }) dialogSync!: boolean;

  supplier = {} as ISupplier;
  role = "";
  created() {
    getSuppliersById(this.$auth.user().id)
      .then(res => {
        const response: ISupplier = res.data;
        this.supplier = response;
        this.role = this.supplier.roles[0];
        console.log(this.supplier);
      })
      .catch(err => console.log(err))
      .finally();
  }
}
</script>
