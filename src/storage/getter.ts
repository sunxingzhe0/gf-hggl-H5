import taro from '@tarojs/taro'

export function getStorage(key) {
  return taro.getStorageSync(key)
}
