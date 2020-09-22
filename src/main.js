import Vue from 'vue'
import App from './App'
import axios from 'axios'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'    // 使用 CSS

Vue.use(iView)

new Vue({
  el: '#app',
  router,
  axios,
  template: '<App/>',
  components: { App }
})
// axios 配置
axios.defaults.timeout = 20000
axios.defaults.headers['Content-Type'] = 'application/json'
axios.defaults.baseURL = '/api'


/* 请求拦截 */
// axios.interceptors.request.use(
//   config => {
//     if (localStorage.getItem("token") != null) {
//       config.headers["token"] = localStorage.getItem("token");
//     }
//
//     return config;
//   },
//   err => Promise.reject(err)
// );

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      console.log('status-------'+error.response.status)
      switch (error.response.status) {
        case 401:
          // this.$Message.warning('你的登录信息已经失效，请重新登录')
          // this.$router.push('/logout')
          // vue.$Message.error('你的登录信息已经失效，请重新登录')
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath }
          })
          break
        case 504:
          vue.$Message.error('连接超时，请检查网络')
          break
        default:
          vue.$Message.error('你的登录信息已经失效，请重新登录')
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath }
          })
      }
    }
    return Promise.reject(error.response)
  }
)

export default axios
Vue.prototype.$http = axios
