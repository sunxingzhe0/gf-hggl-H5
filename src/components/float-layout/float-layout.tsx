import React from 'react'
import { AtFloatLayout } from 'taro-ui'
import { View, Text } from '@tarojs/components'

import './float-layout.scss'
export default function FloatLayout(props: any) {
  return (
    <View className="app-modal">
      <AtFloatLayout
        isOpened={props.isOpen}
        onClose={() => props.close && props.close()}
      >
        <View className="modal-header">
          <View className="modal-title">{props.modalTitle || ''}</View>
          <Text className="iconfont icon-yiguanbi" onClick={props.close}></Text>
        </View>
        <View>{props.layoutBody ?? ''}</View>
      </AtFloatLayout>
    </View>
  )
}
