<template>
  <div class="set-wrapper">
    <div class="header">
      <div class="return" @click="returnMethod"></div>
      <span>授权管理</span>
    </div>
    <div class="config-wrapper">
      <div class="set-cell">
        <div class="cell-item border-bottom device-group" v-for='group in groupData' :key='group.id'>
          <div class="cell-left">
            <span>{{group.name}}</span>
          </div>
          <div class="right">
            <span>群关</span>
            <yd-switch v-model="group.switch" :callback='openHandler(group)'></yd-switch>
            <span>群开</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Loading } from 'vue-ydui/dist/lib.rem/dialog'
import myUrl from 'common/js/api'
import Vue from 'vue'
import { list, groupSendFunc } from '@/views/wenkong/api'
import { Switch } from 'vue-ydui/dist/lib.rem/switch'

export default {
  data() {
    return {
      inItems: [],
      outItems: [],
      isEdit: false,
      shareList: [],
      switch1: false,
      groupData: {}
    }
  },
  methods: {
    openHandler(group) {
      this.sendGroupFunc(
        group.deviceGroupItemList.map(item => item.deviceId),
        210,
        group.switch ? 1 : 0
      )
    },
    getGroup() {
      list().then(res => {
        res.data.forEach(item => {
          item['switch'] = false
        })
        this.groupData = res.data
      })
    },
    sendGroupFunc(deviceIdList, funcId, value) {
      groupSendFunc({
        deviceIdList,
        funcId,
        value
      }).then(res => {})
    },
    returnMethod() {
      this.$router.back(-1)
    },
    deleteMethod(openid) {
      Loading.open('很快加载好了')
      this.$http
        .get(
          myUrl.clearRelation +
            '?deviceId=' +
            this.$route.query.deviceId +
            '&joinOpenId=' +
            openid
        )
        .then(res => {
          if (res.code === 200) {
            Loading.close()
            this.getShareList()
          }
        })
        .catch(error => {
          Loading.close()
          this.$toast(error.msg, 'bottom')
        })
    },
    getShareList() {
      Loading.open('很快加载好了')
      this.$http
        .get(myUrl.shareList + '?deviceId=' + this.$route.query.deviceId)
        .then(res => {
          if (res.code === 200) {
            Loading.close()
            this.shareList = res.data
          }
        })
        .catch(error => {
          Loading.close()
          this.$toast(error.msg, 'bottom')
        })
    }
  },
  created() {
    Loading.open('很快加载好了')
    setTimeout(() => {
      Loading.close()
    }, 300)
    this.getGroup()
  },
  mounted() {
    this.getShareList()
  },

  components: {
    [Switch.name]: Switch
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/common/scss/variable.scss';
@import 'src/common/scss/mixins.scss';
.set-wrapper {
  .dialog {
    position: fixed;
    z-index: 2000;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    .confirm {
      width: 80%;
      background-color: #ffffff;
      border-radius: 5px;
      font-size: 15px;
      animation: zoom-in 0.15s ease forwards;
      .confim-top {
        padding-top: 20px;
        padding-bottom: 20px;
        background: #2689ee;
        color: #ffffff;
        text-align: center;
        position: relative;
        overflow: hidden;
        .name {
          text-align: left;
          width: 100%;
          padding-left: 15px;
          padding-right: 15px;
          background: none;
          float: left;
          border: none;
          color: #93c4f7;
          font-size: 14px;
          min-height: 50px;
        }
        & p {
          line-height: 24px;
          &:nth-child(1) {
            font-size: 16px;
            margin-bottom: 5px;
          }
        }
        & ul {
          width: 205px;
          margin: 0 auto;
          & li {
            text-align: left;
            & p {
              display: inline-block;
              text-align: left;
              font-size: 14px !important;
              margin-bottom: 0px !important;
            }
          }
        }
      }
      .confim-bottom {
        background: #ffffff;
        padding: 20px 20px;
        position: relative;
        overflow: hidden;
        font-size: 14px;
        .but {
          width: 46%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border: 1px solid #2689ee;
          color: #2689ee;
          border-radius: 5px;
          float: left;
          &:nth-child(2) {
            float: right;
            &.create {
              background: #2689ee;
              color: #ffffff;
            }
          }
        }
      }
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
  .set-cell {
    margin-top: 10px;
    .cell-item {
      position: relative;
      display: flex;
      overflow: hidden;
      margin-bottom: 20px;
      font-size: 14px;
      &.white {
        background: #ffffff;
        padding-top: 15px;
        padding-bottom: 15px;
        margin-bottom: 10px;
        .cell-right {
          &::after {
            top: 16px;
          }
        }
      }
      &.border-bottom {
        padding-bottom: 15px;
        &::after {
          content: '';
          margin-left: 15px;
          position: absolute;
          z-index: 0;
          bottom: 0;
          left: 0;
          width: 100%;
          border-bottom: 1px solid #d9d9d9;
          transform: scaleY(0.5);
          transform-origin: 0 0;
        }
      }
      .cell-left {
        padding-left: 15px;
        display: flex;
        align-items: center;
      }
      .cell-right {
        flex: 1;
        justify-content: flex-end;
        text-align: right;
        padding-right: 40px;
        &::after {
          display: block;
          color: #c9c9c9;
          content: '';
          width: 8px;
          height: 15px;
          background: url('../../assets/arr-right.png') no-repeat center center;
          background-size: 8px 15px;
          position: absolute;
          right: 20px;
          top: 3px;
        }
        & span {
          color: #999999;
        }
      }
    }
  }
  .device-group {
    justify-content: space-between;
    .right {
      margin-right: 20px;
      display: flex;
      align-items: center;
      > span {
        margin: 0 10px;
      }
    }
  }
}
</style>

