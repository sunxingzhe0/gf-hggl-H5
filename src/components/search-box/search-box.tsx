import React, { useState } from 'react'
import { View, Text, Input } from '@tarojs/components'
import './search-box.scss'
function SearchBox(props) {
  const [inputValue, setInputValue] = useState('')
  const onChange = event => {
    setInputValue(event.value)
    this.props.onChange(event.value)
  }
  return (
    <View className="flex-start-center input-box">
      <Text className="iconfont icon-sousuo"></Text>
      <Input
        type="text"
        placeholder="按姓名搜索"
        placeholderClass="placeholder"
        style={{ width: '120px' }}
        value={inputValue}
        onConfirm={onChange}
      />
    </View>
  )
}
export default SearchBox
