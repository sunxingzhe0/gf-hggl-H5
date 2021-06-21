import request from '@/utils/request'

/**
 * 工单类型统计
 * @returns
 */
export const countType = () => request.get('/api/v1/worker/workorder/countType')

/**
 * 工单今日统计
 * @returns
 */
export const todayCount = () =>
  request.get('/api/v1/worker/workorder/todayCount')

/**
 * 工单列表
 * @returns
 */
export const workerOrderList = (data: object) =>
  request.get('/api/v1/worker/workorder/list', data)

/**
 * 工单详情
 * @returns
 */
export const workerOrder = (workId: string) =>
  request.get(`/api/v1/worker/workorder/${workId}`)

/**
 * 执行工单
 * @returns
 */
export const complete = (workId: string) =>
  request.post(`/api/v1/worker/workorder/complete/${workId}`)

/**
 * 护理对象列表
 * @returns
 */
export const orderList = () => request.get('/api/v1/worker/order/list')

/**
 * 获取护理对象信息
 * @returns
 */
export const orderInfo = (orderId: string) =>
  request.get(`/api/v1/worker/order/${orderId}`)
