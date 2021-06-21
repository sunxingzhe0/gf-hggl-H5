import request from '@/utils/request'

/**
 * 预约护工排班时段价格详情
 * @param data
 * @returns
 */
export const getNurseScheInfo = (data: object) =>
  request.get('/api/v1/schedule/getNurseScheInfo', data)
