import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { orderInfo } from '@/api/worker/order'
import { getCurrentInstance } from '@tarojs/taro'

import './nursing.scss'

const SEX_ENUM: Array<string> = ['未知', '男', '女']
function Order(props) {
  return (
    <>
      <View className="order-title">关联工单</View>
      {props.order.map(item => (
        <View className="flex-start-stretch card list-item" key={item.workId}>
          <View className="left">
            {item.typeName.map(t => (
              <View>{t}</View>
            ))}
          </View>
          <View className="right">
            <View className="description">{item.content}</View>
            <View>
              任务时间：{item.schDate} {item.beginTime} ~ {item.endTime}
            </View>
          </View>
        </View>
      ))}
    </>
  )
}
function Nursing() {
  const { orderId }: any = getCurrentInstance().router.params
  const [info, setInfo]: any = useState({})
  useEffect(() => {
    orderInfo(orderId).then(data => setInfo(data))
  }, [])
  return (
    <>
      <navigation title="护理对象详情" />
      <View className="state">{info.orderStatusText}</View>
      <View className="card">
        <View className="title">患者信息</View>
        <View className="content border-bottom">
          <Text className="name">{info.patientName}</Text>
          <Text className="info">
            &nbsp; | {SEX_ENUM[info.patientSex]} | {info.patientAge}岁 | 床号：
            {info.bedNum} | 电话：{info.contactPhone}
          </Text>
          <View className="info">入院时间：{info.inHospTime} </View>
        </View>
        <View className="title">护理时间</View>
        {info.orderSchedules?.map(o => (
          <View className="content border-bottom">{o.schDate || '-'}</View>
        ))}

        <View className="title">工单内容</View>
        <View className="content border-bottom">{info.content}</View>
        <View className="title">备注</View>
        <View className="content">{info.remark}</View>
      </View>
      {info.workOrderList && <Order order={info.workOrderList} />}
    </>
  )
}
export default Nursing
