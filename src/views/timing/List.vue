<template>
  <div class="timing-wrapper">
    <div class="header">
      <div class="return" @click="returnMethod"></div>
      <span>定时预约</span>
      <span class="edit" @click="save" v-if="isEdit">取消</span>
      <span class="edit" @click="edit" v-else>操作</span>
    </div>
    <div class="timing-list" v-if="timeList.length">
      <div class="list-box" v-for="(item,index) in timeList" :key="index">
        <div class="box-left" :ref="'boxref'+(index)">
          <div class="del" style="float:left" @click="delTimer(item.id)">删除</div>
          <div class="c-text">
            <p v-if="item.remainTime">
              <yd-countdown :callback='finishTime' :time="item.remainTime / 1000" timetype="second"></yd-countdown>
            </p>
            <p v-else>{{ item.hour }}:{{ item.minute}} </p>
            <p>{{ item.name }}</p>
          </div>
        </div>
        <div class="box-right" v-if="!isEdit">
          <div class="switch-box">
            <yd-switch v-model="item.switch" @click.native="switchMethod(item)"></yd-switch>
          </div>
        </div>
        <div class="box-right" v-else>
          <span @click="intoTimeInfo(item.id)">编辑</span>
        </div>
      </div>
    </div>
    <div class="time-none" v-else>暂无数据</div>
    <div class="add-timing" @click="intoTimeDet">添加定时</div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Switch } from 'vue-ydui/dist/lib.rem/switch'
import { CountDown } from 'vue-ydui/dist/lib.rem/countdown'
import { addClass, removeClass } from 'utils/dom'
import { Loading, Toast, Confirm } from 'vue-ydui/dist/lib.rem/dialog'
import { queryTimerList, cancelTimer, deleteTimer } from '../wenkong/api'
import Store from '../wenkong/store'

