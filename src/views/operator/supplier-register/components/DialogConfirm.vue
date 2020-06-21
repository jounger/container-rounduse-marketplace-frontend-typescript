<template>
  <v-dialog v-model="dialogSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{ title }}</span>
          <v-btn
            icon
            dark
            @click="dialogSync = false"
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
              >Bạn có chắc chắn muốn {{ status }} đơn đăng ký này?</span
            >
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogSync = false">Trở về</v-btn>
        <v-btn @click="del()" color="red" v-if="checkDestroy">Hủy bỏ</v-btn>
        <v-btn @click="accept()" color="green" v-if="checkAcc">Chấp nhận</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";

@Component({
  name: "DialogConfirm"
})
export default class DialogConfirm extends Vue {
  // @Prop() selected!: Array<object>;
  @PropSync("dialogConfirm", { type: Boolean }) dialogSync!: boolean;
  @PropSync("dialogDetail", { type: Boolean }) dialogDetailSync!: boolean;
  @PropSync("checkSuccess", { type: Boolean }) checkSuccessSync!: boolean;
  @PropSync("success", { type: String }) successSync!: string | null;
  @Prop(Boolean) checkDestroy!: boolean;
  @Prop(Boolean) checkAcc!: boolean;
  @Prop(String) status!: string | null;
  @Prop(String) name!: string | null;
  @Prop(String) title!: string | null;

  public del() {
    this.successSync = "Hủy bỏ hành công!";
    this.checkSuccessSync = true;
    this.dialogSync = false;
    this.dialogDetailSync = false;
  }
  public accept() {
    this.successSync = "Chấp nhận thành công!";
    this.checkSuccessSync = true;
    this.dialogSync = false;
    this.dialogDetailSync = false;
  }
}
</script>
