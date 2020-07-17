<template>
  <v-card class="order-0 flex-grow-0 mx-auto mr-5 my-12" max-width="300">
    <v-img
      height="100%"
      src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg"
    >
      <v-row align="end" class="fill-height">
        <v-col align-self="start" class="pa-0" cols="12">
          <v-avatar class="profile" color="grey" size="164" tile>
            <v-img src="@/assets/images/ava.jpg"></v-img>
          </v-avatar>
        </v-col>
        <v-col class="py-0">
          <v-list-item color="rgba(0, 0, 0, .4)" dark>
            <v-list-item-content>
              <v-list-item-title class="title">{{
                $auth.user() ? $auth.user().username : ""
              }}</v-list-item-title>
              <v-list-item-subtitle>{{
                $auth.user() ? $auth.user().roles[0] : ""
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
    </v-img>

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
@Component
export default class CardProfile extends Vue {}
</script>
