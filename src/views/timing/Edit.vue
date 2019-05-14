<template>
  <div class="timing-wrapper">
    <div class="header">
      <div class="return" @click="returnMethod"></div>
      <span>定时设置</span>
      <span class="edit" @click="saveMethod">保存</span>
    </div>
    <div class="timing-form">
      <div class="form-item">
        <span>名称</span>
        <input v-model="timer.name" placeholder="请输入名称" />
      </div>
      <div class="form-item">
        <div class='inline'>
          <span>类型选择</span>
          <yd-radio-group v-model="timer.type">
            <yd-radio v-for='item in timerTypeList' :key='item.value' :val="item.value">{{item.label}}</yd-radio>
          </yd-radio-group>
        </div>
      </div>
      <div v-if='timer.type === 1' class="form-item time border-none inline">
        <p>时间</p>
        <yd-datetime type="time" v-model="afterTime" slot="right"></yd-datetime>
      </div>
    </div>
    <div class="timing-but left">
      <span>开/关</span>
      <div class="but-group">
        <button class="but" :class="{ active : timer.timerType === 1 }" @click="timer.timerType = 1">定时开</button>
        <button class="but" :class="{ active : timer.timerType === 0 }" @click="timer.timerType = 0">定时关</button>
      </div>
    </div>
    <div v-if='timer.type === 2' class='timing-but not-margin inline'>
      <!-- <div class='inline'>
        <span slot="left">开机时间</span>
        <yd-datetime type="time" v-model="timer.startTime" slot="right"></yd-datetime>
      </div>
      <div class='inline'>
        <span slot="left">关机时间</span>
        <yd-datetime type="time" v-model="timer.endTime" slot="right"></yd-datetime>
      </div> -->
      <p>时间</p>
      <yd-datetime type="time" v-model="afterTime" slot="right"></yd-datetime>
    </div>
    <div v-if='timer.type === 2' class="timing-but">
      <span style="float:left">策略</span>
      <div class="but-group flex" style="width: 90%;">
        <button class="but" v-for='item in timeList' :key='item.value' :class="{ active : item.type === true }" @click="item.type = !item.type">{{item.name}}</button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Loading, Toast } from 'vue-ydui/dist/lib.rem/dialog'
import { DateTime } from 'vue-ydui/dist/lib.rem/datetime'
import { Radio, RadioGroup } from 'vue-ydui/dist/lib.rem/radio'
import { CellGroup, CellItem } from 'vue-ydui/dist/lib.rem/cell'
import Vue from 'vue'
import { addTimer, timerDetail } from '../wenkong/api'

Vue.component(Radio.name, Radio)
Vue.component(RadioGroup.name, RadioGroup)
Vue.component(CellGroup.name, CellGroup)
Vue.component(CellItem.name, CellItem)

export default {
  data() {
    return {
      timerId: '', //如果是编辑状态，有值
      afterTime: '',
      wxDeviceId: this.$route.query.wxDeviceId,
      deviceId: this.$route.query.deviceId,
      timer: {
        name: '',
        wxDeviceId: this.$route.query.wxDeviceId,
        timerType: 1,
        type: 1
      },
      timeList: [
        {
          name: '周一',
          type: false,
          value: 2
        },
        {
          name: '周二',
          type: false,
          value: 3
        },
        {
          name: '周三',
          type: false,
          value: 4
        },
        {
          name: '周四',
          type: false,
          value: 5
        },
        {
          name: '周五',
          type: false,
          value: 6
        },
        {
          name: '周六',
          type: false,
          value: 7
        },
        {
          name: '周日',
          type: false,
          value: 1
        }
      ],
      timerTypeList: [
        { value: 1, label: '一次性定时' },
        { value: 2, label: '策略性定时' }
      ]
    }
  },
  methods: {
    getTimerInfo(id) {
      Loading.open('很快加载好了')
      timerDetail(id)
        .then(res => {
          if (res.code === 200) {
            const data = res.data

            this.timer.name = data.name
            this.timer.type = data.type
            this.timeList.forEach(item => {
              if (data.daysOfWeek.indexOf(item.value) !== -1) {
                item.type = true
              }
            })
          }
          Loading.close()
        })
        .catch(error => {
          Loading.close()
        })
    },
    saveMethod() {
      if (this.timer.name === '') {
        this.$toast('请输入定时器名称', 'bottom')
        return false
      }
      // Loading.open('很快加载好了')
      let arr = this.afterTime.split(':')

      if (this.timer.type === 1) {
        // 如果一次性；需要毫秒值
        let time = 0
        if (arr[0] !== '00') {
          // 取时
          time += parseInt(arr[0] * 60 * 60 * 1000)
        }
        if (arr[1] !== '00') {
          time += parseInt(arr[1] * 60 * 1000)
        }
        this.timer.afterTime = time
      } else {
        // 如果策略型，需要时分秒
        this.timer.hour = parseInt(arr[0])
        this.timer.minute = parseInt(arr[1])

        this.timer['daysOfWeek'] = this.timeList
          .filter(item => item.type)
          .map(item => item.value)
      }

      const form = {
        ...this.timer,
        id: this.timerId
      }
      if (this.timerId) {
        // 如果是编辑，加上id
        form['id'] = this.timerId
      }

      addTimer(form)
        .then(res => {
          if (res.code === 200) {
            Loading.close()
            this.$router.push({
              path: '/timinglist',
              query: {
                wxDeviceId: this.wxDeviceId,
                deviceId: this.deviceId
              }
            })
          }
        })
        .catch(error => {
          Loading.close()
        })
    },
    returnMethod() {
      this.$router.back(-1)
    }
  },
  created() {
    const timerId = this.$route.query.id
    if (timerId) {
      this.timerId = timerId
      this.getTimerInfo(timerId, this.wxDeviceId) // 获取定时器详情
    }
  },
  components: {
    'yd-datetime': DateTime
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
  .timing-but {
    margin-top: 5px;
    padding: 15px 0px 15px 10px;
    background: #ffffff;
    font-size: 14px;
    .but-group {
      text-align: right;
      .but {
        padding: 3px 10px;
        border: 1px solid #b3b3b3;
        color: #b3b3b3;
        border-radius: 5px;
        margin-left: 5px;
        margin-bottom: 2px;
        &.active {
          border: 1px solid #20aaf8;
          color: #20aaf8;
        }
      }
    }
  }
  .timing-but.flex {
    display: flex;
  }
  .timing-but.not-margin {
    margin-top: 0;
  }
  .timing-form {
    background: #ffffff;
    padding-left: 5px;
    padding-right: 5px;
    font-size: 14px;
    .form-item {
      padding: 15px 0px 15px 10px;
      border-bottom: 1px solid #d9d9d9;
      &.time {
        padding: 10px 0px 20px 10px;
      }
      &.border-none {
        border: none;
      }
      & input {
        border: none;
        margin-left: 10px;
        color: #b3b3b3;
      }
    }
  }
  .inline {
    display: flex;
    align-items: center;
    > span,
    > p {
      width: 20%;
    }
  }
}
</style>