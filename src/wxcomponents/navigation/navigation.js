Component({
  behaviors: [],
  properties: {
    title: String, // 简化的定义方式
    transparent: Boolean,
  },

  data: {
    fringe: [],
    pages: [],
    homePage: '',
    mePage: '',
    messagePage: '',
  }, // 私有数据，可用于模板渲染
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function() {
      const userType = wx.getStorageSync('userType')
      this.setData({
        homePage:
          userType == 'WORKER'
            ? 'pages-worker/index/index'
            : 'pages-user/index/index',
        mePage:
          userType == 'WORKER' ? 'pages-worker/me/me' : 'pages-user/me/me',
        messagePage:
          userType == 'WORKER'
            ? 'pages-worker/message/message'
            : 'pages-user/message/message',
      })

      this.setData({
        pages: getCurrentPages().map(item => item.route),
      })

      const fringe = wx.getStorageSync('fringe')
      this.setData({
        fringe,
      })
    },
    moved: function() {},
    detached: function() {},
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function() {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function() {},

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function() {},
    hide: function() {},
    resize: function() {},
  },

  methods: {
    _home: function() {
      console.log(this.data.homePage)
      const homeIndex = this.data.pages.indexOf(this.data.homePage)
      console.log(homeIndex)
      if (homeIndex > -1) {
        const delta = this.data.pages.length - homeIndex - 1
        delta > 0 &&
          wx.navigateBack({
            delta,
          })
      } else {
        wx.reLaunch({
          url: `/${this.data.homePage}`,
        })
      }
    },
    _me() {
      const meIndex = this.data.pages.indexOf(this.data.mePage)
      if (meIndex > -1) {
        const delta = this.data.pages.length - meIndex - 1
        delta > 0 &&
          wx.navigateBack({
            delta,
          })
      } else {
        wx.navigateTo({
          url: `/${this.data.mePage}`,
        })
      }
    },
    _message() {
      const messageIndex = this.data.pages.indexOf(this.data.messagePage)
      if (messageIndex > -1) {
        const delta = this.data.pages.length - messageIndex - 1
        delta > 0 &&
          wx.navigateBack({
            delta,
          })
      } else {
        wx.navigateTo({
          url: `/${this.data.messagePage}`,
        })
      }
    },
  },
})
