import { get } from '@/utils/ajax.js'

export function getOrders (query) {
  return get('/order/manage/query', { ...query })
}
