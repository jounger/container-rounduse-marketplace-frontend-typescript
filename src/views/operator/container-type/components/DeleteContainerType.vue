<template>
  <v-dialog v-model="dialogDelSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Xóa loại Container</span>
          <v-btn
            icon
            dark
            @click="dialogDelSync = false"
            style="margin-left:324px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
              >Bạn có chắc chắn muốn xóa loại Container này?</span
            >
            <div class="line"></div>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{
                    containerTypeSync.name
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
        <v-btn @click="removeContainerType()" color="red">Xóa</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { IContainerType } from "@/entity/container-type";
import { removeContainerType } from "@/api/container-type";
import { getContainerTypes } from "@/api/container-type";
import { PaginationResponse } from "@/api/payload";

@Component
export default class DialogDeleteContainerType extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("containerType", { type: Object })
  containerTypeSync!: IContainerType;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("containerTypes", { type: Array }) containerTypesSync!: Array<
    IContainerType
  >;
  @PropSync("options", { type: Object }) optionsSync!: {
    descending: true;
    page: number;
    itemsPerPage: number;
    totalItems: number;
    itemsPerPageItems: Array<number>;
  };

  removeContainerType() {
    if (this.containerTypeSync.id) {
      removeContainerType(this.containerTypeSync.id)
        .then(res => {
          console.log(res.data);
          const response: IContainerType = res.data;
          this.containerTypeSync = response;
          this.messageSync =
            "Xóa thành công loại Container: " + this.containerTypeSync.name;
          getContainerTypes({
            page: 0,
            limit: 5
          })
            .then(res => {
              const response: PaginationResponse<IContainerType> = res.data;
              this.containerTypesSync = response.data;
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
