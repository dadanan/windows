<template>
  <div class="set-wrapper">
    <div class="header">
      <div class="return" @click="returnMethod"></div>
      <span>共享授权</span>
    </div>
    <div class="ewm-content">
      <p>对方扫一扫，可以共享设备</p>
      <div class="ewm" ref="ewm"></div>
      <p class="time">有效期至：{{ time }}</p>
    </div>
    <div class="share-but" @click="shudeDialog = true">分享好友</div>
    <div class="share-shude" v-if="shudeDialog" @click="shudeDialog = false">
      <img src="../../assets/share.png" />
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Loading } from 'vue-ydui/dist/lib.rem/dialog'
import QRCode from 'qrcodejs2'
import { put, get, remove, clear } from 'utils/cache'
import { wxShare } from 'utils/wx'
import Store from '../wenkong/store'
import { token } from '../wenkong/api'

export default {
  data() {
    return {
      value: '',
      time: null,
      shudeDialog: false
    }
  },
  created() {
    Loading.open('很快加载好了')
    setTimeout(() => {
      Loading.close()
    }, 300)
    this.getToken()
  },
  mounted() {
    // this.$nextTick(function() {
    //   if (!get('time')) {
    //     this.getToken()
    //   } else {
    //     this.qrcode()
    //   }
    //   this.time = get('time')
    // })
  },
  methods: {
    returnMethod() {
      this.$router.back(-1)
    },
    getNowFormatDate() {
      var date = new Date()
      var seperator1 = '-'
      var seperator2 = ':'
      // 前十分钟时间
      var minutes = parseInt('10')
      var interTimes = minutes * 60 * 1000
      var interTimes = parseInt(interTimes)
      date = new Date(Date.parse(date) + interTimes)

      var month = date.getMonth() + 1
      var strDate = date.getDate()
      var hour = date.getHours()
      var minutes = date.getMinutes()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      if (hour >= 0 && hour <= 9) {
        hour = '0' + hour
      }
      if (minutes >= 0 && minutes <= 9) {
        minutes = '0' + minutes
      }
      var currentdate =
        date.getFullYear() +
        seperator1 +
        month +
        seperator1 +
        strDate +
        ' ' +
        hour +
        seperator2 +
        minutes
      // + date.getSeconds();
      return currentdate
    },
    getToken() {
      Loading.open('很快加载好了')
      token({
        value: Store.fetch('wxDeviceId')
      })
        .then(res => {
          if (res.code === 200) {
            put('time', this.getNowFormatDate(), 10 * 60)
            put('token', res.data)
            this.time = get('time')
            this.qrcode()
            Loading.close()
          }
        })
        .catch(error => {
          Loading.close()
        })
    },
    qrcode() {
      let code = this.$refs.ewm
      const url = `${this.GLOBAL.shareUrl}?masterOpenId=${Store.fetch(
        'Ticket'
      )}&deviceId=${this.$route.query.deviceId}&token=${get(
        'token'
      )}&customerId=${Store.fetch('customerId')}`
      
      wxShare(
        '我分享了一个设备给你，赶紧看看吧',
        Store.fetch('deviceName'),
        Store.fetch('icon'),
        url
      )

      console.log('分享URL: ', url)
      var qrcode = new QRCode(code, {
        text: url,
        width: 200,
        height: 200,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })
      console.log(qrcode)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/common/scss/variable.scss';
@import 'src/common/scss/mixins.scss';
.set-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  .share-shude {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    & img {
      width: 60%;
      height: auto;
      float: right;
      margin-right: 20px;
      margin-top: 20px;
    }
  }
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
  }
  .share-but {
    margin: 0 auto;
    margin-top: 60px;
    width: 180px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #ffffff;
    background: #20aaf8;
    border-radius: 5px;
  }
  .share-list {
    margin-top: 40px;
    padding-left: 10px;
    padding-right: 10px;
    .box {
      border-bottom: 1px solid #d9d9d9;
      padding: 10px 10px;
      margin-bottom: 10px;
      position: relative;
      overflow: hidden;
      .icon {
        float: left;
        & img {
          width: 50px;
          height: 50px;
          background: #d9d9d9;
          border-radius: 100%;
          vertical-align: middle;
          float: left;
        }
        .txt {
          float: left;
          line-height: 25px;
          margin-left: 10px;
        }
      }
      .delete {
        float: right;
        margin-top: 20px;
      }

      &:last-child {
        border: none;
      }
    }
  }
  .ewm-content {
    width: 70%;
    margin: 0 auto;
    margin-top: 40px;
    background: #ffffff;
    padding-top: 20px;
    padding-bottom: 20px;
    text-align: center;
    .ewm {
      width: 200px;
      height: 200px;
      margin: 0 auto;
      margin-top: 15px;
    }
    .time {
      color: #999999;
      margin-top: 30px;
    }
  }
}
</style>

