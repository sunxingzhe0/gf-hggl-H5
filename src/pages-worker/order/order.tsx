import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { workerOrder, complete } from '@/api/worker/order'
import './order.scss'
import taro, { getCurrentInstance } from '@tarojs/taro'

const SEX_ENUM: Array<string> = ['未知', '男', '女']
function Order() {
  const { workId } = getCurrentInstance().router.params
  const [order, setOrder]: any = useState({})

  const loadData = () => {
    workerOrder(workId).then(data => setOrder(data))
  }
  const submit = () => {
    taro.showModal({
      title: '提示',
      content: '是否确认操作',
      success() {
        taro.showLoading({
          title: '申请执行工单',
        })
        complete(workId).then(() => {
          taro.showToast({
            title: '执行工单成功',
          })
          loadData()
        })
      },
    })
  }

  useEffect(loadData, [])

  return (
    <>
      <navigation title="工单详情" />
      <View className="flex-between status-wrapper">
        <View>{order.typeName}工单</View>
        <View>{order.workStatusText}</View>
      </View>
      <View className="card">
        <View className="title">患者信息</View>
        <View className="user-info">
          <View>
            <Text className="user-name">{order.patientName}</Text>
            <Text>
              {' '}
              | {SEX_ENUM[order.patientSex]} | {order.patientAge}岁 | 床号：
              {order.bedNum} | 电话：{order.phone}
            </Text>
          </View>
          <View>入院时间：{order.inHospTime}</View>
          <View>任务时间：{order.schDate}</View>
        </View>
        <View className="title">工单内容</View>
        <View className="work">{order.content}</View>
        <View className="title">备注</View>
        <View>{order.remark}</View>
      </View>
      <View className="app-card order-info">
        <View className="flex-between">
          <View className="flex-start">
            <View className="label">单据号</View>
            <View className="value">{order.workId}</View>
          </View>
          <View
            className="color-primary"
            onClick={() => taro.setClipboardData({ data: order.workId })}
          >
            复制
          </View>
        </View>
        <View className="flex-start">
          <View className="label">执行人</View>
          <View className="value">{order.nurseName} 一组</View>
        </View>
        <View className="flex-start">
          <View className="label">执行时间</View>
          <View className="value">{order.completeTime}</View>
        </View>
        <View className="flex-start border-top">
          <View className="label">创建人</View>
          <View className="value">{order.createUserName}</View>
        </View>
        <View className="flex-start">
          <View className="label">创建时间</View>
          <View className="value">{order.createTime}</View>
        </View>
      </View>
      <View className="app-card" style="display: none">
        <View className="flex-between">
          <View>
            <Text>打分：</Text>
            {[1, 2, 3, 4, 5].map(item => (
              <Text className="iconfont icon-wuxing" key={item}></Text>
            ))}
            <Text className="color-orange">非常满意</Text>
          </View>
          <View className="color-orange">2020-05-12 10:21</View>
        </View>
        <View style="margin-left: 80rpx">非常好，我非常满意！</View>
      </View>
      {order.workStatus == 'NEW' && (
        <View className="btn-submit" onClick={submit}>
          执行
        </View>
      )}
    </>
  )
}
export default Order
