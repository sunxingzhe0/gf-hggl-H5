import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { AtCalendar } from 'taro-ui'
import taro from '@tarojs/taro'
import { workerOrderList, todayCount, countType } from '@/api/worker/order'
import moment from 'moment'
import { getStorage } from '@/storage/getter'

import './index.scss'

const SEX_ENUM: Array<string> = ['未知', '男', '女']

function ListItem(props) {
  const goOrder = (workId: string) => {
    taro.navigateTo({
      url: `/pages-worker/order/order?workId=${workId}`,
    })
  }

  return (
    <>
      {props.orders.map(item => (
        <View
          className="flex-start-stretch list-item"
          key={item.orderId}
          onClick={() => goOrder(item.workId)}
        >
          <View className="left">
            {item.typeName.split('').map(t => (
              <View>{t}</View>
            ))}
          </View>
          <View className="right">
            <View className="title">{item.content}</View>
            <View className="flex-between">
              <View className="time">任务时间：{item.schDate}</View>
              <View className="state">超时</View>
            </View>
            <View className="user">
              {item.patientName} | {SEX_ENUM[item.patientSex]} |
              {item.patientAge}岁 | 床号：{item.bedNum}
            </View>
          </View>
        </View>
      ))}
    </>
  )
}
function Index() {
  const username: string = getStorage('username')
  const weeks = ['日', '一', '二', '三', '四', '五', '六']
  const d = new Date()
  const mo = moment(d)
  const day: number = d.getDay()

  const [schDate, setSchDate] = useState(mo)
  const [count, setCount]: any = useState({})
  const [typeCount, setTypeCount] = useState([])
  const [orders, setOrders] = useState([])

  const loadData = () => {
    todayCount().then(data => setCount(data))
    countType().then(data => setTypeCount(data))
    workerOrderList({}).then(data => setOrders(data.records))
  }
  useEffect(loadData, [])

  return (
    <>
      <navigation title="工作日程" />
      <View className="date-container">
        <View className="flex-between current-date">
          <View>
            <Text style="font-size: 54rpx">{mo.format('MM')}</Text>
            <Text>/{mo.format('DD')}</Text>
            <Text style="margin-left: 20rpx">
              {mo.format('YYYY[年]')} 星期{weeks[day]}
            </Text>
          </View>
          <View className="iconfont icon-shuaxin" onClick={loadData}></View>
        </View>
        <View className="app-card">
          <View>
            <Text>你好，</Text>
            <Text style="color: #1a1a1a">{username}！</Text>
          </View>
          <View>
            <Text>今日工作项共计</Text>
            <Text className="color-primary">{count.all || 0}</Text>
            <Text>条，还有</Text>
            <Text className="color-primary">{count.unprocessed || 0}</Text>
            <Text>条待办事项需要处理。</Text>
          </View>
        </View>
        <AtCalendar currentDate={schDate} />
      </View>
      <View className="total">
        {typeCount.map((item, index) => (
          <>
            <Text key={index}>{item.typeName}</Text>
            <Text className="color-primary">{item.count}</Text>
            <Text>条{index < typeCount.length - 1 && '，'}</Text>
          </>
        ))}
      </View>
      <ListItem orders={orders} />
    </>
  )
}
export default Index
