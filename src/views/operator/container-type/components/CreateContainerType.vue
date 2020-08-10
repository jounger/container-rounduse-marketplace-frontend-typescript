<template>
  <v-dialog
    v-model="dialogAddSync"
    fullscreen
    persistent
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-form v-model="valid" validation>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialogAddSync = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title
            >{{
              update ? "Cập nhật Loại Container" : "Thêm mới Loại Container"
            }}
          </v-toolbar-title>

          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="dialogAddSync = false">Trở về</v-btn>
            <v-btn
              dark
              text
              @click="updateContainerType()"
              v-if="update"
              :disabled="!valid"
              >Cập nhật</v-btn
            >
            <v-btn
              dark
              text
              @click="createContainerType()"
              v-else
              :disabled="!valid"
              >Thêm mới</v-btn
            >
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Tên loại Container*"
                name="name"
                prepend-icon="directions_bus"
                type="text"
                :readonly="update"
                v-model="containerTypeLocal.name"
                :rules="[required('Tên loại Container')]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Chi tiết"
                name="description"
                prepend-icon="description"
                type="text"
                v-model="containerTypeLocal.description"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Khối lượng vỏ"
                name="tareWeight"
                prepend-icon="airport_shuttle"
                type="number"
                v-model="containerTypeLocal.tareWeight"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Trọng tải"
                name="payloadCapacity"
                prepend-icon="fitness_center"
                type="number"
                v-model="containerTypeLocal.grossWeight"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Công suất khối"
                name="cubicCapacity"
                prepend-icon="network_check"
                type="number"
                v-model="containerTypeLocal.cubicCapacity"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Chiều dài trong"
                name="internalLength"
                prepend-icon="border_outer"
                type="number"
                v-model="containerTypeLocal.internalLength"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Chiều rộng trong"
                name="internalWidth"
                prepend-icon="border_bottom"
                type="number"
                v-model="containerTypeLocal.internalWidth"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Chiều cao trong"
                name="internalHeight"
                prepend-icon="border_vertical"
                type="number"
                v-model="containerTypeLocal.internalHeight"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Chiều rộng cửa mở"
                name="doorOpeningWidth"
                prepend-icon="flip_to_back"
                type="number"
                v-model="containerTypeLocal.doorOpeningWidth"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Chiều cao cửa mở"
                name="doorOpeningHeight"
                prepend-icon="flip_to_front"
                type="number"
                v-model="containerTypeLocal.doorOpeningHeight"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IContainerType } from "@/entity/container-type";
import FormValidate from "@/mixin/form-validate";
import { createContainerType, editContainerType } from "@/api/container-type";

@Component({
  mixins: [FormValidate]
})
export default class CreateContainerType extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("containerTypes", { type: Array })
  containerTypesSync!: IContainerType[];
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Boolean) update!: boolean;
  @Prop(Object) containerType!: IContainerType;

  containerTypeLocal = {
    name: "",
    description: "",
    tareWeight: 0,
    grossWeight: 0,
    cubicCapacity: 0,
    internalLength: 0,
    internalWidth: 0,
    internalHeight: 0,
    doorOpeningWidth: 0,
    doorOpeningHeight: 0,
    unitOfMeasurement: "M"
  } as IContainerType;
  valid = false;
  created() {
    if (this.update) {
      this.containerTypeLocal = Object.assign({}, this.containerType);
    }
  }
  async createContainerType() {
    if (this.containerTypeLocal) {
      const _containerType = await createContainerType(this.containerTypeLocal);
      if (_containerType.data) {
        this.containerTypesSync.unshift(_containerType.data);
        this.totalItemsSync += 1;
        this.dialogAddSync = false;
      }
    }
  }
  async updateContainerType() {
    if (this.containerTypeLocal.id) {
      const _containerType = await editContainerType(
        this.containerTypeLocal.id,
        this.containerTypeLocal
      );
      if (_containerType.data) {
        const index = this.containerTypesSync.findIndex(
          x => x.id === _containerType.data.id
        );
        this.containerTypesSync.splice(index, 1, _containerType.data);
      }
    }
  }
}
</script>
