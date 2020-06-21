<template>
  <v-dialog v-model="dialogSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;"
            >Chi tiết đơn đăng ký</span
          >
          <v-btn icon dark @click="dialog = false" style="margin-left:308px;">
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Tên đăng nhập"
                  name="username"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="profile.username"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Email"
                  name="email"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="profile.email"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Số điện thoại"
                  name="phone"
                  prepend-icon="mdi-lock"
                  type="number"
                  v-model="profile.phone"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Phân quyền"
                  name="role"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="roles[0]"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogSync = false">Trở về</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import { UserEntity } from "../../../../store/definitions/user";

@Component({
  name: "RequestDetail"
})
export default class RequestDetail extends Vue {
  // @Prop() selected!: Array<object>;
  @Prop(Object) profile!: UserEntity | null;
  @PropSync("dialog", { type: Boolean }) dialogSync!: boolean;
  roles = [] as Array<string>;
  created() {
    if (this.profile != null) {
      this.roles = this.profile.role;
    }
  }
}
</script>