export default {
  data() {
    return {
      isEdit: false,
      timeList: [],
      value: '',
      wxDeviceId: this.$route.query.wxDeviceId,
      deviceId: this.$route.query.deviceId,
      etInter2:''
    }
  },
  methods: {
    finishTime() {
      Toast({
        mes: `定时已生效`,
        timeout: 1500,
        icon: 'success'
      })
    },
    delTimer(id) {
      Confirm({
        title: '删除组',
        mes: '删除后无法恢复，确认删除？',
        opts: () => {
          deleteTimer(id)
            .then(res => {
              if (res.code === 200) {
                Toast({
                  mes: '删除成功',
                  timeout: 1500,
                  icon: 'success'
                })
                this.timeList = this.timeList.filter(item => item.id !== id)
                this.save()
                Loading.close()
              }
            })
            .catch(error => {
              Loading.close()
            })
        }
      })
    },
    returnMethod() {
      // this.$router.back(-1)
      const formatName = Store.fetch('formatName')
      // console.log(formatName)
      if (formatName === '电子净化器') {
        this.$router.push({
          path: '/air-purifier',
          query: {
            wxDeviceId: this.wxDeviceId,
            deviceId: this.deviceId
          }
        })
      } else if (formatName === '温控器') {
        this.$router.push({
          path: '/wenkongindex',
          query: {
            wxDeviceId: this.wxDeviceId,
            deviceId: this.deviceId
          }
        })
      } else if(formatName === '智慧新风-单风机') {
        // 智慧新风
        this.$router.push({
          path: '/indexsingle',
          query: {
            wxDeviceId: this.wxDeviceId,
            deviceId: this.deviceId
          }
        })
      }else{
        this.$router.push({
          path: '/index',
          query: {
            wxDeviceId: this.wxDeviceId,
            deviceId: this.deviceId
          }
        })
      }
    },
    edit() {
      this.isEdit = !this.isEdit
      this.value = 'active'
      $('.box-left').addClass('active')
      // addClass(this.$refs.boxref1,'active');
    },
    save() {
      this.isEdit = !this.isEdit
      this.value = ''
      $('.box-left').removeClass('active')
    },
    getTimeList() {
      Loading.open('很快加载好了')
      queryTimerList({
        deviceId: this.deviceId
      })
        .then(res => {
          if (res.code === 200) {
            Loading.close()
            this.timeList = res.data
            this.timeList.forEach(v => {
              if (v.status === 1) {
                this.$set(v, 'switch', true)
              } else {
                this.$set(v, 'switch', false)
              }

              if (v.minute == 0) {
                v.minute = '00'
              } else if (v.minute < 10) {
                v.minute = '0' + v.minute
              }
            })
          }
        })
        .catch(error => {
          Loading.close()
        })
    },
    MillisecondToDate(msd) {
      var time = parseFloat(msd) / 1000
      if (time != null && time != '') {
        if (time > 60 && time < 60 * 60) {
          time = parseInt(time / 60.0) + '分钟'
        } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
          time =
            parseInt(time / 3600.0) +
            '小时' +
            parseInt(
              (parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60
            ) +
            '分钟'
        } else {
          time = parseInt(time) + '秒'
        }
      } else {
        time = '0 时 0 分0 秒'
      }
      return time
    },
    switchMethod(item) {
      if (item.status === 1) {
        // 取消定时
        item.status = 2
      } else {
        // 重启定时
        item.status = 1
      }
      Loading.open('很快加载好了')
      cancelTimer({
        timerId: item.id,
        status: item.status
      })
        .then(res => {
          Loading.close()
        })
        .catch(() => {
          Loading.close()
        })
    },
    intoTimeInfo(id) {
      this.$router.push({
        path: '/timingedet',
        query: {
          id: id,
          wxDeviceId: this.wxDeviceId,
          deviceId: this.deviceId
        }
      })
    },
    intoTimeDet() {
      this.$router.push({
        path: '/timingedet',
        query: {
          wxDeviceId: this.wxDeviceId,
          deviceId: this.deviceId
        }
      })
    }
  },
  components: {
    'yd-switch': Switch,
    'yd-countdown': CountDown
  },
  watch: {
    timeList: {
      handler: function(val) {
        
      },
      deep: true
    }
  },
  mounted() {
    this.getTimeList()

  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/common/scss/variable.scss';
@import 'src/common/scss/mixins.scss';
.timing-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  .header {
    height: 40px;
    font-size: 16px;
    line-height: 40px;
    text-align: center;
    position: relative;
    .return {
      position: absolute;
      left: 0px;
      background: url('../../assets/arr-left.png') no-repeat center center;
      background-size: 8px 16px;
      width: 40px;
      height: 40px;
      display: block;
      top: 0px;
    }
    .edit {
      position: absolute;
      right: 15px;
    }
  }
  .time-none {
    position: fixed;
    width: 100%;
    text-align: center;
    bottom: 100px;
  }
  .add-timing {
    position: fixed;
    bottom: 15px;
    width: 80%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #ffffff;
    background: #20aaf8;
    left: 50%;
    margin-left: -40%;
    border-radius: 5px;
    font-size: 16px;
  }
  .timing-list {
    .list-box {
      height: 50px;
      background: #ffffff;
      padding-right: 15px;
      display: flex;
      font-size: 14px;
      position: relative;
      margin-bottom: 10px;
      .c-text {
        position: absolute;
        width: 200px;
        left: 80px;
        top: 50%;
        transform: translateY(-50%);
      }
      & div {
        flex: 1;
      }
      .box-left {
        position: relative;
        line-height: 18px;
        left: -65px;
        transition-duration: 0.3s;
        transition-timing-function: ease;
        &.active {
          left: 0px;
          & .c-text {
            left: 65px;
          }
        }
        .del {
          width: 50px;
          height: 50px;
          background: #20aaf8;
          color: #ffffff;
          text-align: center;
          line-height: 50px;
          position: relative;
          display: block;
        }
        & p:nth-child(2) {
          font-size: 12px;
          color: #b3b3b3;
        }
      }
      .box-right {
        text-align: right;
        line-height: 50px;
        position: relative;
        .switch-box {
          float: right;
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          & span {
            position: absolute;
            left: -50px;
            color: #b3b3b3;
            top: -10px;
          }
        }
      }
    }
  }
}
</style>

