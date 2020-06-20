<template>
  <v-dialog v-model="dialogSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{ title }}</span>
          <v-btn
            icon
            dark
            @click="dialogSync = false"
            style="margin-left:258px;"
          >
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
                  label="Tên loại Container"
                  name="name"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="name"
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
                  v-model="description"
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
                  v-model="tareWeight"
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
                  v-model="payloadCapacity"
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
                  v-model="cubicCapacity"
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
                  v-model="internalLength"
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
                  v-model="internalWidth"
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
                  v-model="internalHeight"
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
                  v-model="doorOpeningWidth"
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
                  v-model="doorOpeningHeight"
                  :readonly="readonly"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialogSync = false">Trở về</v-btn>
        <v-btn @click="submit()" color="primary" v-if="checkAdd"
          >Thêm mới</v-btn
        >
        <v-btn @click="updateContainerType()" color="primary" v-if="checkUpdate"
          >Cập nhập</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import { ContainerType } from "../container-type";
@Component({
  name: "CreateContainerType"
})
export default class CreateContainerType extends Vue {
  // @Prop() selected!: Array<object>;
  @PropSync("dialogAdd", { type: Boolean }) dialogSync!: boolean;
  @PropSync("checkSuccess", { type: Boolean }) checkSuccessSync!: boolean;
  @PropSync("success", { type: String }) successSync!: string | null;
  @Prop(Boolean) checkAdd!: boolean;
  @Prop(Boolean) checkUpdate!: boolean;
  @Prop(Boolean) readonly!: boolean;
  @PropSync("containerType", { type: Object })
  containerTypeSync!: ContainerType | null;
  @Prop(String) title!: string | null;

  name = "";
  description = "";
  tareWeight = 0;
  payloadCapacity = 0;
  cubicCapacity = 0;
  internalLength = 0;
  internalWidth = 0;
  internalHeight = 0;
  doorOpeningWidth = 0;
  doorOpeningHeight = 0;

  created() {
    if (this.containerTypeSync != null) {
      console.log(1);
      this.name = this.containerTypeSync.name;
      this.description = this.containerTypeSync.description;
      this.tareWeight = this.containerTypeSync.tareWeight;
      this.payloadCapacity = this.containerTypeSync.payloadCapacity;
      this.cubicCapacity = this.containerTypeSync.cubicCapacity;
      this.internalLength = this.containerTypeSync.internalLength;
      this.internalWidth = this.containerTypeSync.internalWidth;
      this.internalHeight = this.containerTypeSync.internalHeight;
      this.doorOpeningWidth = this.containerTypeSync.doorOpeningWidth;
      this.doorOpeningHeight = this.containerTypeSync.doorOpeningHeight;
    }
    if (this.checkAdd == true) {
      this.name = "";
      this.description = "";
      this.tareWeight = 0;
      this.payloadCapacity = 0;
      this.cubicCapacity = 0;
      this.internalLength = 0;
      this.internalWidth = 0;
      this.internalHeight = 0;
      this.doorOpeningWidth = 0;
      this.doorOpeningHeight = 0;
    }
  }
  public submit() {
    this.successSync = "Thêm mới thành công!";
    this.checkSuccessSync = true;
    this.dialogSync = false;
  }
  public updateContainerType() {
    this.successSync = "Cập nhập thành công";
    this.checkSuccessSync = true;
    this.dialogSync = false;
  }
}
</script>
