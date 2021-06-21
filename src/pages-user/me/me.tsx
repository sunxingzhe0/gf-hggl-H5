import React, { useEffect, useState } from 'react'
import taro from '@tarojs/taro'
import { View, Image, Text, Checkbox, CheckboxGroup } from '@tarojs/components'
import { chooseMember, setDefault } from '@/api/member'
import { orderList } from '@/api/user/order'
import { myWorkerList } from '@/api/user/worker'
import SearchBox from '@/components/search-box/search-box'
import WorkerItem from '@/components/worker-item/worker-item'
import FloatLayout from '@/components/float-layout/float-layout'
import { downLoadFile } from '@/utils/downLoad'
import { getStorage } from '@/storage/getter'

import './me.scss'
import './appointment.scss'
import './object.scss'
import './appraise.scss'

const SEX_ENUM: Array<string> = ['未知', '男', '女']
function Header() {
  const avatar: string = getStorage('avatar')
  const username: string = getStorage('username')
  return (
    <View className="header-bg">
      <View className="header-wrapper">
        <Image
          src={
            avatar
              ? downLoadFile(avatar)
              : require('@/static/defaultUserHeader.png')
          }
          mode="widthFix"
          className="header"
        ></Image>
      </View>
      <View className="text-center">{username}</View>
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
      url: require('@/static/my-appointment.png'),
      active: require('@/static/my-appointment-active.png'),
      key: 'appointment',
      title: '我的预约',
    },
    {
      url: require('@/static/my-worker.png'),
      active: require('@/static/my-worker-active.png'),
      key: 'worker',
      title: '我的护工',
    },
    {
      url: require('@/static/object.png'),
      active: require('@/static/object-active.png'),
      key: 'object',
      title: '服务对象',
    },
    {
      url: require('@/static/my-appraise.png'),
      active: require('@/static/my-appraise-active.png'),
      key: 'account',
      title: '我的评价',
    },
  ]
  const onTabChange = (active: string) => props.onTabChange(active)

  return (
    <>
      <View className="flex-between app-card tabs">
        {tabs.map(item => (
          <View
            className="text-center"
            key={item.key}
            onClick={() => onTabChange(item.key)}
          >
            <TabImage
              url={item.active}
              display={props.active == item.key ? '' : 'none'}
            />
            <TabImage
              url={item.url}
              display={props.active != item.key ? '' : 'none'}
            />
            <View>{item.title}</View>
          </View>
        ))}
      </View>
    </>
  )
}
function Appointment() {
  const STATUS: object = {
    NEW: '新订单',
    CONFIRM: '已确认',
    PAID_OFF: '已付款',
    COMPLETE: '已完成',
    CANCELLED: '已取消',
  }

  const goOrder = (id: string) =>
    taro.navigateTo({
      url: `/pages-user/order/order?orderId=${id}`,
    })

  const [isOpen, setIsOpen] = useState(false)
  const [orders, setOrders] = useState([])
  useEffect(() => {
    orderList().then(data => setOrders(data.records))
  }, [])

  return (
    <View className="appointment">
      <FloatLayout
        modalTitle="高级筛选"
        isOpen={isOpen}
        close={() => setIsOpen(false)}
      />
      <View className="flex-between filter-wrapper ">
        <SearchBox />
        <View className="iconfont icon-paixu1"></View>
        <View className="right" onClick={() => setIsOpen(true)}>
          <Text className="iconfont icon-shaixuan"></Text>
          <Text>高级筛选</Text>
        </View>
      </View>
      {orders.map(item => (
        <View
          className="app-card list-item"
          onClick={() => goOrder(item.orderId)}
        >
          <View className="flex-between">
            <View className="order-id">预约单号：{item.orderId}</View>
            <View className="state">{STATUS[item.orderStatus]}</View>
          </View>
          <View className="patient">
            <View className="flex-between">
              <View className="name">{item.patientName}</View>
              <View>
                <Text className="tag">{item.typeName}</Text>
                <Text className="tag grey">生活照护</Text>
              </View>
            </View>
            <View style={{ marginTop: '10px' }}>
              {SEX_ENUM[item.patientSex]}| {item.patientAge}岁 | {item.bedNum}
              号病床
            </View>
          </View>
          <View className="worker">
            <View className="flex-between">
              <View>
                <Text>护工：</Text>
                <Text className="name">{item.nurseName}</Text>
              </View>
              <View>
                {SEX_ENUM[item.nurseSex]} | {item.nurseAge}岁 |
                {item.nurseNative}
              </View>
            </View>
            <View>
              用心服务过
              <Text className="color-primary">{item.patientNum}</Text> 次家庭
              |&nbsp;
              <Text className="color-orange">评分：{item.nurseScore}分</Text>
            </View>
            <View>
              {item.startTime} - {item.endTime} ({item.days}天)
              {item.timeIntervalList.map(item => item).join(';')}
            </View>
          </View>
        </View>
      ))}
    </View>
  )
}
function MyWorker() {
  const goWorker = () =>
    taro.navigateTo({
      url: '/pages-user/worker/worker',
    })

  const [workers, setWorkers] = useState([])
  useEffect(() => {
    myWorkerList().then(data => setWorkers(data.records))
  }, [])

  return (
    <View>
      <View className="flex-between filter-wrapper ">
        <View>
          <Text>评分</Text>
          <Text className="iconfont icon-paixu"></Text>
        </View>
        <View>
          <Text>年龄</Text>
          <Text className="iconfont icon-paixu"></Text>
        </View>
        <View>
          <Text>项目</Text>
          <Text className="iconfont icon-dansanjiao"></Text>
        </View>
        <SearchBox />
      </View>
      <WorkerItem workers={workers} onTap={goWorker} />
    </View>
  )
}
function ObjectList() {
  const goAdd = () => {
    taro.navigateTo({
      url: '/pages-user/object/object',
    })
  }
  const goObject = (id: string) =>
    taro.navigateTo({
      url: `/pages-user/object/object?orderId=${id}`,
    })
  const loadData = () => {
    chooseMember().then(data => setMemberList(data))
  }
  const del = (id: string) => {
    console.log(id)
  }

  const [memberList, setMemberList] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const onDefaultChange = e => {
    setDefault({
      id: e.detail.value[0],
      def: 1,
    }).then(() => loadData())
  }

  return (
    <>
      {memberList.map(item => (
        <View className="app-card object" key={item.id}>
          <View>
            <View>
              <Text className="name">{item.name}</Text>
              <Text className="userinfo">
                {SEX_ENUM[item.sex]} ｜{item.birthday}
              </Text>
            </View>
            <View className="flex-start-start">
              {item.labelList.map(ite => (
                <View className="tag" key={ite.id}>
                  {ite.name}
                </View>
              ))}
            </View>
          </View>
          <View className="flex-between" style="margin-top: 20rpx">
            <CheckboxGroup onChange={onDefaultChange}>
              <Checkbox value={item.id} checked={item.def}>
                默认护理对象
              </Checkbox>
            </CheckboxGroup>
            <View>
              <Text
                className="iconfont icon-bianji"
                onClick={() => goObject(item.id)}
              >
                编辑
              </Text>
              <Text
                className="iconfont icon-shanchu"
                style="margin-left: 20rpx"
                onClick={() => del(item.id)}
              >
                删除
              </Text>
            </View>
          </View>
        </View>
      ))}

      <View className="btn-add" onClick={goAdd}>
        +新增护理对象
      </View>
    </>
  )
}
function Appraise() {
  return (
    <View className="appraise">
      <View className="flex-between filter-wrapper ">
        <View>
          <Text>评分</Text>
          <Text className="iconfont icon-paixu"></Text>
        </View>
        <View>
          <Text>年龄</Text>
          <Text className="iconfont icon-paixu"></Text>
        </View>
        <View>
          <Text>项目</Text>
          <Text className="iconfont icon-dansanjiao"></Text>
        </View>
        <SearchBox />
      </View>
      <View className="app-card list-item">
        <View className="flex-between">
          <View>
            <Text className="name">李小华</Text>
            <Text>女 | 47岁 | 重庆</Text>
          </View>
          <View>
            <Text className="tag">陪护</Text>
          </View>
        </View>
        <View className="score">
          用心服务过 <Text className="color-primary">14</Text> 次家庭 |&nbsp;
          <Text className="color-orange">评分：9.8分</Text>
        </View>
        <View className="order-id">预约单号：HG057N200101548200110A</View>
        <View className="flex-between">
          <View>
            <Text>评价：</Text>
            {[1, 2, 3, 4, 5].map(item => (
              <Text className="iconfont icon-wuxing" key={item}></Text>
            ))}
            <Text className="color-orange">非常满意</Text>
          </View>
          <View className="color-orange">2020-05-12 10:21</View>
        </View>
        <View>非常好，我非常满意！</View>
      </View>
    </View>
  )
}

function Me() {
  const [activeTab, setActiveTab] = useState('appointment')
  const [component, setComponent] = useState(<Appointment />)
  useEffect(() => {
    setComponent(
      activeTab == 'appointment' ? (
        <Appointment />
      ) : activeTab == 'worker' ? (
        <MyWorker />
      ) : activeTab == 'object' ? (
        <ObjectList />
      ) : (
        <Appraise />
      ),
    )
  }, [activeTab])

  return (
    <>
      <navigation title="我的" transparent />
      <Header />
      <Tabs
        onTabChange={(tab: string) => setActiveTab(tab)}
        active={activeTab}
      />
      {component}
    </>
  )
}
export default Me
