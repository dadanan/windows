<template>
  <div class="set-wrapper">
    <div class="header">
      <div class="return" @click="returnMethod"></div>
      <span>设备设置</span>
    </div>
    <div class="set-cell">
      <div class="cell-item border-bottom" @click="editDevFlag = true">
        <div class="cell-left">
          <span>设备名称</span>
        </div>
        <div class="cell-right">
          <span>{{ deviceName }}</span>
        </div>
      </div>
      <div class="cell-item border-bottom" @click="intoInfo">
        <div class="cell-left">
          <span>设备信息</span>
        </div>
        <div class="cell-right">
        </div>
      </div>
      <div v-if='showMasterInfo' class="cell-item border-bottom" @click="intoMasterInfo">
        <div class="cell-left">
          <span>主机信息</span>
        </div>
        <div class="cell-right">
        </div>
      </div>

      <div class="cell-item border-bottom" @click="intoShare">
        <div class="cell-left">
          <span>共享授权</span>
        </div>
      </div>

      <div class="cell-item" @click="intoPermissions">
        <div class="cell-left">
          <span>授权管理</span>
        </div>
      </div>

      <div class="cell-item white" @click="intoData">
        <div class="cell-left">
          <span>数据曲线图</span>
        </div>
        <div class="cell-right"></div>
      </div>
      <div class="cell-item white" @click="intoMap">
        <div class="cell-left">
          <span>手动设置位置</span>
        </div>
        <div class="cell-right">
        </div>
      </div>
      <div class="cell-item white" @click="intoBattery" v-if="screen">
        <div class="cell-left">
          <span>滤芯寿命</span>
        </div>
        <div class="cell-right">
          <span></span>
        </div>
      </div>
      <div class="cell-item white" v-else>
        <div class="cell-left">
          <span>该设备没有滤网</span>
        </div>
        <!-- <div class="cell-right">
          <span></span>
        </div> -->
      </div>
      <div class="cell-item white" v-if="1===2">
        <div class="cell-left">
          <span>固件升级</span>
        </div>
        <div class="cell-right"></div>
      </div>
      <div class="cell-item white" @click="intoConfig">
        <div class="cell-left">
          <span>设备配置</span>
        </div>
        <div class="cell-right"></div>
      </div>
      <div class="cell-item white" @click="customer = true">
        <a>
          <div class="cell-left">
            <span>客服电话</span>
          </div>
          <div class="cell-right"></div>
        </a>
      </div>
      <div class="cell-item white" @click="UserFeedBack = true">
        <a>
          <div class="cell-left">
            <span>用户建议</span>
          </div>
          <div class="cell-right"></div>
        </a>
      </div>
      <div class="cell-item white" @click="warranty = true">
        <a>
          <div class="cell-left">
            <span>保修反馈</span>
          </div>
          <div class="cell-right"></div>
        </a>
      </div>
      <div class="cell-item white" @click="record">
        <a>
          <div class="cell-left">
            <span>反馈记录</span>
          </div>
          <div class="cell-right"></div>
        </a>
      </div>
    </div>
    <!-- 保修反馈 -->
    <div class="create-dialog dialog" v-if="warranty">
      <div class="confirm">
        <div class="confim-top">
          <p>保修反馈</p>
        </div>
        <div class="confim-content">
          <!-- <template>
            <el-select v-model="value" placeholder="请选择" style="width:125px" @change="changes">
              <el-option v-for="item in options" :key="item.id" :label="item.value" :value="item.id">
              </el-option>
            </el-select>
          </template>
          <template>
            <el-select v-model="value1" placeholder="请选择" style="width:125px">
              <el-option v-for="item in options1" :key="item.value" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </template> -->
          <textarea v-model="feedBacks" placeholder="请输入您的保修信息..." style="margin-top:20px"></textarea>
        </div>
        <div class="confim-bottom">
          <div class="but1" @click="sub">确定</div>
          <div class="but1" @click="warranty = false" style="margin-top:10px">取消</div>
        </div>
      </div>
    </div>
    <!-- 客户反馈 -->
    <div class="create-dialog dialog" v-if="UserFeedBack">
      <div class="confirm">
        <div class="confim-top">
          <p>用户建议</p>
        </div>
        <div class="confim-content">
          <textarea v-model="feedBack" placeholder="请输入您的宝贵意见..."></textarea>
        </div>
        <div class="confim-bottom">
          <div class="but1" @click="customMessage">确定</div>
          <div class="but1" @click="UserFeedBack = false" style="margin-top:10px">取消</div>
        </div>
      </div>
    </div>
    <!-- 联系客服 -->
    <div class="create-dialog dialog" v-if="customer">
      <div class="confirm">
        <div class="confim-top">
          <p>客服电话</p>
        </div>
        <div class="confim-content">
          
          <a href="tel:4001181789#mp.weixin.qq.com">{{ customer1 }}</a>
        </div>
        <div class="confim-bottom">
          <div class="but1" @click="customer = false">确定</div>
        </div>
      </div>
    </div>
    <div class="create-dialog dialog" v-if="editDevFlag">
      <div class="confirm">
        <div class="confim-top">
          <textarea class="name" v-model="setDeviceName" v-text="deviceName"></textarea>
        </div>
        <div class="confim-bottom">
          <div class="but" @click="editDevFlag = false">取消</div>
          <div class="but create" @click="editDev">确定</div>
        </div>
      </div>
    </div>

    <div class="create-dialog dialog" v-if="setPwdFlag">
      <div class="confirm">
        <div class="confim-top">
          <p>请输入设备密码</p>
          <!-- <p style="margin-bottom:10px;">调试人员专用</p> -->
          <input type="number" name="" id="" value="" v-model="pwd" style="position: absolute; top:50px; left: 20px; right: 0; height: 40px; opacity: 0;" />
          <div class="flex flex-pack-justify" style="margin: 0 20px;">
            <span class="box">{{pwdList[0]}}</span>
            <span class="box">{{pwdList[1]}}</span>
            <span class="box">{{pwdList[2]}}</span>
            <span class="box">{{pwdList[3]}}</span>
          </div>
        </div>
        <div class="confim-bottom">
          <div class="but" @click="setPwdFlag = false">取消</div>
          <div class="but create" @click="getToken">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Loading, Toast } from "vue-ydui/dist/lib.rem/dialog";
