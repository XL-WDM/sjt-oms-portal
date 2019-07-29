import Vue from 'vue'
import App from './App.vue'
import cfg from '@/config'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  ...cfg
}).$mount('#app')
