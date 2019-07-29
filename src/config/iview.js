import Vue from 'vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

// iview 通知提醒全局配置
iView.Notice.config({
  top: 115,
  duration: 2
})

Vue.use(iView)
