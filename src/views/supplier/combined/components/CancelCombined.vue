<template>
  <v-dialog v-model="dialogCancelSync" max-width="400">
    <v-card>
      <v-card-title class="headline">Hủy hợp đồng</v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <span>Bạn có chắc chắn muốn hủy hợp đồng này?</span>
            <v-divider class="mt-3"></v-divider>
            <div>
              Nếu hủy, bạn sẽ phải trả
              {{ combined.contract.finesAgainstContractViolations || 0 }}% =
              {{
                currencyFormatter(
                  Math.ceil(
                    ((combined.contract.finesAgainstContractViolations || 0) /
                      100) *
                      combined.contract.price
                  )
                )
              }}
            </div>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogCancelSync = false">Trở về</v-btn>
        <v-btn @click="cancelCombined()" color="error">Hủy hợp đồng</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { ICombined } from "@/entity/combined";
import { editCombined } from "@/api/combined";
import Utils from "@/mixin/utils";

@Component({
  mixins: [Utils]
})
export default class CancelCombined extends Vue {
  @PropSync("dialogCancel", { type: Boolean }) dialogCancelSync!: boolean;
  @Prop() combined!: ICombined;
  @PropSync("combineds", { type: Array }) combinedsSync!: ICombined[];

  async cancelCombined() {
    if (this.combined.id) {
      const _res = await editCombined(this.combined.id as number, {
        isCanceled: true
      });
      if (_res.data) {
        const _combined = _res.data.data;
        const index = this.combinedsSync.findIndex(x => x.id === _combined.id);
        this.combinedsSync.splice(index, 1, _combined);
        this.dialogCancelSync = false;
      }
    }
  }
}
</script>
