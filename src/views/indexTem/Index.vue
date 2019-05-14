<template>
  <div class="main-wrapper" :class="{ active: isOpen === true }" @touchmove.prevent :style="{ 'background-image': 'url(' + img + ')'}">
    <div class="header">
      <span>地源热泵</span>
      <!-- <span class="edit" @click="intoSet"></span> -->
      <span class="time" v-if="1===2"></span>
    </div>
    <div class="but-list">
      <!-- 童锁 -->
      <div class="but-group">
        <!-- <div class="icon suo"></div>
        <div class="text">群控开关</div> -->
      </div>
      <!-- <div class="but-group" v-if="1===2">
        <div class="icon shop"></div>
        <div class="text">商城</div>
      </div> -->
      <!-- 开关 -->
      <div class="but-group">
        <div class="icon close" :class="{ active:isOpen === true  }"></div>
        <div class="text" v-if=" energy.data1 == 1">开</div>
        <div class="text" v-else>关</div>

      </div>
    </div>
    <div class="center">
      <div class="circle-data" :style="{ height:cHeight+'px' }">
        <div class="circle-inner">
          <p>
            出水温度
            <!-- <span>{{AQI}}</span> -->
          </p>
          <p :class="{ active:  isOpen === true}">{{energy.data6}}</p>
          <p></p>
          <p>℃</p>
        </div>
      </div>
      <div class="temper">
        <div class="t1">
          <p>
            <img :src="yi" style="width:20px;">
          </p>
          <p style="text-align:right;">
            <!-- 温度 -->
            <span style="font-size:16px">{{energy.data2}}℃</span>
          </p>
        </div>
        <div class="t2">
          <p>
            <img :src="er" style="width:14px;">
          </p>
          <p style="text-align:right;">
            <!-- 湿度 -->
            <span style="font-size:16px">0</span>
          </p>
        </div>
      </div>
      <div class="temper" style="margin-top:20px;">
        <div class="t1">
          <p>
            <img :src="sans" style="width:20px;">
          </p>
          <p style="text-align:right;">
            <!-- 温度 -->
            <span style="font-size:16px">{{energy.data4}}℃</span>
          </p>
        </div>
        <div class="t2">
          <p>
            <img :src="si" style="width:14px;">
          </p>
          <p style="text-align:right;">
            <!-- 湿度 -->
            <span style="font-size:16px" v-if = "energy.data5 == 3">制冷</span>
            <span style="font-size:16px" v-else>制热</span>

          </p>
        </div>
      </div>
    </div>
    <div class="child-suo" v-if="isLock">
      <img src="../../assets/ts.png" />
      <span @click="childMethod(true)">点此解除锁屏</span>
    </div>
    <div class='sleep-mask' v-if='isSleep'>
      <span @click='changeSleepStatus'>点此取消睡眠</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Loading, Toast } from "vue-ydui/dist/lib.rem/dialog";
import { Popup } from "vue-ydui/dist/lib.rem/popup";
import { setWechatTitle } from "utils";
import yi from "../../assets/yi.png"; // 第一个
import er from "../../assets/er.png"; // 第二个
import sans from "../../assets/sans.png"; // 第三个
import si from "../../assets/si.png"; // 第四个


import img1 from "../../assets/bak3.jpg"; // 白天阴
import img2 from "../../assets/bak2.jpg"; // 夜晚阴
import img3 from "../../assets/bak1.jpg"; // 夜晚晴
import img4 from "../../assets/bak4.jpg"; // 白天晴
import Store from "../wenkong/store";
import {
  getModelVo,
  newQueryDetailByDeviceId,
  getWeather,
  sendFunc,
  getStrainerData,
  getPageDatas   //查询指定页面匹配的数据点数据
} from "../wenkong/api";


let prevValues = '' //当一次用户选择的picker组件的第二个值，来判断。只有此值变化，才调用指令接口
let currValues = '' // 当前用户所在的左侧滑杆的值

