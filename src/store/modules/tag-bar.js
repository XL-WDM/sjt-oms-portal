import router from '@/router'
import utils from '@/utils'

export default {
  state: {
    tagBars: []
  },
  getters: {
    tagBars: state => {
      return state.tagBars
    }
  },
  mutations: {
    pushTagBars (state, data) {
      if (!utils.isExist(state.tagBars, item => item.path === data.path)) {
        state.tagBars.push(data)
      }
    },
    removeTagBars (state, path) {
      state.tagBars = utils.filter(state.tagBars, item => item.path !== path)

      // 删除的标签为选中标签时, 重新定位标签
      if (path === router.history.current.path) {
        if (state.tagBars.length > 0) {
          router.push({ path: state.tagBars[0].path })
        } else {
          router.push({ path: '/index' })
        }
      }
    }
  },
  actions: {
    pushTagBars ({ commit }, data) {
      commit('pushTagBars', data)
    },
    removeTagBars ({ commit }, path) {
      commit('removeTagBars', path)
    }
  }
}
