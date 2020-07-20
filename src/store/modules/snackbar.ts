import { Module, VuexModule, MutationAction, getModule } from 'vuex-module-decorators'
import { ISnackbar } from '@/components/interface';
import store from '@/store/index';

@Module({
  name: 'snackbar',
  dynamic: true,
  store: store
})
class SnackbarModule extends VuexModule {
  snackbar = {
    text: "Empty",
    color: "success",
    timeout: 5000
  } as ISnackbar;
  display = false;

  get snackbarInfo() {
    return this.snackbar;
  }

  get displayMode() {
    return this.display;
  }

  @MutationAction({ mutate: ['snackbar'] })
  async setSnackbar(_snackbar: ISnackbar) {
    return {
      snackbar: _snackbar
    }
  }

  @MutationAction({ mutate: ['display'] })
  async setDisplay(_display: boolean) {
    return {
      display: _display
    }
  }
}
export default getModule(SnackbarModule);
