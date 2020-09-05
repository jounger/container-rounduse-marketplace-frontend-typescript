<template>
  <v-card class="order-0 flex-grow-1 mx-auto mr-5" max-width="434" tile>
    <v-card-text>
      <v-img
        width="434"
        height="100%"
        src="@/assets/images/background-cover.jpg"
      >
        <v-row justify="center" align="start" class="fill-height">
          <v-col cols="12" md="12" align-self="start" class="pa-5">
            <v-hover v-slot:default="{ hover }" open-delay="200">
              <v-avatar
                size="200"
                color="tertiary"
                :class="{ 'opacity-hover': hover }"
              >
                <v-img
                  v-if="$auth.user().profileImagePath"
                  :src="profileImagePath"
                ></v-img>
                <v-icon v-else dark>mdi-account-circle</v-icon>
                <v-row
                  v-if="!editProfileImage"
                  :class="{ 'd-none': !hover, 'upload-file': true }"
                >
                  <v-col cols="12" md="12">
                    <v-btn color="info" @click="editProfileImage = true" fab
                      ><v-icon>mdi-camera</v-icon></v-btn
                    >
                  </v-col>
                </v-row>
              </v-avatar>
            </v-hover>
          </v-col>
        </v-row>
      </v-img>
      <v-row v-if="editProfileImage" justify="center">
        <v-col cols="12" md="9">
          <v-file-input
            v-model="fileInput"
            counter
            chips
            :show-size="1024"
            accept="image/png, image/jpeg, image/bmp, image/png"
            placeholder="Chọn ảnh đại diện"
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
            class="mt-3"
            ><v-icon>cloud_upload</v-icon></v-btn
          >
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-title>Thông tin cá nhân</v-card-title>
    <v-list two-line>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="tertiary">person</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-subtitle>{{
            $auth.check("ROLE_MERCHANT") ||
            $auth.check("ROLE_FORWARDER") ||
            $auth.check("ROLE_SHIPPINGLINE")
              ? "Người liên hệ"
              : "Họ và tên"
          }}</v-list-item-subtitle>
          <v-list-item-title>{{
            $auth.user().fullname || "N/A"
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="tertiary">mdi-phone</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-subtitle>Số điện thoại</v-list-item-subtitle>
          <v-list-item-title>{{
            $auth.user().phone || "N/A"
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item>
        <v-list-item-icon>
          <v-icon color="tertiary">mdi-email</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-subtitle>Email</v-list-item-subtitle>
          <v-list-item-title>{{
            $auth.user().email || "N/A"
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item>
        <v-list-item-icon>
          <v-icon color="tertiary">location_on</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-subtitle>Địa chỉ</v-list-item-subtitle>
          <v-list-item-title>{{
            $auth.user().address || "N/A"
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { uploadProfileImage } from "@/api/user";
import { IUser } from "@/entity/user";

@Component
export default class CardProfile extends Vue {
  fileInput = null as Blob | null;
  editProfileImage = false;

  profileImagePath = "";

  async onUpload() {
    if (this.fileInput) {
      const formData = new FormData();
      formData.append("file", this.fileInput);
      const _res = await uploadProfileImage(formData);
      if (_res.data) {
        const _user = _res.data.data;
        this.profileImagePath =
          process.env.VUE_APP_ENDPOINT + _user.profileImagePath;
        // Get the existing data
        const defaultAuthUser = localStorage.getItem("default_auth_user");
        if (defaultAuthUser) {
          const user = JSON.parse(defaultAuthUser) as IUser;
          user.profileImagePath = _user.profileImagePath;
          // Save back to localStorage
          localStorage.setItem("default_auth_user", JSON.stringify(user));
          location.reload();
        }
      }
    }
  }

  mounted() {
    this.profileImagePath =
      process.env.VUE_APP_ENDPOINT + this.$auth.user().profileImagePath;
  }
}
</script>
<style lang="css">
.upload-file {
  position: absolute;
  left: 0;
  right: 0;
  top: 33%;
  bottom: 0px;
  transition: all 0.3s ease 0s;
}

.opacity-hover {
  opacity: 0.6;
  transition: all 0.3s ease 0s;
}
</style>
