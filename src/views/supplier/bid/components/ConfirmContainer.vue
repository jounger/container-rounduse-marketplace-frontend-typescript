<template>
  <v-dialog v-model="dialogConfirmSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;"
            >Xác nhận bỏ chọn Container</span
          ></v-toolbar-title
        >
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
              >Bạn có chắc chắn muốn bỏ chọn Container này?</span
            >
            <v-divider class="mt-3"></v-divider>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ container.id }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogConfirmSync = false">Hủy</v-btn>
        <v-btn @click="confirmContainer()" color="error">Bỏ chọn</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { getErrorMessage } from "@/utils/tool";
import snackbar from "@/store/modules/snackbar";
import { IContainer } from "@/entity/container";
import { IBid } from "@/entity/bid";
import { removeContainer } from "@/api/bid";

@Component
export default class ConfirmContainer extends Vue {
  @PropSync("dialogConfirm", { type: Boolean }) dialogConfirmSync!: boolean;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @PropSync("containersSelected", { type: Array })
  containersSelectedSync!: Array<IContainer>;
  @Prop(Object) container!: IContainer;
  @Prop(Object) bid!: IBid;

  async confirmContainer() {
    if (this.container.id && this.bid.id) {
      const _bid = await removeContainer(this.bid.id, this.container.id)
        .then(res => {
          const response: IBid = res.data;
          snackbar.setSnackbar({
            text:
              "Xóa thành công Container " +
              this.container.containerNumber +
              " khỏi HSDT " +
              this.bid.id,
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
      snackbar.setDisplay(true);
      if (_bid) {
        const index = this.containersSelectedSync.findIndex(
          x => x.containerNumber == this.container.containerNumber
        );
        this.containersSelectedSync.splice(index, 1);
        this.totalItemsSync -= 1;
        this.dialogConfirmSync = false;
      }
    }
  }
}
</script>
