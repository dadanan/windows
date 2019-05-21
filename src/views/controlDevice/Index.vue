<template>
  <div class="main-wrapper" v-show='pageIsShow' :class="{ active: isOpen === true }" @touchmove.prevent :style="{ 'background-image': 'url(' + img + ')'}">
    <div class="header">
      <div class="return" @click="returnMethod"></div>
      <span>{{ deviceName }}</span>
      <span class="edit" @click="intoSet"></span>
      <span class="time" v-if="1===2"></span>
    </div>
    <!-- 基本信息 -->
    <div class="info">
      <img src="../../assets/map.png" style="width:12px;height:auto" />&nbsp;
      <span>{{location}}&nbsp;&nbsp;</span>
      <span>{{weather}} {{getOuterTem}}℃&nbsp;&nbsp;</span>
      <span>湿度: {{getOuterHum}}%&nbsp;&nbsp;</span>
      <span>PM2.5: {{getOuterPM}}ug/m3&nbsp;&nbsp;</span>
    </div>

    <div class="panel">
      <template v-if="formatItemsList[1] && formatItemsList[1].showStatus">
        <div class="card" v-for="(item, index) in getListData(formatItemsList[1].abilityId)" @click="switchMode(item.dirValue)">
          <div class="icon" :class="{active: isOpen&&item.isChecked , hot: item.dirValue === '--' , cold: item.dirValue === '5'}"></div>
          <p class="text" :class="{active: isOpen&&item.isChecked, hot: item.dirValue === '--' , cold: item.dirValue === '5'}">
            {{item.optionDefinedName}}
          </p>
        </div>
      </template>
    </div>

    <div class="switch" @click="onOffMethod">
      <div class="icon" :class="isOpen ? 'on-off-open' : 'on-off'"></div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
import { Loading, Toast } from "vue-ydui/dist/lib.rem/dialog";
import { Popup } from "vue-ydui/dist/lib.rem/popup";
import { setWechatTitle } from "utils";
import img1 from "../../assets/bak3.jpg"; // 白天阴
import img2 from "../../assets/bak2.jpg"; // 夜晚阴
import img3 from "../../assets/bak1.jpg"; // 夜晚晴
import img4 from "../../assets/bak4.jpg"; // 白天晴
import Store from "../wenkong/store.js";
import {
  getModelVo,
  newQueryDetailByDeviceId,
  getLocation,
  getWeather,
  sendFunc
} from "../wenkong/api.js";

let prevValues = '' //当一次用户选择的picker组件的第二个值，来判断。只有此值变化，才调用指令接口
let currValues = '' // 当前用户所在的左侧滑杆的值

