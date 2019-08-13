import { post } from '@/utils/ajax.js'

export function sign (signInfo) {
  return post('/auth/sign', {
    ...signInfo,
    signMode: '1'
  })
}
