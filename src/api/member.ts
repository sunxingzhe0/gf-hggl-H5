import request from '@/utils/request'

/**
 * 当前用户护理对象列表
 * @returns
 */
export const chooseMember = () => request.get('/api/v1/member/chooseMember')

/**
 * 新增护理对象
 * @param birthday	生日
 * @param def	是否默认 1：是 0：否 DEF：0
 * @param id
 * @param labelId	标签id，英文逗号分隔
 * @param name	姓名
 * @param sex	性别
 * @returns
 */
export const add = (data: any) => request.post('/api/v1/member/add', data)

/**
 *
 * @param birthday	生日
 * @param def	是否默认 1：是 0：否 DEF：0
 * @param id
 * @param labelId	标签id，英文逗号分隔
 * @param name	姓名
 * @param sex	性别
 * @returns
 */
export const setDefault = (data: any) =>
  request.post('/api/v1/member/setDefault', data)

/**
 * 护理对象标签
 * @returns
 */
export const chooseMemberLabel = () =>
  request.get('/api/v1/member/chooseMemberLabel')
