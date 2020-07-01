<template>
  <v-dialog
    v-model="dialogAddSync"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialogAddSync = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title
          >{{ update ? "Cập nhập Loại Container" : "Thêm mới Loại Container" }}
        </v-toolbar-title>

        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialogAddSync = false">Trở về</v-btn>
          <v-btn dark text @click="updateContainerType()" v-if="update"
            >Cập nhập</v-btn
          >
          <v-btn
            dark
            text
            @click="createContainerType()"
            v-else
            :disabled="readonly"
            >Thêm mới</v-btn
          >
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Tên loại Container*"
                  name="name"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="containerTypeLocal.name"
                  :rules="[required('name')]"
                  :readonly="readonly"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Chi tiết"
                  name="description"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="containerTypeLocal.description"
                  :readonly="readonly"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Khối lượng vỏ"
                  name="tareWeight"
                  prepend-icon="mdi-lock"
                  type="number"
                  v-model="containerTypeLocal.tareWeight"
                  :readonly="readonly"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Trọng tải"
                  name="payloadCapacity"
                  prepend-icon="mdi-lock"
                  type="number"
                  v-model="containerTypeLocal.payloadCapacity"
                  :readonly="readonly"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Công suất khối"
                  name="cubicCapacity"
                  prepend-icon="mdi-lock"
                  type="number"
                  v-model="containerTypeLocal.cubicCapacity"
                  :readonly="readonly"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Chiều dài trong"
                  name="internalLength"
                  prepend-icon="mdi-lock"
                  type="number"
                  v-model="containerTypeLocal.internalLength"
                  :readonly="readonly"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Chiều rộng trong"
                  name="internalWidth"
                  prepend-icon="mdi-lock"
                  type="number"
                  v-model="containerTypeLocal.internalWidth"
                  :readonly="readonly"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Chiều cao trong"
                  name="internalHeight"
                  prepend-icon="mdi-lock"
                  type="number"
                  v-model="containerTypeLocal.internalHeight"
                  :readonly="readonly"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Chiều rộng cửa mở"
                  name="doorOpeningWidth"
                  prepend-icon="mdi-lock"
                  type="number"
                  v-model="containerTypeLocal.doorOpeningWidth"
                  :readonly="readonly"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Chiều cao cửa mở"
                  name="doorOpeningHeight"
                  prepend-icon="mdi-lock"
                  type="number"
                  v-model="containerTypeLocal.doorOpeningHeight"
                  :readonly="readonly"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IContainerType } from "@/entity/container-type";
import FormValidate from "@/mixin/form-validate";
import { createContainerType, updateContainerType } from "@/api/container-type";

@Component({
  mixins: [FormValidate]
})
export default class CreateContainerType extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("containerType", { type: Object })
  containerTypeSync!: IContainerType;
  @PropSync("containerTypes", { type: Array }) containerTypesSync!: Array<
    IContainerType
  >;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @Prop(Boolean) update!: boolean;

  containerTypeLocal = {} as IContainerType;
  readonly = false;
  created() {
    this.containerTypeLocal = Object.assign({}, this.containerTypeSync);
  }
  createContainerType() {
    if (this.containerTypeLocal) {
      createContainerType(this.containerTypeLocal)
        .then(res => {
          console.log(res.data);
          const response: IContainerType = res.data;
          this.containerTypeLocal.id = response.id;
          this.messageSync =
            "Thêm mới thành công loại Container: " +
            this.containerTypeLocal.name;
          this.containerTypesSync.unshift(this.containerTypeLocal);
          this.readonly = true;
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
  updateContainerType() {
    if (this.containerTypeSync.id) {
      this.containerTypeSync = Object.assign({}, this.containerTypeLocal);
      updateContainerType(this.containerTypeSync)
        .then(res => {
          console.log(res.data);
          const response: IContainerType = res.data;
          this.containerTypeSync = response;
          this.messageSync =
            "Cập nhập thành công loại Container: " +
            this.containerTypeSync.name;
          const index = this.containerTypesSync.findIndex(
            x => x.id === this.containerTypeSync.id
          );
          this.containerTypesSync.splice(index, 1, this.containerTypeSync);
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
}
</script>
