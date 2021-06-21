import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Swiper,
  SwiperItem,
  Image,
  Input,
} from '@tarojs/components'
import taro, { useReachBottom } from '@tarojs/taro'
import { workerList } from '@/api/user/worker'
import { chooseMember } from '@/api/member'
import FloatLayout from '@/components/float-layout/float-layout'
import WorkerItem from '@/components/worker-item/worker-item'

import 'taro-ui/dist/style/components/float-layout.scss'
import './index.scss'

const SEX_ENUM: Array<string> = ['未知', '男', '女']

function ObjectBox(props) {
  const [member, setMember] = useState(0)
  return (
    <View className="member-modal">
      <View className="flex-start-start">
        {props.members.map((item, index) => (
          <View
            className={`filter-item ${member == index ? 'active' : ''}`}
            key={item.id}
            onClick={() => setMember(index)}
          >
            {item.name}
          </View>
        ))}
      </View>
      <View className="btn-confirm" onClick={() => props.onConfirm(member)}>
        确认
      </View>
    </View>
  )
}
function ServiceObject(props) {
  const [isOpen, setIsOpen] = useState(false)
  const [members, setMembers] = useState([])
  const [member, setMember]: any = useState(null)

  useEffect(() => {
    chooseMember().then(data => {
      setMembers(data)

      if (data?.length) {
        setMember(data.find((item: any) => item.def == 1))
      }
    })
  }, [])
  useEffect(() => {
    props.onMemberChange(member)
  }, [member])

  const onConfirm = payload => {
    setIsOpen(false)
    setMember(members[payload])
  }
  return (
    <>
      {members && (
        <FloatLayout
          modalTitle="护理对象"
          isOpen={isOpen}
          close={() => setIsOpen(false)}
          layoutBody={<ObjectBox members={members} onConfirm={onConfirm} />}
        />
      )}

      <View
        className="flex-between service-object"
        onClick={() => setIsOpen(true)}
      >
        <View className="flex-start-center">
          <Image
            src={require('@/static/object-icon.png')}
            mode="widthFix"
            className="icon"
          />
          <View>护理对象</View>
        </View>
        <View className="iconfont icon-xiangyou">
          {member?.name || '选择护理对象'}
        </View>
      </View>
    </>
  )
}
function Swipers() {
  const swipper = [
    require('@/static/banner.png'),
    require('@/static/banner1.png'),
    require('@/static/banner2.png'),
  ]
  return (
    <View className="swiper">
      <Swiper
        indicatorColor="#fff"
        indicatorActiveColor="#0AB2C1"
        previousMargin="10px"
        nextMargin="10px"
        circular
        indicatorDots
        autoplay
      >
        {swipper.map((item, index) => (
          <SwiperItem key={index}>
            <View className="swiper-item">
              <Image className="swiper-img" mode="widthFix" src={item} />
            </View>
          </SwiperItem>
        ))}
      </Swiper>
    </View>
  )
}

function Tabs(props) {
  const tabs = [
    {
      img: require('@/static/peihu.png'),
      active: require('@/static/peihu-active.png'),
      title: '陪护',
      key: '1',
    },
    {
      img: require('@/static/peijian.png'),
      active: require('@/static/peijian-active.png'),
      title: '陪检',
      key: '2',
    },
    {
      img: require('@/static/biaoben.png'),
      active: require('@/static/biaoben-active.png'),
      title: '送标本',
      key: '3',
    },
  ]
  const [active, setActive] = useState('1')
  const gotoWorker = () =>
    taro.reLaunch({
      url: '/pages-worker/login/login',
    })
  const onTabChange = active => {
    setActive(active)
    props.onTabChange(active)
  }

  return (
    <View className="flex-between app-card tab-wrapper">
      {tabs.map(item => (
        <View
          className="tab"
          key={item.key}
          onClick={() => onTabChange(item.key)}
        >
          <Image
            className="tab-img"
            mode="widthFix"
            src={item.active}
            style={{ display: active == item.key ? '' : 'none' }}
          ></Image>
          <Image
            className="tab-img"
            mode="widthFix"
            src={item.img}
            style={{ display: active == item.key ? 'none' : '' }}
          ></Image>
          <View>{item.title}</View>
        </View>
      ))}
      <View className="tab" onClick={gotoWorker}>
        <Image
          className="tab-img"
          mode="widthFix"
          src={require('@/static/yuangong.png')}
        ></Image>
        <View>员工通道</View>
      </View>
    </View>
  )
}

