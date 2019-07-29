<template>
  <div>
    <Menu :active-name="$route.path"
          :open-names="u.map($route.matched, item => item.path)"
          :class="menuitemClasses"
          accordion
          theme="dark"
          width="auth">
      <MenuBarItem v-for="(item, index) in menuBars"
                   :key="index"
                   :item="item"></MenuBarItem>
    </Menu>
  </div>
</template>

<script>
import MenuBarItem from './menu-bar-item.vue'
import routeList from '@/router/router-list'

export default {
  name: 'MenuBar',
  props: {
    isCollapsed: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  components: {
    MenuBarItem
  },
  data () {
    return {
      menuBars: routeList
    }
  },
  computed: {
    menuitemClasses () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    }
  }
}
</script>

<style scoped lang="less">
.menu-item span{
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width .2s ease .2s;
}
.menu-item i{
  transform: translateX(0px);
  transition: font-size .2s ease, transform .2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width .2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size .2s ease .2s, transform .2s ease .2s;
  vertical-align: middle;
  font-size: 22px;
}
</style>
