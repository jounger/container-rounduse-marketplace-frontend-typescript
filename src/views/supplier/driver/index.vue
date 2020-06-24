<template>
  <v-content>
    <v-card>
      <v-card-title>
        Danh sách lái xe
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-btn
        color="primary"
        style="margin-left: 35px;"
        dark
        @click.stop="addDriver"
        v-if="$auth.check(['ROLE_FORWARDER'])"
      >
        Thêm mới
      </v-btn>
      <v-row justify="center">
        <DeleteDriver
          :dialogDel.sync="dialogDel"
          :checkSuccess.sync="checkSuccess"
          :success.sync="success"
          :name="name"
        />
      </v-row>
      <v-row justify="center">
        <CreateDriver
          :driver.sync="driver"
          :title="title"
          :dialogAdd.sync="dialogAdd"
          :checkSuccess.sync="checkSuccess"
          :checkAdd="checkAdd"
          :checkUpdate="checkUpdate"
          :success.sync="success"
          :readonly="readonly"
        />
      </v-row>
      <v-alert
        v-model="checkSuccess"
        dismissible
        close-icon="mdi-delete"
        type="success"
      >
        {{ success }}
      </v-alert>
      <v-data-table
        :headers="headers"
        :items="drivers"
        :search="search"
        item-key="driverLicense"
        :options.sync="options"
        :server-items-length="totalDrivers"
        :loading="loading"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:item.action="{ item }">
          <v-menu :loading="item.createloading" :disabled="item.createloading">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="secondary" dark v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="viewDetail(item)">
                <v-list-item-title>Xem chi tiết</v-list-item-title>
              </v-list-item>
              <v-list-item @click="update(item)">
                <v-list-item-title>Cập nhập</v-list-item-title>
              </v-list-item>
              <v-list-item @click="delDriver(item)">
                <v-list-item-title>Xóa</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>
<script lang="ts">
import { Component, PropSync, Watch, Vue } from "vue-property-decorator";
import NavLayout from "@/layouts/NavLayout.vue";
import data from "../driver/data";
import { IDriver } from "@/entity/driver";
import DeleteDriver from "./components/DeleteDriver.vue";
import CreateDriver from "./components/CreateDriver.vue";

@Component({
  components: {
    DeleteDriver,
    CreateDriver
  }
})
export default class Driver extends Vue {
  @PropSync("layout") layoutSync!: object;
}
</script>
<style type="text/css">
.line {
  margin-top: 10px;
  width: 520px;
  border-bottom: 1px solid black;
  position: absolute;
}
</style>
