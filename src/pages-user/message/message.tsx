import React, { useEffect, useState } from 'react'
import { View, Image } from '@tarojs/components'
import { noticeList, changeReaded } from '@/api/notice'

import './message.scss'
function Message() {
  const [list, setList] = useState([])
  useEffect(() => {
    noticeList().then(data => setList(data.records))
  }, [])

  const already = () => changeReaded(null)

  return (
    <>
      <navigation title="系统消息" />
      {list.map(item => (
        <View key={item} className="app-card">
          <View className="flex-start-start" style="flex-wrap: nowrap">
            <View className="left">
              <Image
                className="left-icon"
                src={require('@/static/message.png')}
                mode="widthFix"
              ></Image>
            </View>
            <View className="right">
              <View className="flex-between">
                <View className="title">{item.title}</View>
                <View className="date">{item.sendTime}</View>
              </View>
              <View className="description">{item.content}</View>
            </View>
          </View>
        </View>
      ))}
      <View className="btn" onClick={already}>
        一键已读
      </View>
    </>
  )
}
export default Message
