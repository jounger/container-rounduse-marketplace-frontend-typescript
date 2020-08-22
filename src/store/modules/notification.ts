import Vue from "vue";
import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { INotification } from "@/entity/notification";
import { PaginationRequest } from "@/entity/payload";
import store from "../index";

@Module({ dynamic: true, store: store, name: "notification" })
export default class NotificationModule extends VuexModule {
  notifications: Array<INotification> = [];

  @Mutation
  setNotification(notifications: Array<INotification>) {
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
