import taro from '@tarojs/taro'

export function setUserInfo(data: object) {
  for (let key in data) {
    taro.setStorage({
      key,
      data: data[key],
    })
  }
}

// 保存登录token
export function setToken(data: string) {
  taro.setStorage({
    key: 'token',
    data,
  })
}
