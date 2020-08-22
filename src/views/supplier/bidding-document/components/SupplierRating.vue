<template>
  <v-row align="center" class="mx-0" v-if="supplier">
    <div class="primary--text mr-4">{{ supplier.fullname }}</div>
    <v-rating
      :value="supplier.ratingValue"
      color="amber"
      dense
      half-increments
      readonly
      size="14"
    ></v-rating>

    <div class="grey--text ml-4">
      {{ supplier.ratingValue }} ({{ supplier.ratingCount || 0 }})
    </div>
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ISupplier } from "@/entity/supplier";

@Component
export default class SupplierRating extends Vue {
  @Prop() supplier!: ISupplier;
}
</script>
