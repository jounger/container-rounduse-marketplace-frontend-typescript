import { Module, VuexModule, MutationAction } from 'vuex-module-decorators'
import store from '@/store/index';
import { Loader, google, LoaderOptions } from 'google-maps';

@Module({
  name: 'GmapModule',
  namespaced: true,
  stateFactory: true,
  dynamic: true,
  store: store
})
export default class GmapModule extends VuexModule {
  loader = null as Loader | null;
  google = null as google | null;

  get loaderApi() {
    return this.loader;
  }

  get gmapApi() {
    return this.google;
  }

  @MutationAction({ mutate: ['loader', 'google'] })
  async setUpGmapLoaderGmap(apiKey: string, options: LoaderOptions) {
    const loader: Loader = new Loader(apiKey, options);
    const google = await loader.load();
    return {
      loader: loader,
      google: google
    }
  }
}