function FilterBox(props) {
  const AGES: Array<string> = [
    '不限',
    '20-29',
    '30-39',
    '40-49',
    '50-59',
    '60岁以上',
  ]
  const SEXS: Array<string> = ['不限', '男', '女']
  const EDUCATIONS: Array<string> = [
    '不限',
    '小学',
    '初中',
    '高中',
    '中专',
    '大专',
    '本科',
    '硕士',
    '博士',
  ]

  const [age, setAge] = useState(0)
  const [sex, setSex] = useState(props.sex)
  const [education, setEducation] = useState(0)

  const confirm = () => {
    const [startAge, endAge = ''] =
      age == 0 ? ['', ''] : age == 5 ? ['60', ''] : AGES[age].split('-')
    const payload = {
      startAge,
      endAge,
      sex,
      education,
    }
    props.onConfirm(payload)
  }

  const date = new Date()
  const years: Array<number> = []
  const months: Array<number> = []
  const days: Array<number> = []

  for (let i = 1990; i <= date.getFullYear(); i++) {
    years.push(i)
  }
  for (let i = 1; i <= 12; i++) {
    months.push(i)
  }
  for (let i = 1; i <= 31; i++) {
    days.push(i)
  }

  // const [state, setState] = useState({
  //   years,
  //   year: date.getFullYear(),
  //   months,
  //   month: 2,
  //   days,
  //   day: 2,
  //   value: [9999, 1, 1],
  // })

  // const onChange = e => {
  //   const val = e.detail.value
  //   setState(
  //     Object.assign(state, {
  //       year: state.years[val[0]],
  //       month: state.months[val[1]],
  //       day: state.days[val[2]],
  //       value: val,
  //     }),
  //   )
  // }

  return (
    <>
      <View className="filter-label">年龄</View>
      <View className="flex-start-start">
        {AGES.map((item, index) => (
          <View
            className={`filter-item ${age == index ? 'active' : ''}`}
            key={index}
            onClick={() => setAge(index)}
          >
            {item}
          </View>
        ))}
      </View>
      <View className="filter-label">性别</View>
      <View className="flex-start-start">
        {SEXS.map((item, index) => (
          <View
            className={`filter-item ${sex == index ? 'active' : ''}`}
            key={index}
            onClick={() => setSex(index)}
          >
            {item}
          </View>
        ))}
      </View>
      <View className="filter-label">学历</View>
      <View className="flex-start-start">
        {EDUCATIONS.map((item, index) => (
          <View
            className={`filter-item ${education == index ? 'active' : ''}`}
            key={index}
            onClick={() => setEducation(index)}
          >
            {item}
          </View>
        ))}
      </View>
      {/* <View className="flex-between picker-view">
        <PickerView
          indicatorStyle="height: 50px;"
          style={{ width: '98%', height: '130px' }}
          value={state.value}
          onChange={onChange}
        >
          <PickerViewColumn>
            {state.years.map(item => (
              <View>{item}年</View>
            ))}
          </PickerViewColumn>
          <PickerViewColumn>
            {state.months.map(item => (
              <View>{item}月</View>
            ))}
          </PickerViewColumn>
          <PickerViewColumn>
            {state.days.map(item => (
              <View>{item}日</View>
            ))}
          </PickerViewColumn>
        </PickerView>
        <View style={{ marginRight: '20px' }}>至</View>
        <PickerView
          indicatorStyle="height: 50px;"
          style={{ width: '98%', height: '130px' }}
          value={state.value}
          onChange={onChange}
        >
          <PickerViewColumn>
            {state.years.map(item => (
              <View>{item}年</View>
            ))}
          </PickerViewColumn>
          <PickerViewColumn>
            {state.months.map(item => (
              <View>{item}月</View>
            ))}
          </PickerViewColumn>
          <PickerViewColumn>
            {state.days.map(item => (
              <View>{item}日</View>
            ))}
          </PickerViewColumn>
        </PickerView>
      </View> */}
      <View className="btn-confirm" onClick={confirm}>
        确认
      </View>
    </>
  )
}

