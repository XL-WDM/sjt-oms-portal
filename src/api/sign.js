import { post } from '@/utils/ajax.js'

export function sign (signInfo) {
  return post('/oauth/sign', {
    ...signInfo,
    signMode: '1'
  })
}
