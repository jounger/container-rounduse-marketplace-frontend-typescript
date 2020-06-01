<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <!-- <h1>USER SECTION</h1> -->
        <v-simple-table fixed-header height="300px">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Username</th>
                <th class="text-left">Email</th>
                <th class="text-left">Fullname</th>
                <th class="text-left">Roles</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in users" :key="item.username">
                <td>{{ item.username }}</td>
                <td>{{ item.email }}</td>
                <td>{{ item.fullname }}</td>
                <td>{{ item.roles }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-row>
    </v-container>
  </v-content>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import NavLayout from "@/layouts/NavLayout.vue";
@Component
export default class User extends Vue {
  @PropSync("layout") layoutSync!: object;
  private users: Array<object> = [];

  created() {
    this.layoutSync = NavLayout;
  }
  async mounted() {
    const res = await this.getUsers();
    this.users = res.data.data;
    console.log(this.users);
  }
  public getUsers(): any {
    return this.$http({
      url: "/admin/user",
      method: "GET",
      headers: {
        Authorization: "Bearer {auth_token}"
      },
      params: {
        page: 0,
        limit: 5
      }
    });
    // .then(response => {
    //   console.warn("SUCCESS get", response);
    // })
    // .catch(err => {
    //   console.error("ERROR! in get", err);
    // });
  }
}
</script>
