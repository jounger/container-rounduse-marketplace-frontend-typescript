import Vue from "vue";
import { IRating } from "@/entity/rating";

export function createRating(id: number, rating: IRating) {
  return Vue.axios.post(`/rating/contract/${id}`, rating);
}
