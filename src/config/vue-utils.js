import Vue from 'vue'
import util from '@/utils'

Vue.prototype.u = {
  ...util,
  /* /+ -> / */
  slashToSingle (value) {
    return value.replace(new RegExp('/+'), '/')
  },
  /* 格式化日期 */
  formatDate (dateStr) {
    if (!dateStr) {
      return '-'
    }

    try {
      const date = new Date(dateStr)
      return date.getFullYear() + '-' + repairZero(date.getMonth() + 1) + '-' + repairZero(date.getDate()) +
        ' ' +
        repairZero(date.getHours()) + ':' + repairZero(date.getMinutes()) + ':' + repairZero(date.getSeconds())
    } catch (e) {
      return '-'
    }
  }
}

function repairZero (number = 0) {
  if (number / 10 < 1) {
    return '0' + number
  }

  return number
}
