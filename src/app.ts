import { Component } from 'react'
import taro from '@tarojs/taro'
import './styles/custom-variables.scss'
import './styles/app.scss'
import './styles/flex.css'
import './styles/iconfont.css'

class App extends Component {
  componentDidMount() {
    // 判断是否有刘海，顶部自定义导航栏高度使用
    const systemInfo = taro.getSystemInfoSync()
    const height = systemInfo.screenHeight - systemInfo.safeArea.height
    taro.setStorage({
      key: 'fringe',
      data: height > 20,
    })
  }
  render() {
    return this.props.children
  }
}

export default App
