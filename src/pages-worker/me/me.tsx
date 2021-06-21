import React, { useEffect, useState } from 'react'
import { View, Text, Image, Progress } from '@tarojs/components'
import taro from '@tarojs/taro'
import { orderList, workerOrderList } from '@/api/worker/order'
import { getStorage } from '@/storage/getter'
import './me.scss'

const SEX_ENUM: Array<string> = ['未知', '男', '女']
function Welcome() {
  return (
    <View className="date-container">
      <View className="flex-between current-date">
        <View>
          <Text style="font-size: 54rpx">12</Text>
          <Text>/04</Text>
          <Text style="margin-left: 20rpx">2021年 星期一</Text>
        </View>
        <View className="iconfont icon-shuaxin"></View>
      </View>
      <View className="app-card welcome">
        <View>
          <Text>你好，</Text>
          <Text style="color: #1a1a1a">王小五！</Text>
        </View>
        <View>
          <Text>今日工作项共计</Text>
          <Text className="color-primary">20</Text>
          <Text>条，还有</Text>
          <Text className="color-primary">20</Text>
          <Text>条待办事项需要处理。</Text>
        </View>
      </View>
    </View>
  )
}
function TabImage(props) {
  return (
    <Image
      className="tab-img"
      mode="widthFix"
      src={props.url}
      style={{ display: props.display }}
    ></Image>
  )
}
function Tabs(props) {
  const tabs = [
    {
      url: require('@/static/object.png'),
      active: require('@/static/object-active.png'),
      key: 'ObjectList',
      title: '护理对象',
    },
    {
      url: require('@/static/worker/order.png'),
      active: require('@/static/worker/order-active.png'),
      key: 'Order',
      title: '历史工单',
    },
    {
      url: require('@/static/worker/account.png'),
      active: require('@/static/worker/account-active.png'),
      key: 'Account',
      title: '账号管理',
    },
  ]
  const [active, setActive] = useState('ObjectList')
  const tabChange = (key: string) => {
    setActive(key)
    props.onTabChange(key)
  }
  return (
    <View className="flex-around app-card tabs">
      {tabs.map(item => (
        <View className="text-center" onClick={() => tabChange(item.key)}>
          <TabImage
            url={item.active}
            display={active == item.key ? '' : 'none'}
          />
          <TabImage url={item.url} display={active != item.key ? '' : 'none'} />
          <View className={active == item.key && 'title-active'}>
            {item.title}
          </View>
        </View>
      ))}
    </View>
  )
}
function ObjectList() {
  const goOrder = (id: string) =>
    taro.navigateTo({
      url: `/pages-worker/nursing/nursing?orderId=${id}`,
    })

  const [list, setList]: any = useState([])
  useEffect(() => {
    orderList().then(data => setList(data.records))
  }, [])

  return (
    <>
      {list.map(item => (
        <View
          className="flex-start-stretch list-item"
          key={item.orderId}
          onClick={() => goOrder(item.orderId)}
        >
          <View className="left">
            {item.typeName.split('').map(t => (
              <View>{t}</View>
            ))}
          </View>
          <View className="flex-between right">
            <View>
              <View className="userinfo">
                <Text className="name">{item.patientName}</Text>
                <Text>
                  {SEX_ENUM[item.patientSex]} | {item.patientAge}岁 | 床号：
                  {item.bedNum}
                </Text>
              </View>
              <View className="time">入院时间：{item.inHospTime}</View>
              <View className="flex-start-center">
                <View>服务进度</View>
                <Progress
                  percent={item.progress}
                  strokeWidth={4}
                  active
                  showInfo={true}
                  fontSize="14px"
                  activeColor="#0ab2c1"
                />
              </View>
            </View>
            <View
              className="iconfont icon-xiangyou"
              style="margin-right: 10px"
            ></View>
          </View>
        </View>
      ))}
    </>
  )
}
function Order() {
  const [list, setList]: Array<any> = useState([])
  useEffect(() => {
    workerOrderList({ statusList: 'COMPLETED,CLOSED' }).then(data =>
      setList(data.records),
    )
  }, [])

  const goOrder = (workId: string) => {
    taro.navigateTo({
      url: `/pages-worker/order/order?workId=${workId}`,
    })
  }
  return (
    <>
      <View className="flex-between" style="color: #333">
        <View className="iconfont icon-rili">2021-04-01 - 2021-04-07</View>
        <View className="iconfont icon-xiangyou"></View>
      </View>
      {list.map(item => (
        <View
          className="flex-start-stretch list-item"
          key={item.workId}
          onClick={() => goOrder(item.workId)}
        >
          <View className="left">
            {item.typeName.split('').map(t => (
              <View>{t}</View>
            ))}
          </View>
          <View className="right">
            <View className="title">{item.content}</View>
            <View className="time">任务时间：{item.schDate} </View>
            <View className="flex-between info">
              <View>
                {item.patientName} | {SEX_ENUM[item.patientSex]} |{' '}
                {item.patientAge}岁 | 床号：{item.bedNum}
              </View>
              <View className="state">已完成</View>
            </View>
          </View>
        </View>
      ))}
    </>
  )
}
function Account() {
  const [info] = useState([
    {
      key: 'username',
      label: '姓名',
      value: getStorage('username'),
    },
    {
      key: 'group',
      label: '分组',
      value: '护理一组',
    },
    {
      key: 'hosp',
      label: '所在医院',
      value: '王小五',
    },
    {
      key: 'phone',
      label: '手机号',
      value: getStorage('phone'),
    },
    {
      key: 'sex',
      label: '性别',
      value: SEX_ENUM[getStorage('sex')],
    },
  ])
  const roleChange = () => {
    taro.removeStorageSync('token')
    taro.reLaunch({
      url: '/pages-user/login/login',
    })
  }
  const logout = () => {
    taro.reLaunch({
      url: '/pages-worker/login/login',
    })
  }

  return (
    <>
      <View className="card">
        {info.map((item, index) => (
          <View className="app-cell flex-between" key={index}>
            <View className="label">{item.label}</View>
            <View className="value">{item.value}</View>
          </View>
        ))}
      </View>
      <View className="flex-between btn-wrapper">
        <View className="color-primary button" onClick={roleChange}>
          身份切换
        </View>
        <View className="color-red button" onClick={logout}>
          账号注销
        </View>
      </View>
    </>
  )
}

function Me() {
  const [activeTab, setActiveTab] = useState('ObjectList')
  const [component, setComponent] = useState(<ObjectList />)
  useEffect(() => {
    setComponent(
      activeTab == 'ObjectList' ? (
        <ObjectList />
      ) : activeTab == 'Order' ? (
        <Order />
      ) : (
        <Account />
      ),
    )
  }, [activeTab])

  return (
    <>
      <navigation title="我的" />
      <Welcome />
      <Tabs onTabChange={(tab: string) => setActiveTab(tab)} />
      {component}
    </>
  )
}
export default Me
