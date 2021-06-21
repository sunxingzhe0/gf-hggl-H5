import request from '@/utils/request'

/**
 * 我的护工列表
 * @returns
 */
export const myWorkerList = () =>
  request.get('/api/v1/mobile/worker/myWorkerList')

/**
 * 首页护工列表
 * @returns
 */
export const workerList = (data: object) =>
  request.get('/api/v1/mobile/worker/list', data)

/**
 * 护工预约详情页
 * @returns
 */
export const getWorkerInfo = (data: object) =>
  request.get('/api/v1/mobile/worker/getWorkerInfo', data)
