import menuBar from './menu-bar.vue'

const MenuBar = {
  install: Vue => {
    Vue.component('MenuBar', menuBar)
  }
}

export default MenuBar
