import { get, post } from '@/utils/ajax.js'

export function getOrders (query) {
  return get('/order/manage/query', { ...query })
}

export function logisticsImport (query) {
  return post('/order/manage/logistics/import', { ...query })
}

export function orderDetail (orderId) {
  const data = {
    orderId
  }

  return get('/order/manage/detail', data)
}
