import React, { useEffect, useState } from 'react'
import { View, Input } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import taro from '@tarojs/taro'
import { setUserInfo } from '@/storage/setter'
import { codeLogin, verificationCode } from '@/api/login'
import './login.scss'

function Login() {
  const backHome = () =>
    taro.reLaunch({
      url: '/pages-user/index/index',
    })
  useEffect(() => {
    taro.hideHomeButton()
  }, [])

  const [phone, setPhone] = useState('13111111111')
  const [code, setCode] = useState('123456')
  const login = () =>
    codeLogin({
      phone,
      code,
    }).then(data => {
      setUserInfo(data)
      taro.navigateTo({
        url: '/pages-worker/index/index',
      })
    })
  const verifyCode = () =>
    verificationCode({
      phone,
      type: 'LOGIN',
    }).then(data => setCode(data))

  return (
    <View className="container">
      <View className="login-card">
        <View className="title">登录</View>
        <View className="flex-between input-wrapper account">
          <View className="flex-start-center">
            <View className="iconfont icon-zhanghu"></View>
            <Input
              placeholder="请输入手机号"
              onInput={e => setPhone(e.detail.value)}
            ></Input>
          </View>
          <View className="iconfont icon-yiguanbi"></View>
        </View>
        <View className="flex-between input-wrapper pasword">
          <View className="flex-start-center">
            <View className="iconfont icon-quanxian"></View>
            <Input placeholder="请输入验证码"></Input>
          </View>
          <View className="verifycode" onClick={verifyCode}>
            获取验证码
          </View>
        </View>
      </View>
      <AtButton type="primary" circle onClick={login}>
        登录
      </AtButton>
      <View className="navigator" onClick={backHome}>
        返回首页
      </View>
    </View>
  )
}
export default Login
