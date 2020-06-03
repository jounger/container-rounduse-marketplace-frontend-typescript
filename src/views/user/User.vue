<template>
  <v-content>
    <v-container v-if="paging" class="fill-height" fluid>
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
              <tr v-for="item in paging.data" :key="item.username">
                <td>{{ item.username }}</td>
                <td>{{ item.email }}</td>
                <td>{{ item.fullname }}</td>
                <td>{{ item.roles }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-row>
      <v-pagination
        v-model="paging.page"
        :length="paging.total_pages"
        :total-visible="7"
        class="my-4"
      ></v-pagination>
    </v-container>
  </v-content>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import NavLayout from "@/layouts/NavLayout.vue";
import UserModule from "@/store/modules/user";

@Component
export default class User extends Vue {
  // layout props
  @PropSync("layout") layoutSync!: object;

  public pagingResponse: any = {};

  get paging() {
    return UserModule.getUsersPaging;
  }

  async created() {
    this.layoutSync = NavLayout; // change EmptyLayout to NavLayout.vue
  }
  async mounted() {
    await UserModule.fetchUsers({
      page: 0,
      limit: 5
    }); // -> store.dispatch("user/fetchUsers", {page: 0, limit: 5})
    console.log(this.paging);
  }
}
</script>
