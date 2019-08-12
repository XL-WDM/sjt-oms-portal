import axios from 'axios'
// import qs from 'qs'
import iView from 'iview'
import router from '@/router'

console.log(process.env.VUE_APP_URL)

const service = axios.create({
  baseURL: process.env.VUE_APP_URL,
  withCredentials: true,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

/**
 * 添加请求拦截器
 */
service.interceptors.request.use(request => {
  iView.LoadingBar.start()
  return request
})

/**
 * 添加响应拦截器
 */
service.interceptors.response.use(response => {
  const data = response.data
  const res = resultHandler(data)
  res.success(() => {
    iView.LoadingBar.finish()
  })
  res.error(() => {
    iView.LoadingBar.error()
  })
  return res
}, error => {
  iView.LoadingBar.error()
  if (error && error.toString().indexOf('404') >= 0) {
    iView.Message.error('api not found')
    return Promise.reject(error)
  }
  iView.Message.error('系统故障，请稍后再试。')
  return Promise.reject(error)
})

// get请求(查询)
export function get (path, data) {
  return service.get(path, {
    params: data
  })
}

// post请求(创建)
export function post (path, params) {
  return service.post(path, params)
}

function resultHandler (result) {
  const res = {
    success: () => res,
    error: () => res
  }
  if (result.code === 401) { // 签名失效
    iView.Message.error(result.message)
    router.push({ path: '/sign', query: { to: router.currentRoute.path } })
    return res
  } else if (parseInt(result.code / 200) !== 1) { // 失败
    iView.Message.error(result.message)
    res.error = method => {
      method(result)
      return res
    }
    return res
  }
  // 成功
  res.success = method => {
    method(result)
    return res
  }
  return res
}
