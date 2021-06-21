import request from '@/utils/request'

export const loginInfo = () => request.get('/api/v1/login/loginInfo')
