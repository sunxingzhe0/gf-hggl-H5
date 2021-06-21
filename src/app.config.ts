export default {
  pages: [
    'pages-user/login/login',
    'pages-user/index/index',
    'pages-user/object/object',
    'pages-user/me/me',
    'pages-user/order/order',
    'pages-user/worker/worker',
    'pages-user/message/message',
    'pages-user/submit/submit',
    'pages-worker/login/login',
    'pages-worker/nursing/nursing',
    'pages-worker/index/index',
    'pages-worker/me/me',
    'pages-worker/order/order',
    'pages-worker/message/message',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom',
  },
  usingComponents: {
    navigation: 'wxcomponents/navigation/navigation',
  },
}