function List(props) {
  const gotoDetail = (worker: any) => {
    taro.navigateTo({
      url: `/pages-user/worker/worker?id=${worker.id}&bizId=${worker.bizId}`,
    })
  }

  const params = {
    current: 0,
    sex: props.member?.sex || 0,
  }
  const [workers, setWorkers]: Array<any> = useState([])
  const loadData = () => {
    params.current++

    workerList({ ...params, bizId: props.tab }).then(data =>
      setWorkers(
        params.current === 1 ? data.records : [...workers, ...data.records],
      ),
    )
  }

  useEffect(() => {
    params.current = 0
    loadData()
  }, [props.tab])
  useReachBottom(loadData)

  const [isOpen, setIsOpen] = useState(false)
  const onConfirm = (form: object) => {
    Object.assign(params, form)
    setIsOpen(false)
    loadData()
  }

  return (
    <View>
      <FloatLayout
        modalTitle="高级筛选"
        isOpen={isOpen}
        close={() => setIsOpen(false)}
        layoutBody={<FilterBox sex={props.member?.sex} onConfirm={onConfirm} />}
      />
      <View className="flex-between filter-wrapper">
        <View>
          <Text>评分</Text>
          <Text className="iconfont icon-paixu"></Text>
        </View>
        <View>
          <Text>年龄</Text>
          <Text className="iconfont icon-paixu"></Text>
        </View>
        <View className="flex-start-center input-box">
          <Text className="iconfont icon-sousuo"></Text>
          <Input
            type="text"
            placeholder="按姓名搜索"
            placeholderStyle="font-size: 26rpx; color: #999"
            style={{ width: '120px' }}
          />
        </View>
        <View onClick={() => setIsOpen(true)}>
          <Text className="iconfont icon-shaixuan"></Text>
          <Text>高级筛选</Text>
        </View>
      </View>
      <WorkerItem workers={workers} />
    </View>
  )
}

function Index() {
  const peihu: string =
    '在患者住院期间解决患者生活中的不便（如：患者个人的清洁打理、帮扶上厕所、下楼呼吸新鲜空气等）'
  const peijian: string =
    '为防范和处理病人在途中或检查时发生意外，保证医疗护理安全 。 陪检工作制度 1、对住院患者应根据病情、行为能力等情况决定是否需要陪检，对危、急、重、行动不便患者必须陪检。'
  const biaoben: string =
    '根据不同检验项目标本采集需要，与患者沟通，告知患者检验前应做哪些准备及如何配合，以使采集的标本达到检测要求。正确采集标本后，及时处理，尽快送检，尽量减少运输时间和保存时间。'

  const [description, setDescription] = useState(peihu)
  const [tab, setTab] = useState('1')
  const [member, setMember] = useState(null)

  useEffect(
    () => setDescription(tab == '1' ? peihu : tab == '2' ? peijian : biaoben),
    [tab],
  )
  return (
    <>
      <navigation title="首页" />
      <ServiceObject onMemberChange={(member: object) => setMember(member)} />
      <Swipers />
      <Tabs onTabChange={(tab: string) => setTab(tab)} />
      <View className="app-card description">{description}</View>
      <List tab={tab} member={member} />
    </>
  )
}
export default Index
