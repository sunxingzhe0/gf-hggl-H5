import request from '@/utils/request'

/**
 * 消息列表
 * @returns
 */
export const noticeList = () => request.get('/api/v1/notice/list')

/**
 * 一键已读
 * @returns
 */
export const changeReaded = (data: object) =>
  request.post('/api/v1/notice/changeReaded', data)

/**
 * 删除消息
 * @returns
 */
export const noticeDelete = (data: object) =>
  request.post('/api/v1/notice/delete', data)

/**
 * 读取消息并修改为已读
 * @returns
 */
export const get = (data: object) => request.get('/api/v1/notice/get', data)
