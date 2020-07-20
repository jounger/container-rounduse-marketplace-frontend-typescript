import { Module, VuexModule, MutationAction, getModule } from 'vuex-module-decorators'
import { Loader, google, LoaderOptions } from 'google-maps';
import store from '@/store/index';

@Module({
  name: 'gmap',
  dynamic: true,
  store: store
})
class GmapModule extends VuexModule {
  google = null as google | null;

  get googleApi() {
    return this.google;
  }

  @MutationAction({ mutate: ['google'] })
  async setUpGmapLoaderGmap(key: string, options: LoaderOptions) {
    const google = await new Loader(key, options).load();
    return {
      google: google
    }
  }
}

export default getModule(GmapModule);
