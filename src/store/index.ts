import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    notifications: [] as Array<any>
  },
  getters: {
    getNotifications(state) {
      return state.notifications;
    }
  },
  mutations: {
    addNotification(state, notification: any) {
      notification.id = (
        Math.random().toString(36) + Date.now().toString(36)
      ).substr(2);
      state.notifications.push(notification);
    },

    removeNotification(state, notificationToRemove: any) {
      state.notifications = state.notifications.filter(notification => {
        return notification.id != notificationToRemove.id;
      });
    }
  },
  actions: {
    addNotification(context, notification: any) {
      context.commit("addNotification", notification);
    },
    removeNotification(context, notificationToRemove: any) {
      context.commit("removeNotification", notificationToRemove);
    }
  },
  modules: {}
});

(Vue as any).store = store;

export default store;
