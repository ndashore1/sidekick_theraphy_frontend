import Vuex from "vuex";
import Vue from "vue";
import createPersistedState from "vuex-persistedstate";
import auth from "./modules/auth";
//import AxiosPlugin from 'vue-axios-cors';
 
//Vue.use(AxiosPlugin)

// Load Vuex
Vue.use(Vuex);

// Create store
export default new Vuex.Store({
  modules: {
    auth,
  },
  plugins: [createPersistedState()],
});
