import {
  Module,
  VuexModule,
  MutationAction,
  getModule
} from "vuex-module-decorators";
import { ILoading } from "@/components/interface";
import store from "@/store/index";

@Module({
  name: "loading",
  dynamic: true,
  store: store
})
class LoadingModule extends VuexModule {
  info = {
    text: "Please stand by",
    color: "white"
  } as ILoading;
  loading = false;

  get loadingInfo() {
    return this.info;
  }

  get loadingMode() {
    return this.loading;
  }

  @MutationAction({ mutate: ["info"] })
  async setInfo(_info: ILoading) {
    return {
      info: _info
    };
  }

  @MutationAction({ mutate: ["loading"] })
  async setLoading(_loading: boolean) {
    return {
      loading: _loading
    };
  }
}
export default getModule(LoadingModule);
