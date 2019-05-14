const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://pro.hcocloud.com'
    : window.location.origin
import { http } from '@/common/js/https'
import Store from './store'

export function newQueryDetailByDeviceId(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/newQueryDetailByDeviceId`,
    method: 'post',
    data,
    headers: {
      Ticket: Store.fetch('Ticket')
    }
  })
}

export function getModelVo(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/format/getModelVo`,
    method: 'post',
    data,
    headers: {
      Ticket: Store.fetch('Ticket')
    }
  })
}
// 滤网时间
export function getStrainerData(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/getStrainerData`,
    method: 'post',
    data,
    headers: {
      Ticket: Store.fetch('Ticket'),
      Authorization: Store.fetch('Token')
    }
  })
}

export function editDevice(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/editDevice`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function token(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/token`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function getToken(data) {
  return http({
    url: `${BASE_URL}/api/h5/high/getToken`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function delToken(id) {
  return http({
    url: `${BASE_URL}/api/h5/high/delToken/${id}`,
    method: 'get',
    headers: {
      Ticket: Store.fetch('Ticket'),
      Authorization: Store.fetch('Token')
    }
  })
}

export function addChildDevice(data) {
  return http({
    url: `${BASE_URL}/api/h5/high/addChildDevice`,
    method: 'post',
    data,
    headers: {
      Ticket: Store.fetch('Ticket'),
      Authorization: Store.fetch('Token')
    }
  })
}

export function childDeviceList(deviceId) {
  return http({
    url: `${BASE_URL}/api/h5/high/childDeviceList/${deviceId}`,
    method: 'get',
    headers: {
      Ticket: Store.fetch('Ticket'),
      Authorization: Store.fetch('Token')
    }
  })
}

export function delChildDevice(id) {
  return http({
    url: `${BASE_URL}/api/h5/high/delChildDevice/${id}`,
    method: 'get',
    headers: {
      Ticket: Store.fetch('Ticket'),
      Authorization: Store.fetch('Token')
    }
  })
}

export function getLocation(deviceId) {
  return http({
    url: `${BASE_URL}/api/h5/api/getLocation/${deviceId}`,
    method: 'get',
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function getWeather(deviceId) {
  return http({
    url: `${BASE_URL}/api/h5/api/getWeather/${deviceId}`,
    method: 'get',
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function modelList(id) {
  return http({
    url: `${BASE_URL}/api/h5/high/modelList/${id}`,
    method: 'get',
    headers: {
      Ticket: Store.fetch('Ticket'),
      Authorization: Store.fetch('Token')
    }
  })
}

export function obtainMyDevice() {
  return http({
    url: `${BASE_URL}/api/h5/api/obtainMyDevice`,
    method: 'post',
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function sendFunc(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/sendFunc`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function updateTeamName(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/team/updateTeamName`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function updateDeviceTeam(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/team/updateDeviceTeam`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function deleteTeam(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/team/deleteTeam`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function createTeam(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/team/createTeam`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function addTimer(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/addTimer`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function editTimer(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/editTimer`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function queryTimerList(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/queryTimerList`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function cancelTimer(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/cancelTimer`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function timerDetail(timerId) {
  return http({
    url: `${BASE_URL}/api/h5/api/timerDetail/${timerId}`,
    method: 'get',
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function timerType() {
  return http({
    url: `${BASE_URL}/api/h5/api/timerType`,
    method: 'get',
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function deleteTimer(timerId) {
  return http({
    url: `${BASE_URL}/api/h5/api/deleteTimer/${timerId}`,
    method: 'get',
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function appid(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/user/appid`,
    method: 'post',
    data
  })
}

export function auth(customerId, code) {
  return http({
    url: `${BASE_URL}/api/h5/api/user/auth?customerId=${customerId}&code=${code}`,
    method: 'get'
  })
}

export function share(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/share`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function shareList(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/shareList`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}
// 修改人的权限
export function updateRelation(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/updateRelation`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}
// 修改所有人的权限
export function updateAllRelation(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/updateAllRelation`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}
// 获取历史数据
export function getHistoryData(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/getHistoryData`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

// 删除某人权限
export function clearRelation(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/clearRelation`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

// 接触设备绑定？
export function deleteDevice(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/deleteDevice`,
    method: 'post',
    data,
    headers: {
      Ticket: Store.fetch('Ticket'),
      Authorization: Store.fetch('Token')
    }
  })
}

export function getSign(url) {
  return http({
    url: `${BASE_URL}/api/h5/api/getSign?url=${url}`,
    method: 'get',
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function list() {
  return http({
    url: `${BASE_URL}/api/h5/api/group/list`,
    method: 'get',
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function groupSendFunc(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/group/groupSendFunc`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function updateDeviceLocation(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/updateDeviceLocation`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}
// 客服
export function getServerUser() {
  return http({
    url: `${BASE_URL}/api/h5/api/getServerUser`,
    method: 'get',
    headers: { Ticket: Store.fetch('Ticket') }
  })
}
// 设备参数修改
export function sendParamFunc(data) {
  return http({
    url: `${BASE_URL}/api/h5/params/sendParamFunc`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}
// 获取转数值
export function paramList(data) {
  return http({
    url: `${BASE_URL}/api/h5/params/paramList`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}
// 判断传参给设备是否成功
export function queryDeviceBack(data) {
  return http({
    url: `${BASE_URL}/api/h5/params/queryDeviceBack`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}
// 设备名称修改
export function editManageName(data) {
  return http({
    url: `${BASE_URL}/api/h5/high/editManageName`,
    method: 'post',
    data,
    headers: {
      Ticket: Store.fetch('Ticket'),
      Authorization: Store.fetch('Token')
    }
  })
}
// 客户反馈
export function customMessage(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/userFeedback/customMessage`,
    method: 'post',
    data,
    headers: {
      Ticket: Store.fetch('Ticket'),
      Authorization: Store.fetch('Token')
    }
  })
}

// 获取客户的背景图册
export function getBgImgs() {
  return http({
    url: `${BASE_URL}/api/h5/api/getBgImgs`,
    method: 'get',
    headers: { Ticket: Store.fetch('Ticket') }
  })
}
// 保修类型查询
export function getRuleInfo() {
  return http({
    url: `${BASE_URL}/api/h5/api/userFeedback/getRuleInfo`,
    method: 'get',
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

// 保修类型查询
export function repairInfo(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/userFeedback/repairInfo`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

// 客户反馈记录
export function getRepairInfoLog(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/userFeedback/getRepairInfoLog`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

// 设备组的开和关
export function teamControl(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/team/occ`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

// 设备组的开和关
export function trusteeTeam(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/team/trusteeTeam`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

// 微信支付获取支付参数
export function getPayParams(data) {
  return http({
    url: `${BASE_URL}/api/h5/pay/pay`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

// 个性设置
export function queryDeviceIconList(data) {
  return http({
    url: `${BASE_URL}/api/h5/high/queryDeviceIconList/${data}`,
    method: 'get',
    headers: { Ticket: Store.fetch('Ticket'),
    Authorization: Store.fetch('Token')
  }
  })
}

// 个性设置传参
export function setDeviceIcon(data) {
  return http({
    url: `${BASE_URL}/api/h5/high/setDeviceIcon`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket'),
    Authorization: Store.fetch('Token') }
  })
}
// 设置设备关联状态
export function setLinkStatus(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/team/setLinkStatus`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}


//查询指定页面匹配的数据点数据
export function getPageDatas(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/energy/getPageDatas/${data}`,
    method: 'post',
    headers: { Ticket: Store.fetch('Ticket') }
  })
}
