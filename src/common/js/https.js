/**
 * axios基础封装类
 * author by kairry 2017年11月20日
 */

import axios from 'axios'
import Vue from 'vue'
import Toast from 'base/toast'
Vue.use(Toast)

const Axios = axios.create({
  timeout: 50000, // 请求超时时间
  responseType: 'json',
  headers: {
    // "Content-Type": "application/x-www-form-urlencoded"
  }
})

/**
 * POST传参序列化(添加请求拦截器)
 */
Axios.interceptors.request.use(
  config => {
    // 在发送请求之前做某件事
    if (
      config.method === 'post' ||
      config.method === 'put' ||
      config.method === 'delete'
    ) {
      // 序列化
      if (!config.data) {
        // config.data = Qs.stringify(config.data);
      }
    }
    // config.headers.common['lz-system'] = 'client' //设置header信息
    if (sessionStorage.getItem('Ticket')) {
      config.headers.common['Ticket'] = sessionStorage.getItem('Ticket') // 设置header信息
    }
    // config.headers.common['Ticket'] = 'oEBIM1KxWK7qcyc3ukxIZNJobh1c'//设置header信息 测试 o-_q705K4HhB0jYVsyZjC9hSL-zc
    // config.headers.common['Ticket'] = 'o-_q70xWPVYPUdg7OJcOtysNy3ok' //线上  o-_q70zK12d3QeOgiyhQt9-lavCM
    // config.headers.common['Ticket'] = 'o-_q70zK12d3QeOgiyhQt9-lavCM' //双风机
    config.headers.common['Ticket'] = 'oEBIM1ACyf9fncvGisukou3QApUY' // 双风机
    // config.headers.common['Ticket'] = 'o-_q706TXieUDdivBdqYpgSsBAOQ' // 电子净化
    return config
  },
  error => {
    return Promise.reject(error.data.message)
  }
)

/**
 * 返回状态判断(添加响应拦截器)
 */
Axios.interceptors.response.use(
  res => {
    if (res.data && res.data.code != 200) {
      Vue.prototype.$toast(`连接错误:${res.data.msg}`, 'bottom')
      return Promise.reject(res.data)
    }
    return res.data
  },
  error => {
    // 服务器异常提示
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '错误请求'
          break
        case 404:
          error.message = '请求错误,未找到该资源'
          break
        case 408:
          error.message = '请求超时'
          break
        case 500:
          error.message = '服务器端异常'
          break
        default:
          error.message = `连接错误:${error.response.status}`
      }
    } else {
      error.message = '连接到服务器失败'
    }
    Vue.prototype.$toast(error.message, 'bottom')
    return Promise.reject(error) // 返回response的错误信息
  }
)

Vue.prototype.$http = Axios

export const http = Axios
