<template>
  <v-dialog v-model="dialogRatingSync" width="400">
    <v-card>
      <v-card-title class="headline">
        Đánh giá nhà cung cấp
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="12">
            <div class="text-center mt-12">
              <v-rating
                v-model="ratingLocal.ratingValue"
                color="yellow darken-3"
                background-color="grey darken-1"
                empty-icon="$ratingFull"
                hover
              ></v-rating></div
          ></v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="12">
            <v-text-field
              label="Nhà cung cấp"
              type="text"
              prepend-icon="mdi-account"
              v-model="ratingLocal.receiver"
              disabled
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="12">
            <v-text-field
              label="Chú thích"
              type="text"
              prepend-icon="edit"
              v-model="ratingLocal.comment"
              :counter="100"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogRatingSync = false">Trở về</v-btn>
        <v-btn
          @click="ratingContract()"
          color="primary"
          :disabled="!ratingLocal.ratingValue"
          >Đánh giá</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IContract } from "@/entity/contract";
import { IRating } from "@/entity/rating";
import { createRating } from "@/api/rating";
import { ICombined } from "@/entity/combined";
import { IBid } from "@/entity/bid";
import { ISupplier } from "@/entity/supplier";

@Component
export default class RatingContract extends Vue {
  @PropSync("dialogRating", { type: Boolean }) dialogRatingSync!: boolean;
  @Prop(Object) combined!: ICombined;
  @PropSync("ratingValue", { type: Number }) ratingValueSync!: number;

  contract = null as IContract | null;
  ratingLocal = {
    sender: this.$auth.user().fullname,
    receiver: "",
    contract: -1,
    ratingValue: 0,
    comment: ""
  } as IRating;

  created() {
    if (this.combined) {
      this.contract = this.combined.contract as IContract;
      if (this.$auth.check("ROLE_MERCHANT")) {
        const _bid = this.combined.bid as IBid;
        const _bidder = _bid.bidder as ISupplier;
        this.ratingLocal.receiver = _bidder.companyName;
      } else if (this.$auth.check("ROLE_FORWARDER")) {
        this.ratingLocal.receiver = this.contract.sender.companyName;
      }
      this.ratingLocal.contract = this.contract.id as number;
      if (this.ratingValueSync) {
        this.ratingLocal.ratingValue = this.ratingValueSync;
      }
    }
  }

  async ratingContract() {
    if (this.contract && this.ratingLocal) {
      const _res = await createRating(
        this.contract.id as number,
        this.ratingLocal
      );
      if (_res.data) {
        this.dialogRatingSync = false;
      }
    }
  }
}
</script>
