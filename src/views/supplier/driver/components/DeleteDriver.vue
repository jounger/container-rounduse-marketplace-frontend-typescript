<template>
  <v-dialog v-model="dialogDelSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Xóa lái xe</span>
          <v-btn
            icon
            dark
            @click="dialogDelSync = false"
            style="margin-left:417px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
              >Bạn có chắc chắn muốn xóa lái xe này?</span
            >
            <div class="line"></div>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ driver.username }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogDelSync = false">Hủy</v-btn>
        <v-btn @click="removeDriver()" color="red">Xóa</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IDriver } from "@/entity/driver";
import { removeDriver } from "@/api/driver";
import { getErrorMessage } from "@/utils/tool";

@Component
export default class DeleteDriver extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("drivers", { type: Array }) driversSync!: Array<IDriver>;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) driver!: IDriver;

  removeDriver() {
    if (this.driver.id) {
      removeDriver(this.driver.id)
        .then(res => {
          console.log(res.data);
          const response: IDriver = res.data;
          this.messageSync = "Xóa thành công mã lái xe: " + this.driver.username;
          const index = this.driversSync.findIndex(x => x.id === response.id);
          this.driversSync.splice(index, 1);
          this.totalItemsSync -= 1;
        })
        .catch(err => {
          console.log(err);
          this.messageSync = getErrorMessage(err);
        })
        .finally(
          () => ((this.snackbarSync = true), (this.dialogDelSync = false))
        );
    }
  }
}
</script>
