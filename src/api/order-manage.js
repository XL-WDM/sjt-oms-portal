import { get } from '@/utils/ajax.js'

export function getOrders() {
  return get('/order/list/page', {})
}
