<template>
  <v-dialog v-model="dialogDelSync" max-width="400px">
    <v-card>
      <v-card-title class="headline">Xóa quản trị viên</v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <span>Bạn có chắc chắn muốn xóa quản trị viên này?</span>
            <v-divider class="mt-3"></v-divider>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ operator.username }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogDelSync = false">Trở về</v-btn>
        <v-btn @click="removeOperator()" color="error">Xóa bỏ</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IOperator } from "@/entity/operator";
import { removeOperator } from "@/api/operator";

@Component
export default class DeleteOperator extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("operators", { type: Array }) operatorsSync!: Array<IOperator>;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) operator!: IOperator;

  async removeOperator() {
    if (this.operator.id) {
      const _res = await removeOperator(this.operator.id);
      if (_res.status == 200) {
        const index = this.operatorsSync.findIndex(
          x => x.id === this.operator.id
        );
        this.operatorsSync.splice(index, 1);
        this.totalItemsSync -= 1;
        this.dialogDelSync = false;
      }
    }
  }
}
</script>
