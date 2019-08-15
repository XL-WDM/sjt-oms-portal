<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions({
      pushTagBars: 'pushTagBars'
    })
  },
  watch: {
    $route (to, fromRoute) {
      this.pushTagBars({ path: to.path, name: to.meta.title })
    }
  }
}
</script>

<style lang="less">
</style>
