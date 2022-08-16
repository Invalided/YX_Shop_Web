import axios from 'axios'
import {
  Message
} from 'element-ui'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    config.headers.token = localStorage.getItem('token')

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
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
    const res = response.data
    const code = response.status
    // if the custom code is not 100, it is judged as an error.
    // 后台数据未使用状态码 因此通过response.status判断返回值
    if (code !== 200) {
      Message({
        message: res.errMsg || 'Error check your token or method',
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject(new Error(res.errMsg || 'Error'))
    } else {
        if((res.success != null) && !(res.success)){
          Message({
            message: res.errMsg,
            type: 'error',
            duration: 2 * 1000
          })
          return Promise.reject(new Error(res.errMsg));
        }
        return res
        
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      //message: error.message,
      message: error.message,
      type: 'error',
      duration: 2 * 1000
    })
    return Promise.reject(error)
  }
)

export default service.request
