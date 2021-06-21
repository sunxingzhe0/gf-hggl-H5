import React, { useEffect, useState } from 'react'
import { View, Text, Textarea } from '@tarojs/components'
import { AtButton, AtRate } from 'taro-ui'
import taro, { getCurrentInstance } from '@tarojs/taro'
import FloatLayout from '@/components/float-layout/float-layout'
import { order } from '@/api/user/order'
import './order.scss'
function Header(props) {
  return (
    <View className="header-bg">
      <View className="state iconfont icon-daifukuan">
        {props.order.orderStatusText}
      </View>
      <View className="description">您的预约单已通过审核，请尽快支付！</View>
    </View>
  )
}
function Appraise() {
  return (
    <View className="app-card">
      <View className="flex-between-start">
        <View className="flex-start">
          <View style="color: #666">评价：</View>
          <View>
            <View>
              {[1, 2, 3, 4, 5].map(item => (
                <Text className="iconfont icon-wuxing" key={item}></Text>
              ))}
              <Text className="color-orange">非常满意</Text>
            </View>
            <View>非常好，我非常满意！</View>
          </View>
        </View>
        <View>2020-05-12 10:21</View>
      </View>
    </View>
  )
}
function Order() {
  const [isOpen, setIsOpen] = useState(false)
  const { orderId } = getCurrentInstance().router.params
  const [info, setInfo]: any = useState({})

  const loadData = () => {
    order(orderId).then(data => setInfo(data))
  }

  useEffect(loadData, [])

  return (
    <>
      <navigation title="预约单" transparent />
      <Header order={info} />
      <View className="app-card info-card">
        <View className="app-cell flex-start">
          <View className="label iconfont icon-yuyuexiangmu">预约项目</View>
          <View className="value">{info.typeName}</View>
        </View>
        <View className="app-cell flex-between">
          <View className="flex-start">
            <View className="label iconfont icon-hugongxiantiao">护理护工</View>
            <View className="value">{info.nurseName}</View>
          </View>
          <View className="iconfont icon-xiangyou"></View>
        </View>
        <View className="app-cell flex-start">
          <View className="label iconfont icon-shijian">护理时间</View>
          <View className="value">
            {info?.timeIntervalList?.map(item => item).join(';')}
          </View>
        </View>
        <View className="app-cell flex-between">
          <View className="flex-start">
            <View className="label iconfont icon-hugongxiantiao">被护理人</View>
            <View className="value">{info.patientName}</View>
          </View>
          <View className="iconfont icon-xiangyou"></View>
        </View>
        <View className="app-cell flex-start">
          <View className="label iconfont icon-beizhu">备注</View>
          <View className="value">{info.remark}</View>
        </View>
        <View className="app-cell flex-start">
          <View className="label iconfont icon-xuyao">需要</View>
          <View className="value">{info.needGoods}</View>
        </View>
      </View>
      <Appraise />
      <View className="app-card date-info">
        <View className="flex-between">
          <View className="flex-start">
            <View className="label">预约单号：</View>
            <View className="value">{info.orderId}</View>
          </View>
          <View
            className="copy"
            onClick={() => taro.setClipboardData({ data: info.orderId })}
          >
            复制
          </View>
        </View>
        <View className="flex-start">
          <View className="label">创建时间：</View>
          <View className="value">{info.createTime}</View>
        </View>
        {info.confirmTime && (
          <View className="flex-start">
            <View className="label">审核时间：</View>
            <View className="value">{info.confirmTime}</View>
          </View>
        )}

        {info.paymentMethod && (
          <View className="flex-start">
            <View className="label">支付方式：</View>
            <View className="value">{info.paymentMethod}</View>
          </View>
        )}

        {info.paymentTime && (
          <View className="flex-start">
            <View className="label">支付时间：</View>
            <View className="value">{info.paymentTime}</View>
          </View>
        )}
      </View>

      <View className="app-card money-info">
        <View className="flex-between">
          <View className="label">护理总额</View>
          <View className="value">¥{info.orderPrice}</View>
        </View>
        <View className="flex-between">
          <View className="label">优惠金额</View>
          <View className="value">- ¥{info.discountPrice}</View>
        </View>
        <View className="text-right">
          <Text className="label">应付款</Text>
          <Text className="value fee">¥{info.needPayMoney}</Text>
        </View>
      </View>
      <View className="bottom">
        {info.orderStatus == 'NEW' && (
          <>
            <AtButton className="grey" circle>
              取消
            </AtButton>
            {/* <AtButton type="primary" circle>
              付款
            </AtButton> */}
          </>
        )}
        {
          (info.orderStatus = 'COMPLETE' && (
            <AtButton className="grey" circle onClick={() => setIsOpen(true)}>
              评价
            </AtButton>
          ))
        }
      </View>

      <FloatLayout
        modalTitle="评价"
        isOpen={isOpen}
        close={() => setIsOpen(false)}
        layoutBody={<Evaluate orderId={info.orderId} onConfirm={loadData} />}
      />
    </>
  )
}

function Evaluate(props) {
  const [value, setValue] = useState(0)
  const [content, setContent] = useState('')

  const onConfirm = () => {
    props.onConfirm()
  }
  return (
    <>
      <AtRate value={value} onChange={e => setValue(e.detail.val)}></AtRate>
      <Textarea
        value={content}
        onInput={e => setContent(e.detail.value)}
      ></Textarea>
      <View className="btn-confirm" onClick={onConfirm}>
        确认
      </View>
    </>
  )
}

export default Order
