import { get, post } from '@/utils/ajax.js'

/* 订单查询 */
export function getOrders (query) {
  return get('/order/manage/query', { ...query })
}

/* 物流单录入 */
export function logisticsImport (query) {
  return post('/order/manage/logistics/import', { ...query })
}

/* 订单详情 */
export function orderDetail (orderId) {
  const data = {
    orderId
  }

  return get('/order/manage/detail', data)
}

/* 物流查询 */
export function queryLogistics (orderNo) {
  const data = {
    orderNo
  }

  return get('/logistics/manage/query', data)
}
