import { get, post } from '@/utils/ajax.js'

export function getOrders (query) {
  return get('/order/manage/query', { ...query })
}
export function logisticsImport (query) {
  console.log(query)
  return post('/order/manage/logistics/import', { ...query })
}
