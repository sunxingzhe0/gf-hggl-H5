import React, { useEffect, useState } from 'react'
import { View, Input, Text, Picker } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { chooseMemberLabel, add } from '@/api/member'
import taro, { navigateBack } from '@tarojs/taro'
import './object.scss'

function Tags(props) {
  const [tagList, setTagList] = useState([])
  useEffect(() => {
    chooseMemberLabel().then((data: Array<any>) => setTagList(data))
  }, [])

  const [checkedList, setCheckedList] = useState([])
  const onChecked = (id: string) => {
    const index: number = checkedList.indexOf(id)
    if (index > -1) {
      checkedList.splice(index, 1)
      setCheckedList(checkedList)
    } else {
      checkedList.push(id)
      setCheckedList(checkedList)
    }

    props.onChange(checkedList)
  }
  return (
    <View className="flex-start-start">
      {tagList.map(item => (
        <View
          className={`tag ${checkedList.includes(item.id) && 'active'}`}
          key={item.id}
          onClick={() => onChecked(item.id)}
        >
          {item.name}
        </View>
      ))}
    </View>
  )
}

function AddObject() {
  const sexs: Array<any> = [
    { label: '男', value: 1 },
    { label: '女', value: 2 },
    { label: '未知', value: 0 },
  ]
  const [name, setname] = useState('')
  const onNameInput = e => setname(e.detail.value)

  const [sex, setSex] = useState(0)
  const onSexChange = e => {
    setSex(e.detail.value)
  }

  const [birthday, setBirthday] = useState('')
  const onDateChange = e => setBirthday(e.detail.value)

  const [labelId, setLabelId] = useState('')
  const onTagChange = (targs: Array<string>) => setLabelId(targs.join())

  const submit = () => {
    if (!name || !birthday) {
      taro.showToast({
        icon: 'none',
        title: '请填写完整的信息',
      })
      return
    }

    taro.showLoading({
      title: '请稍等',
    })
    add({
      name,
      sex: sexs[sex].value,
      birthday,
      labelId,
    }).then(res => {
      navigateBack({
        delta: 1,
      })
    })
  }

  return (
    <>
      <navigation title="新增服务对象" />
      <View className="card">
        <View className="flex-start app-cell">
          <View className="label">
            <Text className="color-red">*</Text>
            <Text>姓名</Text>
          </View>
          <Input placeholder="请输入" onInput={onNameInput}></Input>
        </View>
        <Picker
          mode="selector"
          range={sexs}
          rangeKey="label"
          onChange={onSexChange}
        >
          <View className="flex-between app-cell">
            <View className="flex-start">
              <View className="label">
                <Text className="color-red">*</Text>
                <Text>性别</Text>
              </View>
              <View className="picker">{sexs[sex].label}</View>
            </View>
            <View className="iconfont icon-xiangyou"></View>
          </View>
        </Picker>
        <Picker mode="date" value="" onChange={onDateChange}>
          <View className="flex-between app-cell">
            <View className="flex-start">
              <View className="label">
                <Text className="color-red">*</Text>
                <Text>出生日期</Text>
              </View>
              <View className="picker">{birthday || '请选择'}</View>
            </View>
            <View className="iconfont icon-xiangyou"></View>
          </View>
        </Picker>
        <View className="app-cell">
          <View className="label">
            <Text className="color-red">*</Text>
            <Text>标签</Text>
          </View>
          <Tags onChange={onTagChange} />
        </View>
      </View>
      <AtButton type="primary" circle className="btn-submit" onClick={submit}>
        提交
      </AtButton>
    </>
  )
}
export default AddObject
