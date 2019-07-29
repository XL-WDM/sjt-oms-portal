<template>
  <div class="layout">
    <Layout>
      <Header :style="{padding: 0}" class="layout-header-bar">
        <Row>
          <Col span="22">
            <h1 class="log-name">后台管理平台</h1>
          </Col>
          <Col span="2">
            <Avatar class="user-head" src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
          </Col>
        </Row>
      </Header>
      <Layout>
        <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
          <MenuBar :is-collapsed="isCollapsed"></MenuBar>
        </Sider>
        <Content class="layout-content">
          <div class="view-lable">
            <Tag closable
                 :color="$route.path === itm.path ? 'success' : 'default'"
                 v-for="(itm, index) in tagBars" :key="index"
                 @on-close="closeTag(itm.path)">
              {{itm.name}}
            </Tag>
          </div>
          <div class="view-content">
            <router-view/>
          </div>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  created () {

  },
  data () {
    return {
      isCollapsed: false
    }
  },
  computed: {
    rotateIcon () {
      return [
        'menu-icon',
        this.isCollapsed ? 'rotate-icon' : ''
      ]
    },
    menuitemClasses () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    },
    ...mapGetters(['tagBars'])
  },
  methods: {
    collapsedSider () {
      this.$refs.side1.toggleCollapse()
    },
    closeTag (path) {
      this.removeTagBars(path)
    },
    ...mapActions({
      pushTagBars: 'pushTagBars',
      removeTagBars: 'removeTagBars'
    })
  },
  watch: {
    $route (to, fromRoute) {
      this.pushTagBars({ path: to.path, name: to.meta.title })
    }
  }
}
</script>

<style scoped>
.layout{
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-header-bar{
  background: #fff;
  box-shadow: 0 1px 1px rgba(0,0,0,.1);
}
.layout-logo-left{
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.menu-icon{
  transition: all .3s;
}
.rotate-icon{
  transform: rotate(-90deg);
}
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

.log-name {
  margin-left: 15px;
}
.user-head {
  margin: 15px;
  float: right;
}
.view-lable {
  margin: 2px 5px 0px 5px;
  padding: 5px;
  background: #FFFFFF;
  min-height: 30px;
}
.view-content {
  margin: 5px;
  padding: 5px;
  background: #FFFFFF;
  min-height: 559px;
}
</style>
