/**
 * api接口地址
 */

import global_ from 'common/js/global'

const baseUrl = global_.url

const config = {
  auth: baseUrl + '/h5/api/user/auth', // 微信授权
  obtainMyDevice: baseUrl + '/h5/api/obtainMyDevice', // 设备组列表
  createGroup: baseUrl + '/h5/api/createGroup', // 创建设备组
  deleteDevice: baseUrl + '/h5/api/deleteDevice', // 删除设备
  editDevice: baseUrl + '/h5/api/editDevice', // 编辑设备名称
  updateDeviceGroup: baseUrl + '/h5/api/updateDeviceGroup', // 更改设备组
  deleteGroup: baseUrl + '/h5/api/deleteGroup', // 删除设备组
  updateGroupName: baseUrl + '/h5/api/updateGroupName', // 编辑组名称
  queryDetailByDeviceId: baseUrl + '/h5/api/queryDetailByDeviceId', // 获取设备详情
  sendFunc: baseUrl + '/h5/api/sendFunc', // 发送指令
  token: baseUrl + '/h5/api/token', // 获取token
  getSign: baseUrl + '/h5/api/getSign', // 签名
  share: baseUrl + '/h5/api/share', // 分享
  clearRelation: baseUrl + '/h5/api/clearRelation', // 清除
  shareList: baseUrl + '/h5/api/shareList', // 获取joinOpenid
  getHistoryData: baseUrl + '/h5/api/getHistoryData', // 获取历史数据
  queryTimerList: baseUrl + '/h5/api/queryTimerList', // 获取定时器列表
  addTimer: baseUrl + '/h5/api/addTimer', // 添加定时器
  cancelTimer: baseUrl + '/h5/api/cancelTimer', // 取消定时器
  deleteTimer: baseUrl + '/h5/api/deleteTimer', // 删除定时器
  getSpeedConfig: baseUrl + '/h5/api/getSpeedConfig', // 获取设备配置信息
  setSpeedConfig: baseUrl + '/h5/api/setSpeedConfig', // 设置配置信息
  timerDetail: baseUrl + '/h5/api/timerDetail', // 定时器详情
  editTimer: baseUrl + '/h5/api/editTimer', // 编辑定时器
  updateDeviceLocation: baseUrl + '/h5/api/updateDeviceLocation'// 设置位置

}

export default config