export default {
  data () {
    return {
      shutdown: "", // 关机
      cloudyDay: img1, // 阴天
      sunnyDay: img4, // 晴天
      cloudyNight: img2, // 夜晚阴
      sunnyNight: img3, // 夜晚晴
      deviceName: "",
      pageIsShow: false,
      img: img4,
      customerName: "",
      cHeight: 200,
      isOpen: true, // 开关
      modeCurrent: undefined,
      modeData: [],
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
      dirValueList: [],
      batteryList3: "",
      setInter2: undefined
    };
  },
  computed: {
    getOuterPM () {
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
    getOuterHum () {
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
    getOuterTem () {
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
    returnMethod () {
      this.$router.back(-1);
    },
    intoSet () {
      if (!this.isOpen) {
        return;
      }
      const query = this.$route.query;
      this.$router.push({
        path: "/set",
        query: {
          deviceId: this.deviceId,
          wxDeviceId: this.wxDeviceId,
          customerId: this.customerId,
          masterFormat: 1, // 可能作为主机（目前只有新风版式可以作为主机）
          hasChildren: query.hasChildren,
          hasTwoAbility: this.hasTwoAbility()
        }
      });
    },
    /**
     * 返回功能项的选项数据，
     * 如果是风速，和功能（多选），则特殊处理
     * @param which left 回风风速
     * @param which right 送风风速
     * @param which func 功能
     */
    getListData (abilityId, which) {
      // 说明是风速的abilityId，那么特殊情况，特殊处理
      if (which === "left") {
        return this.getListData(abilityId.split(",")[0]);
      } else if (which === "right") {
        return this.getListData(abilityId.split(",")[1]);
      } else if (which === "func") {
        return abilityId.split(",").map(id => {
          return this.getAbilityData(id);
        });
      }

      // 根据功能id获取功能项的数据
      const result = this.abilitysList.filter(
        item => item.abilityId == abilityId
      )[0];
      return result && result.abilityOptionList;
    },
    hasTwoAbility () {
      // 功能项数据中是否存在：主机模式(制冷制热)和主机开关，存在返回true
      const dirValueArray = ["2D8.0", "2DR.0"];
      const filter = this.abilitysList.filter(ability =>
        dirValueArray.includes(ability.dirValue)
      );
      if (filter.length === 2) {
        // 如果两个功能项都存在
        Store.save("masterInfoAbility", JSON.stringify(filter));
        return 1;
      }
      return 0;
    },
    /**
     * 找到对应的功能项数据
     * @param which left/right 表示内风机/外风机
     */
    getAbilityData (abilityId, which) {
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
    onOffMethod () {
      // 开关机
      const tempArray = this.abilitysList.filter(
        item => item.abilityId == this.formatItemsList[0].abilityId
      )[0];
      const tempList = tempArray.abilityOptionList;
      let index = 0;
      if (this.isOpen) {
        // 找“关”的项
        index = tempList.findIndex(item => item.dirValue === "0");
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
    getIndexAbilityData () {
      // 获取H5控制页面功能项数据，带isSelect参数
      getModelVo({ deviceId: this.deviceId, pageNo: 1 }).then(res => {
        if (res.code === 200 && res.data) {
          const data = res.data;
          Store.save("modelId", data.modelId)
          this.pageName = data.pageName;

          this.formatItemsList = data.formatItemsList;
          // console.log(this.formatItemsList)

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
          }, 20000);

          // 显示页面
          this.pageIsShow = true;
        }
      });
    },
    getIndexFormatData () {
      // 获取H5控制页面功能项数据，带isSelect参数

      // 根据功能项id筛选功能项
      const findTheAbility = (data, id) => {
        return data.filter(item => item.id == id)[0];
      };

      let ids = this.formatItemsList
        .filter(item => item.showStatus == 1 && item.abilityId)
        .map(item => item.abilityId);
      let tempIds = [];
      ids.forEach(id => {
        tempIds.push(...String(id).split(","));
      });

      newQueryDetailByDeviceId({
        deviceId: this.deviceId,
        abilityIds: tempIds
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
        if (this.isOpen) {
          this.setPopDialogData();
        }
      });
    },
    switchHandler () {
      // 开关机初始化
      const tempArray = this.abilitysList.filter(
        item => item.abilityId == this.formatItemsList[0].abilityId
      )[0].abilityOptionList;

      // 找到关机的对象
      const tempObj = tempArray[0].dirValue == 0 ? tempArray[0] : tempArray[1];
      if (tempObj.isSelect === 1) {
        // 说明是关机
        this.isOpen = false;
      } else {
        this.isOpen = true;
      }
    },
    setPopDialogData () {
      // 实时设置下方弹框内的数据
      // 为了解决：弹框打开的情况下，设备状态变化时，弹框内选项数据却没有变更的问题。
      const updateCurrData = () => {
        // 制冷、制热
        const data = this.abilitysList.find(item => item.abilityId == this.formatItemsList[1].abilityId);
        const tempArray = data.abilityOptionList
        tempArray.map(m => {
          if (data.currValue === m.dirValue) {
            m.isChecked = true
          } else {
            m.isChecked = false
          }
        })
      }

      updateCurrData();
    },
    setWeather () {
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
    getLocation () {
      getLocation(this.deviceId).then(res => {
        const data = res.data;

        // 取地址的省市区信息
        if (data.location) {
          let location = data.location.split(",");
          location.pop();
          location = location.filter(item => item).join(" ");
          this.location = location;
        }
        if (data.mapGps) {
          Store.save("mapGps", data.mapGps);
        }
      });
    },
    getWeather () {
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
    initBackground () {
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
    switchMode (index) {
      if (!this.isOpen) {
        this.$toast("当前关机状态，不可操作", "bottom");
        return false;
      }
      // 模式 1制冷 8 制热
      console.log(index)
      const tempArray = this.abilitysList.filter(
        item => item.abilityId == this.formatItemsList[1].abilityId
      )[0];
      const tempList = tempArray.abilityOptionList;
      sendFunc({
        deviceId: this.deviceId,
        funcId: tempArray.dirValue,
        value: index
      }).then(res => {
        if (res.code === 200) {
          Toast({
            mes: "发送成功",
            timeout: 1000,
            icon: "success"
          });
          console.info(
            "指令发送成功:",
            tempArray.dirValue,
            "-",
            index
          );
        }
      });
    },
  },
  created () {
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
  mounted () {
    this.thePicker = this.$refs.picker
  },
  watch: {
    isOpen (val) {
      if (val) {
        this.setWeather();
      } else {
        // 关机时，如果客户设置了关机图片就用，否则用默认背景
        this.img = this.shutdown || "";
      }
    }
  },
  components: {
    "yd-popup": Popup
  },
  destroyed () {
    clearInterval(this.setInter);
    clearInterval(this.setInter2);
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/common/scss/variable.scss";
@import "src/common/scss/mixins.scss";
@import "~@/assets/scss-function.scss";
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
  .info {
    margin: 0 auto tvw(34) auto;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding-left: 15px;
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
  .panel {
    text-align: center;
    margin-top: tvw(375);
    .card {
      display: inline-block;
      width: tvw(960);
      height: tvw(960);
      line-height: tvw(480);
      background: rgba(255, 255, 255, 0.13);
      font-size: 14px;
      color: #e0e0e0;
      margin: 0 tvw(100);
      & p.active {
        color: #7fffe7;
      }
      .icon {
        width: tvw(360);
        height: tvw(360);
        border: 1px solid #ffffff;
        border-radius: 100%;
        margin: 0 auto;
        display: inline-block;
        vertical-align: text-top;
        &.cold {
          background: url("../../assets/rebeng/zhileng.png") no-repeat center
            center;
          background-size: 48px 46px;
        }
        &.hot {
          background: url("../../assets/rebeng/gongnuan.png") no-repeat center
            center;
          background-size: 48px 46px;
        }
      }
    }
  }
  .switch {
    color: #ffffff;
    width: 60%;
    text-align: center;
    display: block;
    margin: 0 auto;
    margin-top: tvw(750);
    border-radius: 15vw;
    border: 1px solid #fff;
    .icon {
      width: tvw(291);
      height: tvw(291);
      margin: 0 auto;
      &.on-off {
        background: url("../../assets/rebeng/on-off.png") no-repeat center
          center;
        background-size: 44px 44px;
      }
      &.on-off-open {
        background: url("../../assets/rebeng/on-off-open.png") no-repeat center
          center;
        background-size: 44px 44px;
      }
    }
  }
}
</style>