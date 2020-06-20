<template>
  <v-dialog v-model="dialogSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Xóa loại Container</span>
          <v-btn
            icon
            dark
            @click="dialogSync = false"
            style="margin-left:324px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
              >Bạn có chắc chắn muốn xóa những loại Container này?
              DeleteContainerType</span
            >
            <div class="line"></div>
            <v-list>
              <v-list-item v-for="item in selectedSync" :key="item.name">
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="cancelDel()">Hủy</v-btn>
        <v-btn @click="del()" color="red">Xóa</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { ContainerType } from "../container-type";
@Component({
  name: "DeleteContainerType"
})
export default class DeleteContainerType extends Vue {
  // @Prop() selected!: Array<object>;
  @PropSync("selected", { type: Array }) selectedSync!: Array<
    ContainerType
  > | null;
  @PropSync("dialogDel", { type: Boolean }) dialogSync!: boolean | null;

  mounted() {
    console.log("PROP selected", this.selectedSync);
  }
}
</script>
