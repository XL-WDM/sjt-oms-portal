<template>
  <div>
    <!-- 有子菜单 -->
    <Submenu :name="u.slashToSingle(rootPath + '/' + item.path)" v-if="item.children && item.children.length > 1">
      <template slot="title">
        <Icon :type="item.meta.icon" class="menu-item-i"/>
        <span class="menu-item-span">{{item.meta.title}}</span>
      </template>
      <div v-for="(itm, index) in item.children"
           :key="index">
        <MenuItem
          :name="u.slashToSingle(rootPath + '/' + item.path + '/' + itm.path)"
          :to="u.slashToSingle(rootPath + '/' + item.path  + '/' + itm.path)"
          v-if="!itm.children || itm.children.length == 0">
          <Icon :type="itm.meta.icon" class="menu-item-i"/>
          <span class="menu-item-span">{{itm.meta.title}}</span>
        </MenuItem>
        <MenuBarItem v-if="itm.children && itm.children.length > 0" :item="itm" :rootPath="rootPath + '/' + item.path"></MenuBarItem>
      </div>
    </Submenu>
    <!-- 无子菜单 -->
    <MenuItem :name="u.slashToSingle(rootPath + '/' +
                     item.path +
                     (item.children.length == 1 ? ('/' + item.children[0].path) : ''))"
              v-if="!item.children || item.children.length <= 1"
              :to="u.slashToSingle(rootPath + '/' +
                   item.path +
                   (item.children.length == 1 ? ('/' + item.children[0].path) : ''))">
      <Icon :type="item.meta.icon" class="menu-item-i"/>
      <span class="menu-item-span">
        {{item.children.length == 1 ? item.children[0].meta.title : item.meta.title}}
      </span>
    </MenuItem>
  </div>
</template>

<script>
import MenuBarItem from './menu-bar-item.vue'

export default {
  name: 'MenuBarItem',
  components: {
    MenuBarItem
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    rootPath: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
</style>
