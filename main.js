
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
// 按需导入 $http 对象
import { $http } from '@escook/request-miniprogram'
import store from "@/store/store.js"

Vue.config.productionTip = false
// 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http
App.mpType = 'app'

// 请求开始之前做一些事情
$http.beforeRequest = function (options) {
  uni.showLoading({
    title:"数据加载中..."
  })
   // 判断请求的是否为有权限的 API 接口
    if (options.url.indexOf('/my/') !== -1) {
      // 为请求头添加身份认证字段
      options.header = {
        // 字段的值可以直接从 vuex 中进行获取
        Authorization: store.state.m_address.token,
      }
    }
}
// 请求完成之后做一些事情
$http.afterRequest = function () {
  uni.hideLoading()
}
// 请求失败的方法
uni.$showMsg = function(title = "数据加载失败!",duration = 1500){
  uni.showToast({
    title,
    duration,
    icon:'none'
  })
}

const app = new Vue({
    ...App,
    store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif