import React, { useEffect, useReducer, useState } from 'react'
import {
  View,
  Text,
  Textarea,
  CheckboxGroup,
  Checkbox,
  RadioGroup,
  Radio,
  Label,
  Navigator,
  Picker,
  Input,
} from '@tarojs/components'
import { AtButton, AtCalendar } from 'taro-ui'
import taro, { getCurrentInstance } from '@tarojs/taro'
import { getStorage } from '@/storage/getter'
import { chooseMember } from '@/api/member'
import { workerList } from '@/api/user/worker'
import { getNurseScheInfo } from '@/api/schedule'
import { add } from '@/api/user/order'
import FloatLayout from '@/components/float-layout/float-layout'

import './submit.scss'

const SEX_ENUM: Array<string> = ['未知', '男', '女']

function Calandar(props) {
  const date = new Date()
  const year = date.getFullYear()
  const [month, setMonth] = useState(`0${date.getMonth() + 1}`.substr(-2))
  const [schedule, setSchedule] = useState([])
  const [times, setTimes] = useState([])
  const [selected, setSelected] = useState([])

  const loadData = () => {
    getNurseScheInfo({
      busId: props.busId,
      date: `${year}-${month}`,
      nurseId: props.nurseId,
    }).then(data => setSchedule(data))
  }
  useEffect(() => {
    if (!!props.busId && !!props.nurseId) {
      loadData()
    }
  }, [props.busId, props.nurseId, month])

  const confirm = () => {
    props.onConfirm({
      dates: schedule
        .filter(item => item.timeDtos.some(ite => selected.includes(ite.id)))
        .map(item => item.date),
      schIds: selected,
    })
  }
  return (
    <>
      <AtCalendar
        onMonthChange={(value: string) => setMonth(value.split('-')[1])}
        onDayClick={e =>
          setTimes(schedule.find(item => item.date == e.value)?.timeDtos ?? [])
        }
      />
      <View className="time-box">
        <CheckboxGroup onChange={e => setSelected(e.detail.value)}>
          {times.map(t => (
            <Label key={t.id}>
              <View className="flex-between">
                <View>
                  {t.name} （{t.beginTime} ~ {t.endTime}）¥{t.price}
                </View>
                <Checkbox value={t.id} />
              </View>
            </Label>
          ))}
        </CheckboxGroup>
      </View>
      <View className="btn-confirm" onClick={confirm}>
        确认
      </View>
    </>
  )
}
function reducer(state, action) {
  switch (action.type) {
    case 'typeName': {
      const { id, name } = action.value
      return Object.assign({}, state, {
        typeId: id,
        typeName: name,
      })
    }
    case 'nurseName': {
      const { id, name, groupId } = action.value
      return Object.assign({}, state, {
        nurseId: id,
        nurseName: name,
        groupId,
      })
    }
    case 'patientName':
      const member = action.value
      return Object.assign({}, state, {
        patientName: member.name,
        patientId: member.id,
        patientSex: member.sex,
        patientAge: member.age,
      })
    default:
      return Object.assign({}, state, { [action.type]: action.value })
  }
}
function Submit() {
  const { params } = getCurrentInstance().router
  const bizList: Array<any> = getStorage('bizList')
  const [members, setMembers] = useState([])
  useEffect(() => {
    chooseMember().then(data => setMembers(data))
  }, [])

  const [protocol, setProtocol] = useState(0)

  const [form, dispatch] = useReducer(reducer, {
    clientType: 'mini',
    typeId: params.busId,
    typeName: '',
    nurseName: '',
    nurseId: params.id,
    groupId: '',
    schIds: [],
    schDates: [],
    deptId: 'D123123',
    deptName: '123123',
    inHospNo: 'ZY2386284123',
    bedNum: '123',
    patientId: '',
    patientName: '',
    patientAge: '',
    patientSex: '',
    contactName: '',
    contactPhone: '',
    remark: '',
    needGoods: [],
  })

  const [workers, setWorkers] = useState([])
  useEffect(() => {
    workerList({ pages: 999, bizId: form.typeId }).then(data =>
      setWorkers(data.records),
    )
  }, [form.typeId])

  const [isOpen, setIsOpen] = useState(false)
  const onCalandarConfirm = (value: any) => {
    dispatch({ type: 'schDates', value: value.dates })
    dispatch({ type: 'schIds', value: value.schIds })
    setIsOpen(false)
  }

  const submit = () => {
    if (!protocol) return

    taro.showLoading({
      title: '正在提交订单',
    })

    add(
      Object.assign({}, form, {
        needGoods: form.needGoods.join(),
      }),
    ).then(data => {
      if (!data) return
      taro.showToast({
        title: '提交成功',
      })

      setTimeout(() => {
        taro.navigateTo({
          url: `/pages-user/order/order?orderId=${data}`,
        })
      }, 1000)
    })
  }

  return (
    <>
      <navigation title="预约信息" />
      <View className="app-card info">
        <Picker
          range={bizList}
          rangeKey="name"
          onChange={e =>
            dispatch({ type: 'typeName', value: bizList[e.detail.value] })
          }
        >
          <View className="app-cell flex-between">
            <View className="flex-start-center">
              <View className="label">预约项目</View>
              <View>{form.typeName || '请选择'}</View>
            </View>
            <View>
              <Text className="iconfont icon-xiangyou"></Text>
            </View>
          </View>
        </Picker>
        <Picker
          range={workers}
          rangeKey="name"
          onChange={e =>
            dispatch({ type: 'nurseName', value: workers[e.detail.value] })
          }
        >
          <View className="app-cell flex-between">
            <View className="flex-start-center">
              <View className="label">预约护工</View>
              <View>{form.nurseName || '请选择'}</View>
            </View>
            <View>
              <Text className="iconfont icon-xiangyou"></Text>
            </View>
          </View>
        </Picker>
        <View className="app-cell flex-between" onClick={() => setIsOpen(true)}>
          <View className="flex-start-center">
            <View className="label">预约日期</View>
            <View>{form.schDates.join() || '请选择'}</View>
          </View>
          <View>
            <Text className="iconfont icon-xiangyou"></Text>
          </View>
        </View>
        <FloatLayout
          modalTitle="预约时间"
          isOpen={isOpen}
          close={() => setIsOpen(false)}
          layoutBody={
            <Calandar
              busId={form.typeId}
              nurseId={form.nurseId}
              onConfirm={onCalandarConfirm}
            />
          }
        />
        <View className="app-cell flex-between">
          <View className="flex-start-center">
            <View className="label">科室名称</View>
            <View>{form.deptName}</View>
          </View>
          <View>
            <Text className="iconfont icon-xiangyou"></Text>
          </View>
        </View>
        <View className="app-cell flex-start-center">
          <View className="label">住院号</View>
          <View>
            <Input
              value={form.inHospNo}
              placeholder="请输入"
              onInput={e =>
                dispatch({ type: 'inHospNo', value: e.detail.value })
              }
            />
          </View>
        </View>
        <View className="app-cell flex-start-center">
          <View className="label">病床号</View>
          <View>
            <Input
              value={form.bedNum}
              placeholder="请输入"
              onInput={e => dispatch({ type: 'bedNum', value: e.detail.value })}
            />
          </View>
        </View>
        <Picker
          range={members}
          rangeKey="name"
          onChange={e =>
            dispatch({ type: 'patientName', value: members[e.detail.value] })
          }
        >
          <View className="app-cell flex-between">
            <View className="flex-start-center">
              <View className="label">姓名</View>
              <View>{form.patientName}</View>
            </View>
            <View>
              <Text className="iconfont icon-xiangyou"></Text>
            </View>
          </View>
        </Picker>

        <View className="app-cell flex-start-center">
          <View className="label">年龄</View>
          {form.patientAge > 0 && <View>{form.patientAge}岁</View>}
        </View>
        <View className="app-cell flex-start-center">
          <View className="label">性别</View>
          <View>{SEX_ENUM[form.patientSex]}</View>
        </View>
        <View className="app-cell flex-start-center">
          <View className="label">联系人姓名</View>
          <View>
            <Input
              value={form.contactName}
              placeholder="请输入"
              onInput={e => dispatch({ type: 'bedNum', value: e.detail.value })}
            />
          </View>
        </View>
        <View className="app-cell flex-start-center">
          <View className="label">联系电话</View>
          <View>
            <Input
              value={form.contactPhone}
              placeholder="请填写手机号"
              onInput={e => dispatch({ type: 'bedNum', value: e.detail.value })}
            />
          </View>
        </View>
      </View>

      <View className="app-card">
        <View className="label">备注</View>
        <Textarea
          placeholder="请输入"
          value={form.remark}
          onInput={e => dispatch({ type: 'remark', value: e.detail.value })}
        />
      </View>

      <View className="app-card flex-start-center">
        <View className="label">需要</View>
        <View>
          <CheckboxGroup
            onChange={e =>
              dispatch({ type: 'needGoods', value: e.detail.value })
            }
          >
            <Label>
              <Checkbox value="轮椅" color="#0ab2c1" />
              轮椅
            </Label>
            <Label style={{ marginLeft: '20px' }}>
              <Checkbox value="推车床" color="#0ab2c1" />
              推车床
            </Label>
          </CheckboxGroup>
        </View>
      </View>
      <View className="protocol">
        <RadioGroup onChange={e => setProtocol(e.detail.value)}>
          <Label>
            <Radio value="1" color="#0ab2c1" />
            我同意
            <Navigator className="navigator" url="/pages-user/me/me">
              《护工服务协议》
            </Navigator>
          </Label>
        </RadioGroup>
      </View>

      <View className="flex-between bottom">
        <View>¥0.00</View>
        <View>
          <AtButton type="primary" circle onClick={submit}>
            提交
          </AtButton>
        </View>
      </View>
    </>
  )
}
export default Submit
