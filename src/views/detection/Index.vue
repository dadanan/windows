<template>
  <div class="main-wrapper" v-show='pageIsShow' :class="{ active: isOpen === true }" @touchmove.prevent :style="{ 'background-image': 'url(' + img + ')'}">
    <div class="header">
      <span>{{ deviceName }}</span>
      <span class="edit" @click="intoSet"></span>
      <span class="time" v-if="1===2">{{ currentTime }}s</span>
    </div>
    <div class="info">
      <img src="../../assets/map.png" style="width:12px;height:auto" />&nbsp;
      <span v-show='formatItemsList[9] && formatItemsList[9].showStatus'>{{location}}&nbsp;</span>
      <span v-show='formatItemsList[10] && formatItemsList[10].showStatus'>{{weather}} {{getOuterTem}}℃&nbsp;</span>
      <span v-show='formatItemsList[11] && formatItemsList[11].showStatus'>湿度: {{getOuterHum}}%&nbsp;</span>
      <span v-show='formatItemsList[12] && formatItemsList[12].showStatus'>PM2.5: {{getOuterPM}}ug/m3&nbsp;</span>
      <span>质量: {{AQI}}</span>
    </div>
    <div class="but-list">
      <!-- 童锁 -->
      <div class="but-group" v-if='formatItemsList[7] && formatItemsList[7].showStatus'>
        <div class="icon suo" @click="childMethod"></div>
        <div class="text" @click="childMethod">{{formatItemsList[7].showName}}</div>
      </div>
      <div class="but-group" v-if="1===2">
        <div class="icon shop"></div>
        <div class="text">商城</div>
      </div>
      <!-- 开关 -->
      <div class="but-group" v-if='formatItemsList[8] && formatItemsList[8].showStatus'>
        <div class="icon close" :class="{ active:isOpen === true  }" @click="onOffMethod"></div>
        <div class="text" @click="onOffMethod">{{formatItemsList[8].showName}}</div>
      </div>
    </div>
    <div class="center">
      <div class="circle-data" :style="{ height:cHeight+'px' }">
        <div class="circle-inner">
          <p>
            负离子
          </p>
          <p v-if='formatItemsList[6] && formatItemsList[6].abilityId' :class="{ active:  isOpen === true}" v-html='anion'></p>
          <p></p>
          <p>个/cm³</p>
        </div>
      </div>
    </div>
    <div class='detection-list'>
      <div class='box' v-if='formatItemsList[0] && formatItemsList[0].abilityId'>
        <div class='left'>
          <img src='../../assets/detection/pm.png'>
          <img src='../../assets/detection/horizontal-line.png'>
          <span>PM2.5</span>
        </div>
        <div class='right'>
          {{getAbilityData(formatItemsList[0].abilityId).currValue}}<em>ug/m³</em>
        </div>
      </div>
      <div class='box' v-if='formatItemsList[1] && formatItemsList[1].abilityId'>
        <div class='left'>
          <img src='../../assets/detection/nh3.png'>
          <img src='../../assets/detection/horizontal-line.png'>
          <span>NH3</span>
        </div>
        <div class='right'>
          {{getAbilityData(formatItemsList[1].abilityId).currValue}}<em>PPM</em>
        </div>
      </div>
      <div class='line'>
        <img src='../../assets/detection/vertical-line.png'>
      </div>
      <div class='line'>
        <img src='../../assets/detection/vertical-line.png'>
      </div>
      <div class='box' v-if='formatItemsList[2] && formatItemsList[2].abilityId'>
        <div class='left'>
          <img src='../../assets/detection/tem.png'>
          <img src='../../assets/detection/horizontal-line.png'>
          <span>温度</span>
        </div>
        <div class='right'>
          {{getAbilityData(formatItemsList[2].abilityId).currValue}}<em>℃&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</em>
        </div>
      </div>
      <div class='box' v-if='formatItemsList[3] && formatItemsList[3].abilityId'>
        <div class='left'>
          <img src='../../assets/detection/hum.png'>
          <img src='../../assets/detection/horizontal-line.png'>
          <span>湿度</span>
        </div>
        <div class='right'>
          {{getAbilityData(formatItemsList[3].abilityId).currValue}}<em>%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</em>
        </div>
      </div>
      <div class='line'>
        <img src='../../assets/detection/vertical-line.png'>
      </div>
      <div class='line'>
        <img src='../../assets/detection/vertical-line.png'>
      </div>
      <div class='box' v-if='formatItemsList[4] && formatItemsList[4].abilityId'>
        <div class='left'>
          <img src='../../assets/detection/tvoc.png'>
          <img src='../../assets/detection/horizontal-line.png'>
          <span>TVOC</span>
        </div>
        <div class='right'>
          {{Number(getAbilityData(formatItemsList[4].abilityId).currValue) / 100}}<em>mg/m³</em>
        </div>
      </div>
      <div class='box' v-if='formatItemsList[5] && formatItemsList[5].abilityId'>
        <div class='left'>
          <img src='../../assets/detection/hcoc.png'>
          <img src='../../assets/detection/horizontal-line.png'>
          <span>甲醛</span>
        </div>
        <div class='right'>
          {{Number(getAbilityData(formatItemsList[5].abilityId).currValue) / 100}}<em>mg/m³</em>
        </div>
      </div>
    </div>
    <div class="child-suo" v-if="isLock">
      <img src="../../assets/ts.png" />
      <span @click="childMethod()">点此解除锁屏</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Loading, Toast } from "vue-ydui/dist/lib.rem/dialog";
