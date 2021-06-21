import React from 'react'
import { View, Text } from '@tarojs/components'
import taro from '@tarojs/taro'
import './worker-item.scss'

const SEX_ENUM: Array<string> = ['未知', '男', '女']
export default function WorkerItem(props) {
  const goDetail = (params: any) => {
    taro.navigateTo({
      url: `/pages-user/worker/worker?id=${params.id}&bizId=${params.bizId}`,
    })
  }
  return (
    <>
      {props.workers.map(item => (
        <View
          className="app-card list-item"
          key={item.id}
          onClick={() => goDetail(item)}
        >
          <View className="flex-between">
            <View>
              <Text className="name">{item.name}</Text>
              <Text>
                {SEX_ENUM[item.sex]} | {item.age}岁 | {item.nowCity}
              </Text>
            </View>
            <View>
              {item.bizList.map(ite => (
                <Text className="tag" key={ite.id}>
                  {ite.name}
                </Text>
              ))}
            </View>
          </View>
          <View className="score">
            用心服务过{' '}
            <Text className="color-primary">{item.orderCount ?? 0}</Text> 次家庭
            | 评分：
            <Text className="color-orange">{item.score}分</Text>
          </View>
          {item.remark && (
            <View style="color: #333">个人简介：{item.remark}</View>
          )}
        </View>
      ))}
    </>
  )
}
