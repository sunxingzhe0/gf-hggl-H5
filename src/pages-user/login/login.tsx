import React, { useState, useEffect } from 'react'
import taro from '@tarojs/taro'
import { View, Button, OpenData } from '@tarojs/components'
import { userLogin, encryptedData } from '@/api/login'
import { loginInfo } from '@/api/user'
import { setUserInfo } from '@/storage/setter'
import { getStorage } from '@/storage/getter'
import './login.scss'

function onGetUserInfo() {
  taro.getUserProfile({
    lang: 'zh_CN',
    desc: '完善用户信息',
    success(res) {
      encryptedData({
        encryptedData: res.encryptedData,
        iv: res.iv,
      }).then(data => {
        setUserInfo(data)
        gohome()
      })
    },
    fail() {
      gohome()
    },
  })
}
function gohome() {
  taro.navigateTo({
    url: '/pages-user/index/index',
  })
}

async function login(code) {
  taro.showLoading({
    title: '查询登录信息',
  })

  const data: any = await userLogin({ code })

  setUserInfo(data)

  return data
}
function CheckLogin() {
  const userType: string = getStorage('userType')
  const token: string = getStorage('token')
  if (userType == 'WORKER' && token) {
    taro.reLaunch({
      url: '/pages-worker/index/index',
    })
    return
  }

  const [showAuth, setShowAuth] = useState(false)
  const wxLogin = () => {
    taro.login({
      async success(res) {
        if (res.code) {
          const loginInfo = await login(res.code)

          if (loginInfo.username) {
            gohome()
          } else {
            setShowAuth(true)
          }
        } else {
          taro.showToast({
            icon: 'none',
            title: '登录失败！',
          })
          console.log('登录失败！' + res.errMsg)
        }
      },
    })
  }

  useEffect(() => {
    taro.checkSession({
      async success() {
        taro.showLoading({
          title: '查询登录信息',
        })

        if (!getStorage('token')) {
          wxLogin()
          return
        }

        const userInfo = await loginInfo()

        if (userInfo.username) {
          gohome()
        } else {
          setShowAuth(true)
        }
      },
      fail() {
        wxLogin()
      },
    })
  }, [])

  return (
    <View className="page" style={{ display: !showAuth ? 'none' : '' }}>
      <View className="container">
        <View className="title">微信授权</View>
        <View className="body">
          <View className="avatar">
            <OpenData type="userAvatarUrl"></OpenData>
          </View>
          <View className="content">互联网医院申请获得以下权限：</View>
          <View className="desc">· 获得你的公开信息（昵称、头像等）</View>
        </View>
        <View className="footer">
          <Button className="button" style="color: #666">
            取消
          </Button>
          <Button
            className="button"
            onClick={onGetUserInfo}
            style="color: #0ab2c1"
          >
            确认授权
          </Button>
        </View>
      </View>
    </View>
  )
}
export default CheckLogin
