import { VuexModule, Module, Mutation, Action, getModule, MutationAction } from 'vuex-module-decorators'
import { UserEntity } from '../definitions/user';
import { PaginationRequest, PaginationResponse } from '../../api/payload';
import { getUsers, getProfile } from "@/api/user";
import store from "@/store"

@Module({
  namespaced: true,
  name: 'UserModule',
  store,
  dynamic: true,
})
class UserModule extends VuexModule {
  // state
  public currentUser: UserEntity | null = null;
  public usersPaging: PaginationResponse<UserEntity> | null = null;

  // getters -> get state
  get getListUsers() {
    return this.usersPaging?.data;
  }

  get getCurrentUser() {
    return this.currentUser;
  }

  get getUsersPaging() {
    return (this.usersPaging as PaginationResponse<UserEntity>);
  }

  // mutation -> set new data to state
  @Mutation
  public updateUsers(usersPaging: PaginationResponse<UserEntity>): void {
    this.usersPaging = usersPaging;
  }

  // action -> commit to "updateUsers" mutation
  @Action({ commit: "updateUsers" })
  public async fetchUsers(paging: PaginationRequest) {
    const page  = await getUsers(paging);
    return page;
  }

  @MutationAction
  async loadProfile() {
    const currentUser = await getProfile();
    return { currentUser }; // currentUser -> same as declear currentUser state
  }

  // Must unregister module before destroy
  // to avoid duplicate getter key
  beforeDestroy() {
    store.unregisterModule("UserModule");
  }
}
export default getModule(UserModule)