import { setWechatTitle } from "utils";
import img1 from "../../assets/detection/bak3.png"; // 白天阴
import img2 from "../../assets/detection/bak2.png"; // 夜晚阴
import img3 from "../../assets/detection/bak1.png"; // 夜晚晴
import img4 from "../../assets/detection/bak4.png"; // 白天晴
import background from "../../assets/detection/background.png"; // 白天晴
import Store from "../wenkong/store";
import {
  getModelVo,
  newQueryDetailByDeviceId,
  getLocation,
  getWeather,
  sendFunc
} from "../wenkong/api";

export default {
  data() {
    return {
      value7: 20,
      shutdown: "", // 关机
      cloudyDay: img1, // 阴天
      sunnyDay: img4, // 晴天
      cloudyNight: img2, // 夜晚阴
      sunnyNight: img3, // 夜晚晴
      pageIsShow: false,
      img: img4,
      currentTime: 2,
      deviceName: "",
      customerName: "",
      cHeight: 200,
      isOpen: true, // 开关
      isLock: false, // 童锁
      formatItemsList: [],
      abilitysList: [],
      location: "",
      weather: "", //天气
      outerTem: "", // 温度
      outerHum: "", // 湿度
      outerPm: "", // PM2.5
      deviceId: this.$route.query.deviceId,
      wxDeviceId: this.$route.query.wxDeviceId,
      customerId: this.$route.query.customerId,
      setInter: undefined, // 定时id
      setInter2: undefined,
      AQI: "优"
    };
  },
  computed: {
    anion() {
      // 负离子数值处理
      let number = Number(
        this.getAbilityData(this.formatItemsList[6].abilityId).currValue
      );
      if (Number.isNaN(number)) {
        return 0;
      }
      if (number < 10000) {
        return number;
      }
      // 如果数值过万，精简显示：x.y万
      return (number / 10000).toFixed(1) + "<em>万</em>";
    },
    getOuterPM() {
      // 对应配置项被用作室内PM2.5，所以室外PM2.5直接返回第三方数据
      return this.outerPm;
      // 获取室外PM2.5数据，优先使用室外传感器数据
      if (!this.formatItemsList[15] || !this.formatItemsList[15].abilityId) {
        // 如果没有传感器功能项
        return this.outerPm;
      }
      const currData = this.getAbilityData(this.formatItemsList[15].abilityId);
      if (!currData) {
        return this.outerPm;
      }

      const currValue = currData.currValue;

      if (currValue && currValue !== "0") {
        return currValue;
      }
      return this.outerPm;
    },
    getOuterHum() {
      // 室外湿度
      if (!this.formatItemsList[14] || !this.formatItemsList[14].abilityId) {
        if (!this.outerHum) {
          return 0;
        }
        return this.outerHum.replace("%", "");
      }
      const currData = this.getAbilityData(this.formatItemsList[14].abilityId);
      if (!currData) {
        if (!this.outerHum) {
          return 0;
        }
        return this.outerHum.replace("%", "");
      }
      const currValue = currData.currValue;

      if (currValue && currValue !== "0") {
        return currValue;
      }
      if (!this.outerHum) {
        return 0;
      }
      return this.outerHum.replace("%", "");
    },
    getOuterTem() {
      // 室外温度
      if (!this.formatItemsList[13] || !this.formatItemsList[13].abilityId) {
        if (!this.outerTem) {
          return 0;
        }
        return this.outerTem.replace("℃", "");
      }
      const currData = this.getAbilityData(this.formatItemsList[13].abilityId);
      if (!currData) {
        if (!this.outerTem) {
          return 0;
        }
        return this.outerTem.replace("℃", "");
      }
      const currValue = currData.currValue;

      if (currValue && currValue !== "0") {
        return currValue;
      }
      if (!this.outerTem) {
        return 0;
      }
      return this.outerTem.replace("℃", "");
    }
  },
  methods: {
    getAbilityByDirValue(dirValue) {
      // 根据指令值找对应的功能项数据，双风机风速用到
      return this.abilitysList.filter(item => item.dirValue === dirValue)[0];
    },
    getListData(abilityId, which) {
      if (which) {
        // 说明是风速的abilityId，那么特殊情况，特殊处理
        const windOption = this.getListData(abilityId);
        let left = {};
        let right = {};
        if (windOption[0].optionValue === "280") {
          // 如果第一个选项是280，即内风机，那么找到风外风机的ability数据
          left = this.getAbilityByDirValue("280");
          right = this.getAbilityByDirValue(windOption[1].optionValue);
        } else {
          right = this.getAbilityByDirValue("280");
          left = this.getAbilityByDirValue(windOption[1].optionValue);
        }
        if (which === "left") {
          return left;
        }
        return right;
      }
      // 根据功能id获取功能项的数据
      const result = this.abilitysList.filter(
        item => item.abilityId == abilityId
      )[0];
      return result && result.abilityOptionList;
    },
    /**
     * @param which left/right 表示内风机/外风机
     */
    getAbilityData(abilityId, which) {
      if (which === "left") {
        return this.abilitysList.filter(item => item.dirValue === "280")[0];
      }
      if (which === "right") {
        return this.abilitysList.filter(item => item.dirValue === "281")[0];
      }
      const result = this.abilitysList.filter(
        item => item.abilityId == abilityId
      )[0];
      return result;
    },
    intoSet() {
      if (!this.isOpen) {
        return;
      }
      this.$router.push({
        path: "/set",
        query: {
          deviceId: this.deviceId,
          wxDeviceId: this.wxDeviceId,
          customerId: this.customerId
        }
      });
    },
    childMethod() {
      if (!this.isOpen) {
        this.$toast("当前关机状态，不可操作", "bottom");
        return false;
      }

      // 童锁开关
      const tempArray = this.abilitysList.filter(
        item => item.abilityId == this.formatItemsList[7].abilityId
      )[0];
      const tempList = tempArray.abilityOptionList;
      let index = 0;
      if (this.isLock) {
        // 找“关”的项
        index = tempList.findIndex(item => item.dirValue === "0");
      } else {
        index = tempList.findIndex(item => item.dirValue === "1");
      }

      sendFunc({
        deviceId: this.deviceId,
        funcId: tempArray.dirValue,
        value: tempList[index].dirValue
      }).then(res => {
        this.isLock = !this.isLock;
        Toast({
          mes: "指令发送成功！",
          timeout: 1000,
          icon: "success"
        });
        console.info(
          "指令发送成功:",
          tempArray.dirValue,
          "-",
          tempList[index].dirValue
        );
      });
    },
    onOffMethod() {
      // 开关机
      const tempArray = this.abilitysList.filter(
        item => item.abilityId == this.formatItemsList[8].abilityId
      )[0];
      const tempList = tempArray.abilityOptionList;
      let index = 0;
      let tempd = tempArray.dirValue;
      if (this.isOpen) {
        // 找“关”的项
        index = tempList.findIndex(item => item.dirValue === "0");
        this.offopen(tempd, tempList[index].dirValue);
      } else {
        index = tempList.findIndex(item => item.dirValue === "1");
      }
      Loading.close();
      sendFunc({
        deviceId: this.deviceId,
        funcId: tempArray.dirValue,
        value: tempList[index].dirValue
      }).then(res => {
        this.isOpen = !this.isOpen;
        console.info(
          "指令发送成功:",
          tempArray.dirValue,
          "-",
          tempList[index].dirValue
        );
      });
    },
    offopen(DirValue, Dirindex) {
      sendFunc({
        deviceId: this.deviceId,
        funcId: DirValue,
        value: Dirindex
      }).then(res => {
        console.info("指令发送成功:", "-", Dirindex);
      });
    },
    getIndexAbilityData() {
      // 获取H5控制页面功能项数据，带isSelect参数
      getModelVo({ deviceId: this.deviceId, pageNo: 1 }).then(res => {
        if (res.code === 200 && res.data) {
          const data = res.data;
          Store.save("modelId",data.modelId)      
          this.pageName = data.pageName;

          this.formatItemsList = data.formatItemsList;

          data.abilitysList.forEach(item => {
            item["currValue"] = "";
            item.abilityOptionList &&
              item.abilityOptionList.forEach(iItem => {
                iItem.isChecked = false;
              });
          });
          this.abilitysList = data.abilitysList;
          // 定时请求接口数据，更新页面数据
          this.setInter = setInterval(() => {
            this.getIndexFormatData();
          }, 1000);

          this.setInter2 = setInterval(() => {
            this.getWeather();
          }, 2000);

          // 显示页面
          this.pageIsShow = true;
        }
      });
    },

    getIndexFormatData() {
      // 获取H5控制页面功能项数据，带isSelect参数

      // 根据功能项id筛选功能项
      const findTheAbility = (data, id) => {
        return data.filter(item => item.id == id)[0];
      };

      let ids = this.formatItemsList
        .filter(item => item.showStatus == 1 && item.abilityId)
        .map(item => item.abilityId);

      newQueryDetailByDeviceId({
        deviceId: this.deviceId,
        abilityIds: ids
      }).then(res => {
        const data = res.data;
        // 将res.data中的isSelect和dirValue赋值过去
        this.abilitysList.forEach((item, index) => {
          const realAbilityData = findTheAbility(data, item.abilityId);
          if (!realAbilityData) {
            return;
          }

          // 如果有值，说明是传感器型功能项，讲数值拿过来
          if (realAbilityData.currValue) {
            item["currValue"] = realAbilityData.currValue;
          }

          if (
            !item.abilityOptionList ||
            item.abilityOptionList.length === 0 ||
            item.abilityType === 1
          ) {
            return;
          }

          item.abilityOptionList.forEach((option, oIndex) => {
            Object.assign(option, realAbilityData.abilityOptionList[oIndex]);
          });
        });

        this.switchHandler();
        // 获取列表最后一项：空气质量，的值
        const lastItem = data[data.length - 1];
        if (lastItem.abilityName === "空气质量") {
          this.AQI = lastItem.currValue;
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
    getLocation() {
      getLocation(this.deviceId).then(res => {
        const data = res.data;

        // 取地址的省市区信息
        if (data.location) {
          let location = data.location.split(",");
          location.pop();
          location = location.filter(item => item).join(",");
          this.location = location;
        }
        if (data.mapGps) {
          Store.save("mapGps", data.mapGps);
        }
      });
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
    switchHandler() {
      // 开关机初始化
      const tempArray = this.abilitysList.filter(
        item => item.abilityId == this.formatItemsList[8].abilityId
      )[0].abilityOptionList;

      // 找到关机的对象
      const tempObj = tempArray[0].dirValue == 0 ? tempArray[0] : tempArray[1];
      if (tempObj.isSelect === 1) {
        // 说明是关机
        this.isOpen = false;
      } else {
        this.isOpen = true;
      }

      // 童锁初始化
      if (
        !this.formatItemsList ||
        !this.formatItemsList[7] ||
        this.formatItemsList[7].showStatus ||
        !this.formatItemsList[7].abilityId
      ) {
        return;
      }
      const tempArray2 = this.abilitysList.filter(
        item => item.abilityId == this.formatItemsList[7].abilityId
      )[0].abilityOptionList;

      const tempObj2 =
        tempArray2[0].dirValue == 0 ? tempArray2[0] : tempArray2[1];
      if (tempObj2.isSelect === 1) {
        this.isLock = false;
      } else {
        this.isLock = true;
      }
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
    }
  },
  created() {
    this.cHeight = window.innerWidth * 0.45;
    if (window.innerWidth <= 340) {
      this.cHeight = window.innerWidth * 0.45;
    }
    this.deviceName = Store.fetch("deviceName");
    this.customerName = Store.fetch("customerName");
    setWechatTitle(this.customerName, "");

    this.getIndexAbilityData();
    this.getLocation();
    this.getWeather();
    this.initBackground();
  },
  watch: {
    isOpen(val) {
      if (val) {
        this.setWeather();
      } else {
        // 关机时，如果客户设置了关机图片就用，否则用默认背景
        this.img = this.shutdown || "";
      }
    }
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
  display: flex;
  flex-direction: column;
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
      width: 55%;
      margin: 0 auto;
      margin-top: 10px;
      position: relative;
      overflow: hidden;
      &::before {
        content: "";
        position: absolute;
        width: 1px;
        height: 30px;
        background: #ffffff;
        left: 50%;
        top: 10px;
      }
      & div {
        text-align: center;
        font-size: 14px;
        line-height: 24px;
        & span {
          font-size: 16px;
        }
      }
      .t1 {
        float: left;
      }
      .t2 {
        float: right;
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
            color: white;
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
          background: url("../../assets/suo.png") no-repeat center center;
          background-size: 15px 20px;
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
          background: url("../../assets/shan.png") no-repeat center top 6px;
          background-size: 22px 20px;
        }
        &.menu {
          background: url("../../assets/menu.png") no-repeat center center;
          background-size: 18px 16px;
        }
      }
    }
  }
  .detection-list {
    display: flex;
    flex-wrap: wrap;
    width: 90%;
    margin: auto;
    .box {
      width: 50%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .left {
        width: 35px;
        display: flex;
        flex-direction: column;
        align-items: center;
        > img:first-child {
          transform: scale(0.7);
        }
        > img:nth-child(2) {
          margin: 2px 0 7px 0;
          transform: scale(0.6, 1);
          display: block;
        }
      }
      .right {
        width: 80px;
        margin-left: 10px;
        font-size: 25px;
        em {
          font-size: 13px;
          margin-left: 2px;
        }
      }
    }
    .line {
      width: 50%;
      color: white;
      margin: 10px 0;
      img {
        display: block;
        margin: auto;
        transform: scale(1, 0.7);
      }
    }
  }
}
</style>

<style>
div.center > div > div > p.active > em {
  font-size: 14px;
}
</style>
