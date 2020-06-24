<template>
  <v-dialog v-model="dialogDelSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Xóa vai trò</span>
          <v-btn
            icon
            dark
            @click="dialogDelSync = false"
            style="margin-left:403px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
              >Bạn có chắc chắn muốn xóa vai trò này?</span
            >
            <div class="line"></div>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{
                    permissionSync.name
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogDelSync = false">Hủy</v-btn>
        <v-btn @click="removePermission()" color="red">Xóa</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { IPermission } from "@/entity/permission";
import { removePermission } from "@/api/permission";
import { getPermissions } from "@/api/permission";
import { PaginationResponse } from "@/api/payload";

@Component
export default class DialogDeletePermission extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("permission", { type: Object }) permissionSync!: IPermission;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("permissions", { type: Array }) permissionsSync!: Array<
    IPermission
  >;
  @PropSync("options", { type: Object }) optionsSync!: {
    descending: true;
    page: number;
    itemsPerPage: number;
    totalItems: number;
    itemsPerPageItems: Array<number>;
  };

  removePermission() {
    if (this.permissionSync.id) {
      removePermission(this.permissionSync.id)
        .then(res => {
          console.log(res.data);
          const response: IPermission = res.data;
          this.permissionSync = response;
          this.messageSync =
            "Xóa thành công vai trò: " + this.permissionSync.name;
          getPermissions({
            page: 0,
            limit: 5
          })
            .then(res => {
              const response: PaginationResponse<IPermission> = res.data;
              this.permissionsSync = response.data;
              this.optionsSync.totalItems = response.totalElements;
            })
            .catch(err => console.log(err))
            .finally();
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Error happend";
        })
        .finally(
          () => ((this.snackbarSync = true), (this.dialogDelSync = false))
        );
    }
  }
}
</script>