export default {
  data() {
    return {
      yi:yi,
      er:er,
      sans:sans,
      si:si,

      value7: 20,
      shutdown: "", // 关机
      cloudyDay: img1, // 阴天
      sunnyDay: img4, // 晴天
      cloudyNight: img2, // 夜晚阴
      sunnyNight: img3, // 夜晚晴
      pageIsShow: false,
      img: img4,
      deviceName: "",
      customerName: "",
      cHeight: 200,
      isOpen: true, // 开关
      isLock: false, // 童锁
      isSleep: false, // 睡眠
      modeFlag: false, // 模式设置
      formatItemsList: [],
      abilitysList: [],
      weather: "", //天气
      outerTem: "", // 温度
      outerHum: "", // 湿度
      outerPm: "", // PM2.5
      deviceId: this.$route.query.deviceId,
      customerId: this.$route.query.customerId,
      setInter: undefined, // 定时id
      setInter2: undefined,
      AQI: "优",
      energy:{}
    };
  },
  computed: {
  },
  methods: {
    getIndexAbilityData() {
      // 获取H5控制页面功能项数据，带isSelect参数
      getModelVo({ deviceId: 171, pageNo: 1 }).then(res => {
        if (res.code === 200 && res.data) {
          const data = res.data;
          this.pageName = data.pageName;

          // 将功能集里的内外风机的数据加到版式集合中。为了后面持续刷新两个风机的数据
          let windData = [];
          if (
            data.formatItemsList[2].abilityId &&
            data.formatItemsList[2].showStatus
          ) {
            let ids = data.formatItemsList[2].abilityId.split(",");
            data.abilitysList.forEach(item => {
              if (ids.includes(String(item.abilityId))) {
                windData.push({
                  ...item,
                  showStatus: 1
                });
              }
            });
          }

          this.formatItemsList = data.formatItemsList.concat(windData);

          data.abilitysList.forEach(item => {
            item["currValue"] = "";
            item.abilityOptionList &&
              item.abilityOptionList.forEach(iItem => {
                iItem.isChecked = false;
              });
          });
          this.abilitysList = data.abilitysList;
          // 定时请求接口数据，更新页面数据
          // this.setInter = setInterval(() => {
          //   this.getIndexFormatData();
          // }, 1000);
          //滤网检查
          const windOption1 = data.abilitysList;
        
          this.setInter2 = setInterval(() => {
            this.getWeather();
          }, 20000);

          // 显示页面
          this.pageIsShow = true;
        }
      });
    },
    setWeather() {
      // 当前天气模式
      if (!this.isOpen) {
        this.img = this.shutdown;
        return;
      }

      let currentBak = "";
      let h = new Date().getHours(); //获取当前小时
      if (!this.weather) {
        //未返回值
        if (
          (parseInt(h) < 6 && parseInt(h) >= 0) ||
          (parseInt(h) < 24 && parseInt(h) > 18)
        ) {
          //夜晚
          currentBak = this.sunnyNight;
        } else {
          //白天
          currentBak = this.sunnyDay;
        }
      } else {
        if (
          this.weather.indexOf("雨") != -1 ||
          this.weather.indexOf("阴") != -1
        ) {
          //阴天
          if (
            (parseInt(h) < 6 && parseInt(h) >= 0) ||
            (parseInt(h) < 24 && parseInt(h) > 18)
          ) {
            //夜晚
            currentBak = this.cloudyNight;
          } else {
            //白天
            currentBak = this.cloudyDay;
          }
        } else {
          if (
            (parseInt(h) < 6 && parseInt(h) >= 0) ||
            (parseInt(h) < 24 && parseInt(h) > 18)
          ) {
            //夜晚
            currentBak = this.sunnyNight;
          } else {
            //白天
            currentBak = this.sunnyDay;
          }
        }
      }

      this.img = currentBak;
    },
    getWeather() {
      getWeather(this.deviceId).then(res => {
        const data = res.data;

        this.weather = data.weather;
        this.outerTem = data.outerTem;
        this.outerPm = data.outerPm;
        this.outerHum = data.outerHum;

        this.setWeather();
      });
    },
    /**
     * 初始化背景图片
     * 如果客户设置的话，就用客户的；否则使用默认的
     */
    initBackground() {
      const bgImgs = JSON.parse(Store.fetch("bgImgs"));
      // 依次排列：关机，白天-晴天，白天-阴天，夜晚-晴天，夜晚-阴天
      if (bgImgs[0]) {
        this.shutdown = bgImgs[0];
      }
      if (bgImgs[1]) {
        this.sunnyDay = bgImgs[1];
      }
      if (bgImgs[2]) {
        this.cloudyDay = bgImgs[2];
      }
      if (bgImgs[3]) {
        this.sunnyNight = bgImgs[3];
      }
      if (bgImgs[4]) {
        this.cloudyNight = bgImgs[4];
      }
    },
    getPageDatas(){
      getPageDatas(1).then(res=>{
        console.log(res.data)
        const data = res.data
        for(var i =0; i<data.length;i++){
          this.energy={
            data1:data[0].data,
            data2:data[1].data,
            data3:data[2].data,
            data4:data[3].data,
            data5:data[4].data,
            data6:data[5].data,
            data7:data[6].data,
            data8:data[7].data,
          }
        }
        console.log(this.energy)
        
      })
    }
  },
  created() {
    this.getPageDatas()
    this.cHeight = window.innerWidth * 0.45;
    if (window.innerWidth <= 340) {
      this.cHeight = window.innerWidth * 0.45;
    }
    this.deviceName = Store.fetch("deviceName");
    this.customerName = Store.fetch("customerName");
    setWechatTitle(this.customerName, "");

    // this.getIndexAbilityData();
    this.getWeather();
    // this.initBackground();
  },
  mounted() {
    this.thePicker = this.$refs.picker
  },
  watch: {
    isOpen(val) {
      if (val) {
        this.setWeather();
      } else {
        // 关机时，如果客户设置了关机图片就用，否则用默认背景
        this.img = this.shutdown || "";
      }
    },
    isSleep(val) {
      // 如果睡眠模式打开，隐藏掉模式弹框
      if (val) {
        this.modeFlag = false;
      }
    }
  },
  components: {
    "yd-popup": Popup
  },
  destroyed() {
    clearInterval(this.setInter);
    clearInterval(this.setInter2);
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/common/scss/variable.scss";
@import "src/common/scss/mixins.scss";
.main-wrapper {
  width: 100%;
  height: 100%;
  position: fixed;
  overflow: auto;
  top: 0;
  bottom: 0;
  background-color: #999999;
  color: #ffffff;
  transition-property: background-color;
  transition-duration: 0.3s;
  transition-timing-function: linear;
  background-repeat: no-repeat;
  background-size: cover;
  .child-suo {
    z-index: 10;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    text-align: center;
    & img {
      width: 20%;
      margin-top: 40%;
    }
    & span {
      position: absolute;
      bottom: 100px;
      left: calc(50% - 55px);
      font-size: 14px;
      border: 1px solid #fff;
      border-radius: 20px;
      line-height: 32px;
      width: 110px;
    }
  }
  .sleep-mask {
    position: absolute;
    z-index: 11;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    & span {
      font-size: 14px;
      border: 1px solid #fff;
      border-radius: 20px;
      line-height: 32px;
      height: 32px;
      width: 110px;
      margin-bottom: 100px;
    }
  }
  .info {
    margin: 0 auto tvw(34) auto;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    span {
      color: #fff;
      font-size: tvw(83);
    }
  }
  .header {
    height: 40px;
    font-size: 16px;
    line-height: 40px;
    text-align: center;
    position: relative;
    .time {
      position: absolute;
      left: 15px;
      top: 3px;
      color: #ffffff;
    }
    .edit {
      position: absolute;
      z-index: 999;
      right: 15px;
      width: 20px;
      height: 20px;
      top: 10px;
      background: url("../../assets/set.png") no-repeat center center;
      background-size: 20px 20px;
    }
  }
  .content {
    padding: 20px 15px 20px 15px;
    color: #4d4d4d;
    background: #f0f0f0;
    .title {
      font-size: 16px;
      padding-bottom: 10px;
      border-bottom: 1px solid #dfdfdf;
    }
    .list {
      & ul li {
        font-size: 14px;
        margin-top: 20px;
        .icon {
          float: right;
          margin-right: 5px;
          width: 20px;
          height: 20px;
          border: 1px solid #a3a3a3;
          border-radius: 100%;
        }
        &.active {
          .icon {
            background: url("../../assets/select.png") no-repeat center center;
            background-size: 20px 20px;
            border: none;
          }
        }
      }
    }
    .spec {
      padding-left: 10px;
      padding-right: 10px;
      & ul li {
        &.active {
          color: #000;
          background: url("../../assets/left.png") no-repeat center right 60%;
          background-size: 20px 15px;
        }
      }
    }
    .wind-speed-list {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      align-items: center;
      margin-top: 20px;
      > div {
        display: flex;
        align-items: center;
        width: 90%;
        flex-direction: column;
        > div,
        > p {
          width: 90%;
        }
        > p {
          display: flex;
          justify-content: space-between;
        }
      }
      > div:nth-child(1) {
        margin-bottom: 20px;
      }
    }
  }
  .center {
    margin-top: 10px;
    .tip {
      text-align: center;
      margin-top: 10px;
      font-size: 12px;
      line-height: 20px;
    }
    .b-data {
      margin-top: 10px;
      font-size: 12px;
      text-align: center;
      & span {
        margin-right: 10px;
        font-size: 13px;
        & em {
          font-size: 18px;
        }
        &:last-child {
          margin-right: 0px;
        }
      }
    }
    .temper {
      width: 65%;
      margin: 0 auto;
      margin-top: 10px;
      position: relative;
      overflow: hidden;
      & div {
        // text-align: center;
        font-size: 14px;
        line-height: 24px;
        & span {
          font-size: 16px;
        }
      }
      .t1 {
        float: left;
        width: 100px;
        height:70px;
        padding: 10px 20px;
        background:rgba(255, 255, 255, 0.3);
        border-radius: 10px;
      }
      .t2 {
        float: right;
        width: 100px;
        height:70px;
        padding: 10px 20px;
        background:rgba(255, 255, 255, 0.3);
        border-radius: 10px;
      }
      em {
        font-weight: 500;
      }
      span {
        word-break: keep-all;
      }
    }
    .circle-data {
      width: 45%;
      border: 1px solid #ffffff;
      border-radius: 100%;
      @media only screen and (min-device-width: 320px) and (max-device-width: 340px) {
        width: 45%;
      }

      margin: 0 auto;
      .circle-inner {
        width: 95%;
        height: 100%;
        border: 1px solid #ffffff;
        border-radius: 100%;
        margin: 0 auto;
        text-align: center;
        & p:nth-child(1) {
          margin-top: 30px;
          font-size: 24px;
        }
        & p:nth-child(2) {
          font-size: 450%;
          font-weight: 600;
          color: #d86e5d;
          letter-spacing: 5px;
          transition-property: color;
          transition-duration: 0.3s;
          transition-timing-function: linear;
          @media only screen and (min-device-width: 320px) and (max-device-width: 340px) {
            font-size: 300%;
          }
          &.active {
            color: #5ddb5d;
          }
        }
      }
    }
  }
  .but-list {
    margin-top: 10px;
    display: flex;
    text-align: center;
    font-size: 14px;
    @media only screen and (min-device-width: 320px) and (max-device-width: 340px) {
      margin-top: 10px;
    }
    &.fixed {
      position: fixed;
      bottom: 10px;
      width: 100%;
    }
    .but-group {
      flex: 1;
      & .icon {
        width: 35px;
        height: 35px;
        border: 1px solid #ffffff;
        border-radius: 100%;
        margin: 0 auto;
        margin-bottom: 5px;
        &.suo {
          background: url("../../assets/qun.png") no-repeat center center;
          background-size: 20px 20px;
        }
        &.shop {
          background: url("../../assets/cart.png") no-repeat center left 7px;
          background-size: 23px 18px;
        }
        &.close {
          background: url("../../assets/close.png") no-repeat center center;
          background-size: 18px 21px;
          //background-color:#20a8f8;
          border: 1px solid #ffffff;
          &.active {
            border: 1px solid #ffffff;
          }
        }
        &.time {
          background: url("../../assets/zhong.png") no-repeat center center;
          background-size: 21px 20px;
        }
        &.model {
          background: url("../../assets/modle.png") no-repeat center center;
          background-size: 17px 15px;
        }
        &.shan {
          background: url("../../assets/fengji.png") no-repeat center top 8px;
          background-size: 22px 18px;
        }
        &.menu {
          background: url("../../assets/shuiwen.png") no-repeat center center;
          background-size: 12px 22px;
        }
      }
    }
  }
}
</style>