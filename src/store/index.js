import Vue from 'vue'
import Vuex from 'vuex'
import { tagBars } from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    tagBars
  }
})
