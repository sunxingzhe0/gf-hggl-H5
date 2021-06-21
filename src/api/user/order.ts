import request from '@/utils/request'

/**
 * 我的预约列表
 * @returns
 */
export const orderList = () => request.get('/api/v1/user/order/list')

/**
 * 预约单详情
 * @returns
 */
export const order = (orderId: string) =>
  request.get(`/api/v1/user/order/${orderId}`)

/**
 * 预约单详情
 * @returns
 */
export const add = (data: object) =>
  request.post('/api/v1/user/order/add', data)
