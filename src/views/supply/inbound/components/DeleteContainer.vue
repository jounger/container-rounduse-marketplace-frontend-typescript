<template>
  <v-row justify="center">
    <v-dialog v-model="dialogDelContSync" persistent max-width="600px">
      <v-card>
        <v-toolbar color="primary" light flat>
          <v-toolbar-title
            ><span class="headline" style="color:white;">Xóa Container</span>
            <v-btn
              icon
              dark
              @click="dialogDelContSync = false"
              style="margin-left:369px;"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn></v-toolbar-title
          >
        </v-toolbar>

        <v-card-text>
          <v-form>
            <v-container>
              <span style="color: black; font-size:22px;"
                >Bạn có chắc chắn muốn xóa Container này?</span
              >
              <div class="line"></div>
              <v-list>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>{{
                      container.containerNumber
                    }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-container>
            <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
          </v-form>
        </v-card-text>
        <v-card-actions style="margin-left: 205px;">
          <v-btn @click="dialogDelContSync = false">Hủy</v-btn>
          <v-btn @click="removeContainer()" color="red">Xóa</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IContainer } from "@/entity/container";
import { removeContainer } from "@/api/container";
import { getErrorMessage } from "@/utils/tool";

@Component
export default class DeleteContainer extends Vue {
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("dialogDelCont", { type: Boolean }) dialogDelContSync!: boolean;
  @PropSync("containers", { type: Array }) containersSync!: Array<IContainer>;
  @Prop(Object) container!: IContainer;

  removeContainer() {
    // TODO
    if (this.container.id) {
      removeContainer(this.container.id)
        .then(res => {
          console.log(res.data);
          this.messageSync =
            "Xóa thành công Container: " + this.container.containerNumber;
          const index = this.containersSync.findIndex(
            x => x.id === this.container.id
          );
          this.containersSync.splice(index, 1);
        })
        .catch(err => {
          console.log(err);
          this.messageSync = getErrorMessage(err);
        })
        .finally(
          () => ((this.snackbarSync = true), (this.dialogDelContSync = false))
        );
    }
  }
}
</script>
