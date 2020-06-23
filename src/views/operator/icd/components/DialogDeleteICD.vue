<template>
  <v-dialog v-model="dialogDelSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Xóa bến cảng</span>
          <v-btn
            icon
            dark
            @click="dialogDelSync = false"
            style="margin-left:374px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
              >Bạn có chắc chắn muốn xóa bến cảng này?</span
            >
            <div class="line"></div>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ icdSync.fullname }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogDelSync = false">Hủy</v-btn>
        <v-btn @click="removeIcd()" color="red">Xóa</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { IIcd } from "@/entity/icd";
import { removeIcd } from "@/api/icd";
import { getIcds } from "@/api/icd";
import { PaginationResponse } from "@/api/payload";

@Component
export default class DialogDeleteIcd extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("icd", { type: Object }) icdSync!: IIcd;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("icds", { type: Array }) icdsSync!: Array<IIcd>;
  @PropSync("options", { type: Object }) optionsSync!: {
    descending: true;
    page: number;
    itemsPerPage: number;
    totalItems: number;
    itemsPerPageItems: Array<number>;
  };

  removeIcd() {
    if (this.icdSync.id) {
      removeIcd(this.icdSync.id)
        .then(res => {
          console.log(res.data);
          const response: IIcd = res.data;
          this.icdSync = response;
          this.messageSync = "Xóa thành công ICD: " + this.icdSync.fullname;
          getIcds({
            page: 0,
            limit: 5
          })
            .then(res => {
              const response: PaginationResponse<IIcd> = res.data;
              this.icdsSync = response.data;
              this.optionsSync.totalItems = response.total_elements;
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
