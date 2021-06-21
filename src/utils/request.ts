import { request, showToast, hideLoading } from '@tarojs/taro'
import { baseUrl } from './url'
import { getStorage } from '@/storage/getter'

function send(params: any) {
  const token: string = getStorage('token')

  if (token) {
    params.method == 'POST'
      ? (params.url += `?token=${token}`)
      : Object.assign(params.data, {
          token,
        })
  }

  return request({
    url: baseUrl + params.url, //仅为示例，并非真实的接口地址
    data: params.data,
    method: params.method,
    success: function (res: any) {
      if (res.data.code != 0) {
        const { message } = res.data
        showToast({ icon: 'none', title: message })
        throw Error(message)
      }
    },
    fail: function (error) {
      console.log(error)
      showToast({
        icon: 'none',
        title: error.errMsg,
      })
      throw Error(error.errMsg)
    },
    complete: function () {
      hideLoading()
    },
  })
}

export default {
  get: async function get(url: string, data: object = {}) {
    return (
      await send({
        url,
        data,
        method: 'GET',
      })
    ).data.body
  },
  post: async function post(url: string, data: object = {}) {
    return (
      await send({
        url,
        data,
        method: 'POST',
      })
    ).data.body
  },
}
