<template>
  <v-row align="center" class="mx-0" v-if="supplierLocal">
    <div class="grey--text mr-4">{{ supplierLocal.contactPerson }}</div>
    <v-rating
      :value="supplierLocal.ratingValue"
      color="amber"
      dense
      half-increments
      readonly
      size="14"
    ></v-rating>

    <div class="grey--text ml-4">{{ supplierLocal.ratingValue }} (413)</div>
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { getSupplier } from "@/api/supplier";
import { ISupplier } from "@/entity/supplier";

@Component
export default class SupplierRating extends Vue {
  @Prop() supplier!: string; // username
  supplierLocal = null as ISupplier | null;

  async mounted() {
    const _res = await getSupplier(this.supplier);
    if (_res.data) {
      const _supplier = _res.data;
      this.supplierLocal = _supplier;
    }
  }
}
</script>
