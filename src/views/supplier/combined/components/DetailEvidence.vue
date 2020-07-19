<template>
  <v-dialog v-model="dialogDetailSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Chi tiết Chứng cứ</span>
          <v-btn
            icon
            dark
            @click="dialogDetailSync = false"
            style="margin-left:335px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="12" md="11">
              <v-text-field
                label="Người gửi"
                name="sender"
                prepend-icon="person"
                type="text"
                readonly
                v-model="evidence.sender"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="11">
              <v-textarea
                label="Chứng cứ"
                name="evidence"
                prepend-icon="description"
                outlined
                readonly
                v-model="evidence.evidence"
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="11">
              <span style="color: green" v-if="evidence.isValid"
                >Đã xác nhận
              </span>
              <span style="color: red" v-else>Chưa xác nhận </span>
            </v-col>
          </v-row>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogDetailSync = false">Trở về</v-btn>
        <v-btn
          @click="reviewEvidence(false)"
          color="red"
          v-if="
            $auth.user().roles[0] == 'ROLE_MERCHANT' &&
              evidence.isValid == false
          "
          >Từ chối</v-btn
        >
        <v-btn
          @click="reviewEvidence(true)"
          color="green"
          v-if="
            $auth.user().roles[0] == 'ROLE_MERCHANT' &&
              evidence.isValid == false
          "
          >Đồng ý</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IEvidence } from "@/entity/evidence";
import { editEvidence } from "@/api/evidence";
import { getErrorMessage } from "@/utils/tool";

@Component
export default class DetailEvidence extends Vue {
  @PropSync("dialogDetail", { type: Boolean }) dialogDetailSync!: boolean;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("evidences", { type: Array }) evidencesSync!: Array<IEvidence>;
  @Prop(Object) evidence!: IEvidence;

  reviewEvidence(isValid: boolean) {
    if (this.evidence.id) {
      editEvidence(this.evidence.id, { isValid: isValid })
        .then(res => {
          const response = res.data;
          this.messageSync = isValid
            ? "Đồng ý thành công chứng cứ: " + response.id
            : "Từ chối thành công chứng cứ: " + response.id;
          const index = this.evidencesSync.findIndex(x => x.id == response.id);
          this.evidencesSync.splice(index, 1, response);
        })
        .catch(err => {
          console.log(err);
          this.messageSync = getErrorMessage(err);
        })
        .finally(
          () => ((this.snackbarSync = true), (this.dialogDetailSync = false))
        );
    }
  }
}
</script>
