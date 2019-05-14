/**
 * 微信公用方法
 * author by kairry 2017年12月29日
 */

import wx from 'weixin-js-sdk'
import baseUrl from 'config/env'
import { returnUrl } from 'utils'
import Toast from 'base/toast'
import md5 from 'js-md5'
import Vue from 'vue'
import global_ from 'common/js/global'
import { getSign } from '@/views/wenkong/api'

Vue.use(Toast)

/**
 * 微信支付
 * @param {*} obj
 */
export function wechatPay(obj) {
  WeixinJSBridge.invoke(
    'getBrandWCPayRequest',
    {
      appId: obj.appId,
      timeStamp: obj.timeStamp,
      // "status":"0",
      signType: obj.signType,
      package: obj.package,
      // "callback_url":null,
      nonceStr: obj.nonceStr,
      paySign: obj.paySign
    },
    function(res) {
      if (res.err_msg == 'get_brand_wcpay_request:ok') {
        // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
        WeixinJSBridge.call('closeWindow') // 关闭窗口
      } else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
        alert('支付取消')
      } else {
        alert('支付失败')
      }
    }
  )
}
// alert(Vue.prototype.GLOBAL.appId)

/**
 * 微信签名公用方法
 */
export function sign() {
  let targetUrl = encodeURIComponent(location.href.split('#')[0])

  getSign(targetUrl)
    .then(res => {
      if (res.code === 200) {
        const data = res.data
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          // appId: 'wx4dfbe03e963f3d1f',   // 必填，公众号的唯一标识 wx292d0902bf9841d6
          appId: data.appId,
          timestamp: data.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.nonceStr, // 必填，生成签名的随机串
          signature: data.signature, // 必填，签名，见附录1
          jsApiList: [
            'onMenuShareAppMessage',
            'onMenuShareTimeline',
            'hideMenuItems',
            'openLocation',
            'getLocation',
            'showMenuItems',
            'scanQRCode',
            'chooseWXPay'
          ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        })
      }
    })
    .catch(error => {
      Vue.prototype.$toast(error.message, 'bottom')
    })
}

/**
 * 屏蔽微信菜单
 */
export function hideMenu() {
  sign() // 先进行签名
  wx.ready(() => {
    wx.hideMenuItems({
      menuList: [
        'menuItem:share:appMessage',
        'menuItem:share:timeline',
        'menuItem:share:qq',
        'menuItem:share:weiboApp',
        'menuItem:favorite',
        'menuItem:share:facebook',
        'menuItem:share:QZone'
      ]
    })
  })
}

export function scanQRCode() {
  sign() // 先进行签名
  wx.ready(function() {
    wx.scanQRCode({
      // 扫一扫
      needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ['qrCode'], // 可以指定扫二维码还是一维码，默认二者都有
      success: function(res) {
        var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
        // 扫描成功重定向
        // window.location.href = result;//因为我这边是扫描后有个链接，然后跳转到该页面
      }
    })
  })
}

/**
 * 微信分享
 * @param {* 标题} title
 * @param {* 描述} desc
 * @param {* 图片} logo
 * @param {* 链接} link
 */
export function wxShare(title, desc, logo, link) {
  sign() // 先进行签名
  wx.ready(() => {
    // 所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，
    // 则可以直接调用，不需要放在ready函数中。
    wx.onMenuShareAppMessage({
      // 分享给朋友
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接 默认以当前链接
      imgUrl: '' + logo + '', // 分享图标
      success: function() {
        console.log('分享成功')
      },
      // 用户取消分享后执行的回调函数
      cancel: function() {
        console.log('分享到朋友取消')
      }
    })
    // 分享到朋友圈
    wx.showMenuItems({
      menuList: [
        'menuItem:share:appMessage',
        'menuItem:share:timeline',
        'menuItem:share:qq',
        'menuItem:share:weiboApp',
        'menuItem:favorite',
        'menuItem:share:facebook',
        'menuItem:share:QZone'
      ]
    })
    wx.onMenuShareTimeline({
      title: title, // 分享标题
      desc: desc,
      link: link,
      imgUrl: '' + logo + '', // 分享图标
      // 用户确认分享后执行的回调函数
      success: function() {
        console.log('分享成功')
      },
      // 用户取消分享后执行的回调函数
      cancel: function() {
        console.log('分享到朋友圈取消')
      }
    })
  })
}

/**
 * 微信打开地图
 * @param {*} city
 * @param {*} address
 * @param {*} lat
 * @param {*} lng
 */
export function openMap(city, address, lat, lng) {
  sign()
  wx.ready(() => {
    wx.openLocation({
      latitude: lat, // 纬度，浮点数，范围为90 ~ -90
      longitude: lng, // 经度，浮点数，范围为180 ~ -180。
      name: city, // 位置名
      address: address, // 地址详情说明
      scale: 28, // 地图缩放级别,整形值,范围从1~28。默认为最大
      infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
    })
  })
}

/**
 * 唤起微信支付
 * @param appId  公众号名称
 * @param timeStamp 时间戳
 * @param nonceStr 随机串
 * @param packageArg 订单详情扩展字符串
 * @param signType 微信签名方式
 * @param paySign 微信签名
 * @param signature
 * @author shuiRong
 */
export function wxPay(
  appId,
  timestamp,
  nonceStr,
  packageArg,
  signType,
  paySign,
  signature
) {
  wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    // appId: 'wx4dfbe03e963f3d1f',   // 必填，公众号的唯一标识 wx292d0902bf9841d6
    appId: appId,
    timestamp: timestamp, // 必填，生成签名的时间戳
    nonceStr: nonceStr, // 必填，生成签名的随机串
    signature: signature, // 必填，签名，见附录1
    jsApiList: ['chooseWXPay']
  })

  wx.ready(() => {
    wx.chooseWXPay({
      appId: appId,
      timestamp: timestamp,
      nonceStr: nonceStr,
      package: packageArg,
      signType: signType,
      paySign: paySign,
      success: function(res) {
        console.log('success:', res)
      }
    })
  })
}
