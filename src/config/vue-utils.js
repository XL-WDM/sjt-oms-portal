import Vue from 'vue'
import util from '@/utils'

Vue.prototype.u = {
  ...util,
  /* /+ -> / */
  slashToSingle: (value) => {
    return value.replace(new RegExp('/+'), '/')
  }
}
