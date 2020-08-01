import Vue from "vue";
import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { IBiddingNotification } from "@/entity/bidding-notification";
import { PaginationRequest } from "@/api/payload";
import store from "../index";

@Module({ dynamic: true, store: store, name: "notification" })
export default class NotificationModule extends VuexModule {
  notifications: Array<IBiddingNotification> = [];

  @Mutation
  setNotification(notifications: Array<IBiddingNotification>) {
    this.notifications = notifications;
  }

  @Action({ commit: "setNotification" })
  async fetchNotification(id: number, paging: PaginationRequest) {
    return Vue.axios.get(`/notification/user/${id}`, {
      params: paging,
      headers: {
        Authorization: "Bearer {auth_token}"
      }
    });
  }
}
