<template>
  <div class="set-wrapper">
    <div class="header">
      <div class="return" @click="returnMethod"></div>
      <span>授权管理</span>
    </div>
    <div class="config-wrapper">
      <p class="title">管理好友对设备的控制权限</p>
      <ul v-if="shareList.length">
        <li v-for="(item,index) in shareList" :key="index">
          <a class="img">
            <img :src="item.headImg" />
            <span>{{ item.nickname }}</span>
          </a>
          <span class="delete" @click="clearRelation(item.openId)">删除</span>
          <span class="span_left">
            <!-- <label>{{item.status === true ? '启用' : '禁用'}}</label> -->
            <el-switch v-model="item.status" active-text="启用" inactive-text="禁用" @change="switchplay(item.status,item.openId)"></el-switch>
          </span>
        </li>
      </ul>
      <div v-else style="text-align:center;width:100%">非主绑定人,无此权限</div>
    </div>
    <div class="set-bottom">
      <button class="but" @click="permits">全部许可</button>
      <button class="but" @click="allDelete">全部禁用</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Loading } from 'vue-ydui/dist/lib.rem/dialog'
import myUrl from 'common/js/api'
import {
  shareList,
  clearRelation,
  updateRelation,
  updateAllRelation
} from '../wenkong/api'

export default {
  data() {
    return {
      inItems: [],
      outItems: [],
      isEdit: false,
      shareList: [],
      deviceId: this.$route.query.deviceId,
      status: 1
    }
  },
  methods: {
    returnMethod() {
      this.$router.back(-1)
    },
    // 全部许可
    permits() {
      this.status = 1
      this.updateAllRelation()
    },
    // 全部禁止
    allDelete() {
      this.status = 2
      this.updateAllRelation()
    },
    // 判断点击开启/关闭
    switchplay(val, id) {
      this.updateRelation(val, id)
    },
    //全部操作设备
    updateAllRelation() {
      Loading.open('很快加载好了')
      updateAllRelation({
        deviceId: this.deviceId,
        status: this.status
      })
        .then(res => {
          Loading.close()
          this.getShareList()
        })
        .catch(error => {
          Loading.close()
        })
    },
    updateRelation(id, val) {
      Loading.open('很快加载好了')
      if (id == true) {
        id = 1
      } else {
        id = 2
      }
      updateRelation({
        deviceId: this.deviceId,
        openId: val,
        status: id
      })
        .then(res => {
          Loading.close()
        })
        .catch(error => {
          Loading.close()
        })
    },
    // 删除
    clearRelation(openId) {
      Loading.open('很快加载好了')
      clearRelation({
        openId,
        deviceId: this.deviceId
      })
        .then(res => {
          Loading.close()
          this.getShareList()
        })
        .catch(error => {
          Loading.close()
          this.$toast(error.msg, 'bottom')
        })
    },
    getShareList() {
      Loading.open('很快加载好了')
      shareList({
        value: this.deviceId
      })
        .then(res => {
          this.shareList = res.data
          // console.log(this.shareList)
          Loading.close()
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
    this.getShareList()
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
  .config-wrapper {
    position: absolute;
    top: 40px;
    bottom: 0px;
    height: auto;
    //background: #ffffff;
    left: 0;
    width: 100%;
    .title {
      padding: 15px;
    }
    .span_left {
      float: right;
      margin-right: 20px;
    }
    & ul li {
      width: 100%;
      height: 40px;
      line-height: 40px;
      background: #ffffff;
      padding-left: 15px;
      padding-right: 15px;
      margin-bottom: 10px;
      font-size: 14px;
      & a {
        float: left;
        & img {
          width: 20px;
          height: 20px;
          margin-top: 5px;
          vertical-align: top;
        }
        & span {
          margin-left: 10px;
        }
      }
      & .delete {
        float: right;
        font-size: 16px;
        color: #999999;
      }
    }
  }
  .set-bottom {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    & .but {
      width: 50% !important;
      float: left;
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      background: #428ae7;
      color: #fff;
      border: 1px solid #428ae7;
      &:nth-child(2) {
        margin-left: 0px;
        float: right;
        background: none;
        background: #e57470;
        border: 1px solid #e57470;
      }
    }
  }
}
</style>

