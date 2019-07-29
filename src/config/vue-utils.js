import Vue from 'vue'
import utils from '@/utils'

Vue.prototype.u = {
  ...utils,
  /* /+ -> / */
  slashToSingle: (value) => {
    return value.replace(new RegExp('/+'), '/')
  }
}
