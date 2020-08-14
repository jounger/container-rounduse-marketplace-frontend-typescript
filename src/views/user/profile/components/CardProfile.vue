<template>
  <v-card class="order-0 flex-grow-0 mx-auto mr-5 my-5" max-width="380">
    <v-card-text>
      <v-avatar size="250" color="indigo">
        <v-img
          v-if="$auth.user().profileImagePath"
          :src="profileImagePath"
        ></v-img>
        <v-icon v-else dark>mdi-account-circle</v-icon>
      </v-avatar>
      <v-row>
        <v-col cols="12" md="9">
          <v-file-input
            v-model="fileInput"
            counter
            chips
            :show-size="1024"
            accept="image/png, image/jpeg, image/bmp, image/png"
            placeholder="Pick an avatar"
            prepend-icon="mdi-camera"
            label="Avatar"
          ></v-file-input>
        </v-col>
        <v-col cols="12" md="3">
          <v-btn
            :disabled="fileInput == null"
            outlined
            color="primary"
            @click.stop="onUpload"
            fab
            small
            ><v-icon>cloud_upload</v-icon></v-btn
          >
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-title>Thông tin cá nhân</v-card-title>
    <v-list two-line>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="indigo">mdi-phone</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-subtitle>Số điện thoại</v-list-item-subtitle>
          <v-list-item-title>{{
            $auth.user() ? $auth.user().phone : ""
          }}</v-list-item-title>
        </v-list-item-content>

        <v-list-item-icon>
          <v-icon>mdi-message-text</v-icon>
        </v-list-item-icon>
      </v-list-item>

      <v-divider inset></v-divider>

      <v-list-item>
        <v-list-item-icon>
          <v-icon color="indigo">mdi-email</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-subtitle>Email</v-list-item-subtitle>
          <v-list-item-title>{{
            $auth.user() ? $auth.user().email : ""
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset></v-divider>

      <v-list-item>
        <v-list-item-icon>
          <v-icon color="indigo">mdi-map-marker</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-subtitle>Địa chỉ</v-list-item-subtitle>
          <v-list-item-title>{{
            $auth.user() ? $auth.user().address : ""
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { uploadProfileImage } from "@/api/user";

@Component
export default class CardProfile extends Vue {
  fileInput = null as Blob | null;

  profileImagePath = "";

  async onUpload() {
    if (this.fileInput) {
      const formData = new FormData();
      formData.append("file", this.fileInput);
      const _res = await uploadProfileImage(formData);
      if (_res.data) {
        const _user = _res.data.data;
        this.profileImagePath =
          "http://localhost:8085" + _user.profileImagePath;
        // await this.$auth.fetchUser();
      }
    }
  }

  mounted() {
    this.profileImagePath =
      "http://localhost:8085" + this.$auth.user().profileImagePath;
  }
}
</script>
