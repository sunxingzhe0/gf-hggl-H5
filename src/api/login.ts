import request from '@/utils/request'

/**
 * 患者登录
 * @param {code}
 * @returns
 */
export const userLogin = (data: object) =>
  request.get('/api/v1/login/mobile/miniProgramLogin', data)

/**
 * 用户-小程序解密用户信息
 * @param {encryptedData, iv}
 * @returns
 */
export const encryptedData = (data: object) =>
  request.post('/api/v1/login/mobile/encryptedData', data)

/**
 * 护工-手机验证码登录
 * @param data
 * @returns
 */
export const codeLogin = (data: object) =>
  request.post('/api/v1/login/mobile/codeLogin', data)

/**
 * 护工-手机验证码登录
 * @param data
 * @returns
 */
export const verificationCode = (data: object) =>
  request.post('/api/v1/login/verificationCode', data)
