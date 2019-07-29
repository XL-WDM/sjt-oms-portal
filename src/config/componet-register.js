import Vue from 'vue'
import customComponents from '@/components'

// 自定义组件
Object.keys(customComponents).forEach(key => {
  Vue.use(customComponents[key])
})