import myUrl from "common/js/api";
import { editDevice, getModelVo } from "../wenkong/api";
import Store from "../wenkong/store";
import {
  getToken,
  getServerUser,
  customMessage,
  getRuleInfo,
  repairInfo
} from "../wenkong/api";

export default {
  data() {
    return {
      switch1: false,
      switch2: false,
      editDevFlag: false,
      customer: false,
      UserFeedBack: false,
      warranty: false,
      deviceName: "",
      feedBack: "",
      setDeviceName: "",
      batteryList: [],
      setPwdFlag: false,
      deviceId: this.$route.query.deviceId,
      customerId: this.$route.query.customerId,
      masterFormat: this.$route.query.masterFormat,
      hasChildren: this.$route.query.hasChildren,
      hasTwoAbility: this.$route.query.hasTwoAbility,
      pwd: "",
      pwdList: [],
      customer1: "",
      value: "",
      value1: "",
      options: [],
      options1: [],
      feedBacks: "",
      list: [],
      screen: false
    };
  },
  computed: {
    showMasterInfo() {
      // 展示主机开关和主机模式入口？
      // 需要：1.目前只能是新风版式跳转过来的 2.用户选择了这两个功能项 3.存在从机
      if (
        this.masterFormat == 1 &&
        this.hasChildren == 1 &&
        this.hasTwoAbility == 1
      ) {
        // 如果是主机版式需满足2,3
        return true;
      }
      if (this.masterFormat == 0 && this.hasTwoAbility == 1) {
        // 如果不是主机版式需满足2
        return true;
      }
      return false;
    }
  },
  methods: {
    getIndexAbilityData() {
      // 获取H5控制页面功能项数据，带isSelect参数
      getModelVo({ deviceId: this.$route.query.deviceId, pageNo: 1 }).then(
        res => {
          if (res.code === 200 && res.data) {
            const data = res.data.abilitysList;
            for (var i = 0; i < data.length; i++) {
              if (data[i].abilityName == "滤网寿命") {
                this.screen = true;
              }
            }
          }
        }
      );
    },
    getToken() {
      // 高级设置Token
      getToken({
        customerId: this.customerId,
        password: this.pwdList.join("")
      }).then(res => {
        if (res.code === 200 && res.data) {
          this.setPwdFlag = false;
          this.$router.push({
            path: "/config",
            query: {
              deviceId: this.deviceId,
              customerId: this.customerId,
              masterFormat: this.masterFormat
            }
          });
          Store.save("Token", res.data);
        }
      });
    },
    getServerUser() {
      // 客服
      getServerUser().then(res => {
        this.customer1 = res.data;
      });
    },
    sub() {
      if (this.feedBacks.length > 0 && this.feedBacks.length < 100) {
        repairInfo({
          deviceId: this.deviceId,
          ruleId: this.value1,
          description: this.feedBacks
        }).then(res => {
          if (res.code == 200) {
            this.warranty = false;
            Toast({
              mes: res.data,
              timeout: 1500,
              icon: "success"
            });
            this.value = "";
            this.value1 = "";
            this.feedBacks = "";
          }
        });
      } else {
        Toast({
          mes: "填写字数在0-50之间，谢谢！",
          timeout: 1500,
          icon: "error"
        });
      }
    },
    // changes(val) {
    //   this.value1 = "";
    //   for (var i = 0; i < this.list.length; i++) {
    //     if (val == this.list[i].dictId) {
    //       this.options1 = Object.assign([], this.list[i].rules, []);
    //     }
    //   }
    // },
    // getRuleInfo() {
    //   // 保修反馈
    //   getRuleInfo().then(res => {
    //     if (res.code == 200) {
    //       if (!res.data) {
    //         return;
    //       }
    //       this.list = res.data;
    //       for (var i = 0; i < this.list.length; i++) {
    //         this.options.push({
    //           value: this.list[i].dictName,
    //           id: this.list[i].dictId
    //         });
    //       }
    //       this.options1 = Object.assign([], this.list[0].rules, []);
    //     }
    //   });
    // },
    customMessage() {
      // 反馈意见
      if (this.feedBack.length > 0 && this.feedBack.length < 100) {
        this.UserFeedBack = false;
        customMessage({
          deviceId: this.deviceId,
          feedbackInfo: this.feedBack
        }).then(res => {
          Toast({
            mes: res.data,
            timeout: 1500,
            icon: "success"
          });
        });
      } else {
        Toast({
          mes: "填写字数在0-50之间，谢谢！",
          timeout: 1500,
          icon: "error"
        });
      }
    },
    returnMethod() {
      this.$router.back(-1);
    },
    intoShare() {
      this.$router.push({
        path: "/share",
        query: {
          deviceId: this.deviceId,
          customerId: this.customerId
        }
      });
    },
    intoMap() {
      this.$router.push({
        path: "/map",
        query: {
          deviceId: this.deviceId,
          customerId: this.customerId
        }
      });
    },
    intoPermissions() {
      this.$router.push({
        path: "/permissions",
        query: {
          deviceId: this.deviceId
        }
      });
    },
    intoConfig() {
      this.setPwdFlag = true;
    },
    intoBattery() {
      this.$router.push({
        path: "/battery",
        query: {
          deviceId: this.deviceId
        }
      });
    },
    intoData() {
      this.$router.push({
        path: "/data",
        query: {
          deviceId: this.deviceId
        }
      });
    },
    record() {
      this.$router.push({
        path: "/record",
        query: {
          deviceId: this.deviceId
        }
      });
    },
    editDev() {
      Loading.open("很快加载好了");
      editDevice({
        deviceId: this.deviceId,
        deviceName: this.setDeviceName
      })
        .then(res => {
          if (res.code === 200) {
            Loading.close();
            this.editDevFlag = false;
            Store.save("deviceName", this.setDeviceName);
            this.deviceName = this.setDeviceName;
          }
        })
        .catch(error => {
          Loading.close();
          this.$toast(error.msg, "bottom");
        });
    },
    intoInfo() {
      this.$router.push({
        path: "/devinfo",
        query: {
          deviceId: this.deviceId
        }
      });
    },
    intoMasterInfo() {
      this.$router.push({
        path: "/masterinfo",
        query: {
          deviceId: this.deviceId,
          masterFormat: this.masterFormat
        }
      });
    }
  },
  created() {
    this.getIndexAbilityData();
    // this.getRuleInfo();
    this.getServerUser();
    Loading.open("很快加载好了");
    if (Store.fetch("screens")) {
      this.batteryList = JSON.parse(Store.fetch("screens"));
    }
    setTimeout(() => {
      Loading.close();
    }, 300);
  },
  mounted() {
    this.deviceName = Store.fetch("deviceName");
  },
  watch: {
    pwd: function() {
      if (this.pwd && this.pwd.length > 0) {
        if (this.pwd.length >= 4) {
          this.pwd = this.pwd.slice(0, 4);
        }
        this.pwdList = this.pwd.split("");
      } else {
        this.pwdList = [];
      }
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/common/scss/variable.scss";
@import "src/common/scss/mixins.scss";
.set-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
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
      .confim-content {
        padding: 20px 10px;
        textarea {
          width: 100%;
          height: 100px;
          border: none;
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
        .but1 {
          width: 100%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border: 1px solid #2689ee;
          color: #2689ee;
          border-radius: 5px;
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
      background: url("../../assets/arr-left.png") no-repeat center center;
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
          content: "";
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
          content: "";
          width: 8px;
          height: 15px;
          background: url("../../assets/arr-right.png") no-repeat center center;
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
  .box {
    height: 40px;
    width: 40px;
    border: 1px solid #fff;
    display: block;
    line-height: 40px;
  }
  .flex {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
  }
  .flex-pack-justify {
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
  }
}
</style>

