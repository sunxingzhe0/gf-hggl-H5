import React, { useEffect, useState } from 'react'
import taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtCalendar } from 'taro-ui'
import { getWorkerInfo } from '@/api/user/worker'
import { getNurseScheInfo } from '@/api/schedule'
import moment from 'moment'
import './worker.scss'

const SEX_ENUM: Array<string> = ['未知', '男', '女']
function Card(props: any) {
  return (
    <View className="app-card card">
      <View className="flex-between">
        <View className="name">{props.worker.name}</View>
        <View>
          {SEX_ENUM[props.worker.sex]} | {props.worker.age}岁 |
          {props.worker.province}
        </View>
      </View>
      <View className="score">
        用心服务过 <Text style="color: #0AB2C1">{props.worker.number}</Text>
        次家庭 | 评分：
        <Text style="color: #FEAD00">{props.worker.score}分</Text>
      </View>
      {props.worker.remark && (
        <View className="intro">个人简介：{props.worker.remark}</View>
      )}
    </View>
  )
}
function CalendarComp() {
  const { params } = getCurrentInstance().router
  const weeks = ['日', '一', '二', '三', '四', '五', '六']
  const date = new Date()
  const year: number = date.getFullYear()
  const [month, setMonth] = useState(moment().format('MM'))
  const [schedule, setSchedule]: Array<any> = useState([])
  const [active, setActive]: any = useState({
    date: moment().format('YYYY-MM-DD'),
    formatDate: moment().format('YYYY[年]MM[月]DD[日]'),
    week: `星期${weeks[date.getDay()]}`,
  })

  const loadData = () => {
    getNurseScheInfo({
      busId: params.bizId,
      nurseId: params.id,
      date: `${year}-${month}`,
    }).then(data => {
      if (!data.length) return

      setSchedule(data)

      const d = data[0].date
      setActive({
        date: moment(d).format('YYYY-MM-DD'),
        formatDate: moment(d).format('YYYY[年]MM[月]DD[日]'),
        week: `星期${weeks[new Date(d).getDay()]}`,
      })
    })
  }
  useEffect(() => {
    loadData()
  }, [month])
  return (
    <>
      <AtCalendar
        onMonthChange={(value: string) => setMonth(value.split('-')[1])}
        onSelectDate={(option: any) =>
          setActive({
            date: option.value.start,
            formatDate: moment(option.value.start).format(
              'YYYY[年]MM[月]DD[日]',
            ),
            week: `星期${weeks[new Date(option.value.start).getDay()]}`,
          })
        }
      />
      <View className="time-box">
        <View className="date">
          {active.date}
          <Text style="margin-left: 20rpx;">{active.week}</Text>
        </View>
        {schedule
          .find(item => item.date == active.date)
          ?.timeDtos.map(ite => (
            <View className="flex-between">
              <View>
                {ite.name} （{ite.beginTime}-{ite.endTime}）
              </View>
              <View>¥{ite.price}</View>
              <View>已预约{ite.iprice}</View>
            </View>
          ))}
      </View>
    </>
  )
}
function Info() {
  const { params } = getCurrentInstance().router
  const [active, setActive] = useState(params.bizId)
  const [worker, setWorker]: any = useState({})
  useEffect(() => {
    getWorkerInfo({ id: params.id }).then(data => setWorker(data))
  }, [])
  return (
    <View className="app-card">
      <Card worker={worker} />
      <View className="label">项目</View>
      <View className="flex-start-start">
        {worker.bizList?.map((item: any) => (
          <View
            className={`tag, ${active == item.id && 'active'}`}
            key={item.id}
            onClick={() => setActive(item.id)}
          >
            {item.name}
          </View>
        ))}
      </View>
      <View className="label">业务描述</View>
      <View className="service-descript">
        {worker.bizList?.find(item => item.id == active)?.desc}
      </View>
      <View className="label">排班信息</View>

      <CalendarComp />
    </View>
  )
}
function Worker() {
  const { params } = getCurrentInstance().router
  const goForm = () => {
    taro.navigateTo({
      url: `/pages-user/submit/submit?id=${params.id}`,
    })
  }

  return (
    <>
      <navigation title="护工详情页" />
      <Info />
      <View className="btn-submit" onClick={goForm}>
        预约
      </View>
    </>
  )
}
export default Worker
