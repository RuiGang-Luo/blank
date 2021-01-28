import axios from 'axios'
import { Message } from 'element-ui' // MessageBox,
import store from '@/store'
import { getToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const baseURL = (process.env.VUE_APP_PUBLIC_PATH === '/' ? '' : process.env.VUE_APP_PUBLIC_PATH)
// create an axios instance
const service = axios.create({
  baseURL: baseURL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (config.url.endsWith('/core/oauth/token')) {
      config.headers.Authorization = 'Basic bWFuYWdlbWVudC13ZWI6dGVzdF93ZWI='
    } else {
      if (store.getters.token) {
        // let each request carry token
        // ['X-Token'] is a custom headers key
        // please modify it according to the actual situation
        config.headers['X-Token'] = getToken()// mock
        config.headers.Authorization = 'bearer' + store.getters.token //
      }
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    store.dispatch('user/refreshSessionExpires', 1800)
    const contentType = response.headers['content-type']
    // 对于Excel报表导出需要特殊处理
    const matchRule = /^application\/(octet-stream|vnd.ms)/
    if (contentType && contentType.match(matchRule)) {
      console.info('==> 报表导出响应!')
      return response
    }
    const res = response.data
    if (res.code && res.code === 200) {
      // 处理响应数据中不包含data的情况
      if (res.data === undefined) {
        return res
      }
      return res.data
    } else if (response.config.url.endsWith('/core/oauth/token')) {
      return res
    } else {
      Message({
        message: res.message || response.error_description || response,
        type: 'error',
        duration: 10 * 1000
      })
      // TODO
      return Promise.reject(new Error(res.msg || response))
    }
    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    //
    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    // }
  },
  error => {
    console.log(error)
    // 令牌失效时，session并不一定失效
    if (error.response.status === 401) {
      if (error.response.data.error.startsWith('unauthorized')) {
        return Promise.reject('登录凭证无效')
      }
      store.dispatch('user/refreshToken')
        .then(() => {
          // 成功从新请求数据
          const url = error.request.responseURL.substring(error.request.responseURL.indexOf(baseURL) + baseURL.length)
          console.log(url)
          return Promise.resolve(service({
            url: url, //
            method: error.config.method,
            data: error.config.data,
            params: error.config.params
          }))
        }).catch((data) => {
          Message({
            message: data,
            type: 'error',
            duration: 5 * 1000
          })
          store.dispatch('user/resetToken').then(() => {
            resetRouter()
            router.push({ path: '/login', query: null })
          })
        })
    } else {
      if (error.response.status === 400) {
        if (error.response.data.error_description.startsWith('Invalid refresh token:')) {
          return Promise.reject('本账号已经在其它地点登录，如果不是本人操作请尽快修改密码')
        } else if (error.response.data.error_description.startsWith('Bad credentials')) {
          return Promise.reject('登录凭证无效')
        } else if (error.response.data.error_description.startsWith('User is disabled')) {
          return Promise.reject('用户已经被禁用')
        }
      }
      Message({
        message: error.response.data.error_description || error,
        type: 'error',
        duration: 5 * 1000
      })
      this.$store.dispatch('tagsView/delAllViews')
      return Promise.reject(error)
    }
  }
)

export default service
