<template>
  <div class='index-container' :class="{ active: isOpen === true }" @touchmove.prevent :style="{ 'background-image': 'url(' + img + ')'}" v-show='pageIsShow'>
    <div class='header'>
      <img src='@/assets/arrow_left.png' @click='goBack()'>
      <span>{{deviceName}}</span>
      <img class='setting' @click='intoSet' src='@/assets/set.png'>
    </div>
    <div class='info'>
      <img src="../../assets/map.png" />&nbsp;
      <span v-show='formatItemsList[9] && formatItemsList[9].showStatus'>{{location}}&nbsp;</span>
      <span v-show='formatItemsList[10] && formatItemsList[10].showStatus'>{{weather}} {{outerTem}}&nbsp;</span>
      <span v-if='formatItemsList[11] && formatItemsList[11].showStatus'>湿度: {{outerHum}}%&nbsp;</span>
      <span v-show='formatItemsList[12] && formatItemsList[12].showStatus'>PM2.5: {{outerPm}}ug/m3</span>
    </div>
    <div class='switch'>
      <div v-show='formatItemsList[7] && formatItemsList[7].showStatus && formatItemsList[7].abilityId'>
        <div class='left'>
          <img src='@/assets/wenkong/host-status-open.png' v-if='hostIsOpen()'>
          <img src='@/assets/wenkong/host-status-close.png' v-else>
        </div>
        <p>{{formatItemsList[7] && formatItemsList[7].showName}}</p>
      </div>
      <div v-show='formatItemsList[8] && formatItemsList[8].showStatus' @click='onOffMethod'>
        <div>
          <img src='@/assets/wenkong_close.png' v-if='isOpen'>
          <img src='@/assets/wenkong_close.png' v-else>
        </div>
        <p>{{formatItemsList[8] && formatItemsList[8].showName}}</p>
      </div>
    </div>
    <div class='main'>
      <div>
        <h3>设定值</h3>
        <h1>{{temNumber}}</h1>
        <h3 class='last'>℃</h3>
      </div>
    </div>
    <div class='current-info'>
      <p v-if='formatItemsList[4] && formatItemsList[4].showStatus'>
        {{formatItemsList[4] && formatItemsList[4].showName}}
        <span class='strong'>{{(getAbilityData(formatItemsList[4].abilityId).currValue)/10}}</span>
        ℃
      </p>
      <p v-if='formatItemsList[5] && formatItemsList[5].showStatus'>
        {{formatItemsList[5] && formatItemsList[5].showName}}
        <span class='strong'>{{(getAbilityData(formatItemsList[5].abilityId).currValue)/10}}</span>
        %
      </p>
    </div>
    <!-- <div class='function' v-show='isOptionalFunctionOpen && hasOptionalFunction()'>
      <div v-for='(item,index) in getFunctionList' @click='functionClicked(item)' :class="{'able': currFunction === index}" :key='item.id'>
        <span>{{item.optionDefinedName || item.optionName}}</span>
      </div>
    </div> -->
    <div class='menu'>
      <div @click='modelClickedHandler(formatItemsList[0] && formatItemsList[0].abilityId,0)'>
        <div>
          <img class='first' src='@/assets/temperature.png'>
        </div>
        <span>{{formatItemsList[0] && formatItemsList[0].showName}}</span>
      </div>
      <div @click='modelClickedHandler(formatItemsList[1].abilityId,1)' v-show='formatItemsList[1] && formatItemsList[1].showStatus'>
        <div>
          <img src='@/assets/model.png'>
        </div>
        <span>{{formatItemsList[1] && formatItemsList[1].showName}}</span>
      </div>
      <div @click='modelClickedHandler(formatItemsList[2] && formatItemsList[2].abilityId,2)' v-show='formatItemsList[2] && formatItemsList[2].showStatus'>
        <div>
          <img class='third' src='@/assets/wind.png'>
        </div>
        <span>{{formatItemsList[2] && formatItemsList[2].showName}}</span>
      </div>
      <div @click="intiTime">
        <div>
          <img class='third' src='@/assets/zhong.png'>
        </div>
        <span>定时</span>
      </div>
    </div>
    <div class='left-side' v-show='formatItemsList[6] && formatItemsList[6].showStatus' :style='{
      background: leftSideColor
    }'>
      <div>
        <img class='first' src='@/assets/wind.png'>
        <span>{{currentSpeedIndexLabel}}</span>
      </div>
      <div>
        <img class='second' src='@/assets/model.png'>
        <span>{{modeCurrentLabel}}</span>
      </div>
    </div>
    <div class='right-side'>
      <img v-if='functionIcon.isFloorHot' src='@/assets/wenkong/floor-hot.png'>
      <img v-if='functionIcon.isAirConditioning' src='@/assets/wenkong/air-conditioning.png'>
      <img v-if='functionIcon.isAuxiliaryHot' src='@/assets/wenkong/auxiliary-hot.png'>
      <img v-if='functionIcon.isTopCold' src='@/assets/wenkong/top-cold.png'>
      <img v-if='functionIcon.isTopHot' src='@/assets/wenkong/top-hot.png'>
      <img v-if='functionIcon.isVentilation' src='@/assets/wenkong/ventilation.png'>
    </div>
    <!-- 模式 -->
    <yd-popup v-model="modelVisible" position="bottom" width="90%">
      <div class="content">
        <div class="title">模式设定</div>
        <div class="list">
          <ul v-if='formatItemsList[1] && formatItemsList[1].abilityId'>
            <li v-if='item.status !== 2' v-for="(item,index) in getListData(formatItemsList[1].abilityId)" :class="{ active: modeCurrent == index }" @click="modeClicked(index)" :key='item.optionValue'>
              <span>{{ item.optionDefinedName || item.optionName }}</span>
              <div class="icon"></div>
            </li>
          </ul>
        </div>
      </div>
    </yd-popup>
    <!-- 风速 -->
    <yd-popup v-model="windVisible" position="bottom" width="90%">
      <div class="content">
        <div class="title">风速设定</div>
        <div class="list wind-speed">
          <p>
            <span>{{speedName}}</span>
            <span>{{currentSpeedIndexLabel}}</span>
          </p>
          <div>
            <el-slider v-model="currentSpeed" :step="leftStep()" @change='sliderChanged' show-stops :show-tooltip="false">
            </el-slider>
          </div>
        </div>
      </div>
    </yd-popup>
    <yd-popup v-model="temperatureVisible" position="bottom" width="90%">
      <div class="content">
        <div class="title">
          <span>环境设定</span>
          <span @click='confirmSetting'>确定</span>
        </div>
        <div class="list">
          <div class='inside'>
            <div>
              <span class='info'>温度</span>
              <img @click='reduceTem' src='@/assets/reduce.png'>
              <div>
                <span class='number'>{{temNumber}}</span>
                <span class='icon'>℃</span>
              </div>
              <img @click='increaseTem' src='@/assets/add.png'>
            </div>
            <!-- <div>
              <span class='info'>湿度</span>
              <img @click='reduceHum' src='@/assets/reduce.png'>
              <div>
                <span class='number'>{{humNumber}}</span>
                <span class='icon'>%</span>
              </div>
              <img @click='increaseHum' src='@/assets/add.png'>
            </div> -->
          </div>
        </div>
      </div>
    </yd-popup>
    <div class='gif'>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { setWechatTitle } from "utils";
import { Loading, Toast } from "vue-ydui/dist/lib.rem/dialog";
import { Popup } from "vue-ydui/dist/lib.rem/popup";
import {
  getModelVo,
  newQueryDetailByDeviceId,
  getLocation,
  getWeather,
  sendFunc
} from "./api";
import Store from "./store";
import img1 from "../../assets/bak3.jpg"; // 白天阴
import img2 from "../../assets/bak2.jpg"; // 夜晚阴
import img3 from "../../assets/bak1.jpg"; // 夜晚晴
import img4 from "../../assets/bak4.jpg"; // 白天晴
import store from './store';

export default {
  data () {
    return {
      shutdown: "", // 关机
      cloudyDay: img1, // 阴天
      sunnyDay: img4, // 晴天
      cloudyNight: img2, // 夜晚阴
      sunnyNight: img3, // 夜晚晴
      img: img4,
      toolColor: {
        // 不同的天气下，小工具的背景颜色改变
        cloudyDay: "transparent",
        sunnyDay: "transparent",
        cloudyNight: "transparent",
        sunnyNight: "transparent",
        shutdown: "transparent"
      },
      leftSideColor: "transparent",
      modelVisible: false,
      windVisible: false,
      pageIsShow: false,
      temNumber: 26, // 客户设定温度
      humNumber: 45, // 客户设定湿度
      temperatureVisible: false, // 显示温度设定弹框
      currentOptionForWind: 0, // 风速的当前选择项
      currentSpeedIndexLabel: "", // 当前选项风速档位的名称
      modeCurrentLabel: "", // 当前选择模式选项的名称
      currentSpeed: 0,
      windModel: true, // 用户点击了风速模块?
      currFunction: 0, // 当前次级模式被启用的index
      isOptionalFunctionOpen: true,
      modelData: {},
      windData: {},
      modeCurrent: 0, // 当前模式选项下标
      functionList: [],
      deviceName: "",
      customerName: "",
      formatItemsList: [],
      abilitysList: [],
      location: "",
      weather: "",
      outerTem: "",
      outerHum: "", // 湿度
      outerPm: "", // PM2.5
      deviceId: this.$route.query.deviceId,
      deviceId: this.$route.query.deviceId,
      masterDeviceId: Store.fetch("masterDeviceId"),
      customerId: this.$route.query.customerId,
      hostPowerStatus: this.$route.query.hostPowerStatus,
      setInter: undefined, // 定时器的id
      isOpen: null, // 开机状态？
      status: true, // 主机状态
      functionIcon: {
        isFloorHot: false,
        isAirConditioning: false,
        isAuxiliaryHot: false,
        isTopCold: false,
        isTopHot: false,
        isVentilation: false
      },
      hasSet: false // 保证一些数据每次进入页面只刷新一次。
    };
  },
  computed: {
    speedName () {
      const name = "送风风速";
      if (!this.formatItemsList[2] || !this.formatItemsList[2].abilityId) {
        return name;
      }
      const data = this.getAbilityData(this.formatItemsList[2].abilityId);
      if (!data) {
        return name;
      }
      return data.definedName || data.abilityName;
    },
    /**
     * 设置功能项指令
     * 返回功能项选项数据
     */
    getFunctionList () {
      if (!this.formatItemsList[3] || !this.formatItemsList[3].abilityId) {
        return [];
      }
      const ids = this.formatItemsList[3].abilityId.split(",");
      const id = this.isOptionalFunctionOpen ? ids[0] : ids[1];
      const data = this.getAbilityData(id);
      if (!data) {
        return [];
      }
      const option = data && data.abilityOptionList;

      return option || [];
    }
  },
  methods: {
    /**
     * 温控器的主机，目前正在开机状态
     * 如果用户选择了‘主机状态功能项’，获取它的主机的‘主机状态功能项’的值
     */
    hostIsOpen () {
      if (
        !this.formatItemsList[7] ||
        !this.formatItemsList[7].showStatus ||
        !this.formatItemsList[7].abilityId
      ) {
        return false;
      }
      // 从路径参数中获取传过来的主机状态值
      return this.hostPowerStatus == 1;
    },
    /**
     * 用户配置了打开了次级模式并且配置了数据?
     */
    hasOptionalFunction () {
      if (!(this.formatItemsList[3] && this.formatItemsList[3].abilityId)) {
        return false;
      }
      const ids = this.formatItemsList[3].abilityId.split(",");
      const id = this.isOptionalFunctionOpen ? ids[0] : ids[1];
      const ability = this.getAbilityData(id);
      if (!ability) {
        return false;
      }

      const option = ability.abilityOptionList;
      if (!option || option.length === 0) {
        return false;
      }

      return true;
    },
    modeClicked (index) {
      const data = this.getAbilityData(this.formatItemsList[1].abilityId);
      if (!data) {
        return;
      }
      const option = data.abilityOptionList;
      let value = option[index].optionValue;
      // 如果是致热模式，默认打开选项值为6的次级模式
      if (value == "4") {
        this.setIconVisible(["isFloorHot"]);
        if (this.hasOptionalFunction()) {
          value = 41;
        }
      }
      this.sendFunc(data.dirValue, value, () => {
        this.modeCurrent = index;
        // 如果当前模式是致热模式，打开次级功能模式
        if ([41, 42, 43, 44].includes(Number(value))) {
          this.isOptionalFunctionOpen = true;
        } else[(this.isOptionalFunctionOpen = false)];
      });
    },
    sliderChanged (val) {
      const index = val / this.leftStep();
      const data = this.getAbilityData(this.formatItemsList[2].abilityId);
      if (!data) {
        return;
      }
      const option = data.abilityOptionList;

      this.currentSpeedIndexLabel =
        option[index].optionDefinedName || option[index].optionName;

      sendFunc({
        deviceId: this.deviceId,
        funcId: data.dirValue,
        value: option[index].optionValue
      }).then(() => {
        Toast({
          mes: "指令发送成功！",
          timeout: 1000,
          icon: "success"
        });
        console.info(
          "指令发送成功:",
          data.dirValue,
          "-",
          option[index].optionValue
        );
      });
    },
    leftStep () {
      if (!this.formatItemsList[2] || !this.formatItemsList[2].abilityId) {
        return 25;
      }
      return (
        100 / (this.getListData(this.formatItemsList[2].abilityId).length - 1)
      );
    },
    setTemperature () {
      // 保证每次进入页面只初始化一次。不随newQuery接口定时刷新
      if (this.hasSet) {
        return;
      }
      // 动态初始化环境设置的温度、湿度数值
      if (
        !this.formatItemsList[0] ||
        !this.formatItemsList[0].showStatus ||
        !this.formatItemsList[0].abilityId
      ) {
        return;
      }

      const ablityId = this.formatItemsList[0].abilityId.split(",");

      ablityId.forEach(id => {
        const ability = this.getAbilityData(id);
        // 设置温度的数值
        if (ability.dirValue === "2DD.0") {
          this.temNumber = Number(ability.currValue);
        }

        // 设置湿度的数值
        if (ability.dirValue === "2DE.0") {
          this.humNumber = Number(ability.currValue);
        }
      });
      this.hasSet = true;
    },
    switchHandler () {
      // 开关机初始化
      const tempArray = this.abilitysList.filter(
        item => item.abilityId == this.formatItemsList[8].abilityId
      )[0].abilityOptionList;

      // 找到关机的对象
      const tempObj = tempArray[0].dirValue == 0 ? tempArray[0] : tempArray[1];

      if (tempObj.isSelect == 1) {
        // 说明是关机
        this.isOpen = false;
      } else {
        this.isOpen = true;
      }

      // 主机状态初始化
      if (
        this.formatItemsList[7] &&
        this.formatItemsList[7].showStatus &&
        this.formatItemsList[7].abilityId
      ) {
        const tempArray2 = this.abilitysList.filter(
          item => item.abilityId == this.formatItemsList[7].abilityId
        )[0].abilityOptionList;

        const tempObj2 =
          tempArray2[0].dirValue == 0 ? tempArray2[0] : tempArray2[1];
        if (tempObj2.isSelect == 1) {
          // 说明是关机
          this.status = false;
        } else {
          this.status = true;
        }
      }
    },
    onOffMethod () {
      // 开关机

      const tempArray = this.abilitysList.filter(
        item => item.abilityId == this.formatItemsList[8].abilityId
      )[0];
      const tempList = tempArray.abilityOptionList;
      let index = 0;
      if (this.isOpen) {
        // 找“关”的项
        index = tempList.findIndex(item => item.dirValue == "0");
      } else {
        index = tempList.findIndex(item => item.dirValue == "1");
      }

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
    getAbilityData (abilityId) {
      const result = this.abilitysList.filter(
        item => item.abilityId == abilityId
      )[0];
      return result;
    },
    goBack () {
      history.back();
    },
    modelClickedHandler (id, index) {
      if (!this.isOpen) {
        this.$toast("当前关机状态，不可操作", "bottom");
        return;
      }

      if (index == 0) {
        // 如果用户唤起温度框
        this.temperatureVisible = true;
        return;
      }

      index == 1 ? (this.modelVisible = true) : (this.windVisible = true);
    },
    increaseTem () {
      this.temNumber += 1;
    },
    reduceTem () {
      if (this.temNumber <= 0) {
        return;
      }
      this.temNumber -= 1;
    },

    increaseHum () {
      this.humNumber += 1;
    },
    reduceHum () {
      if (this.humNumber <= 0) {
        return;
      }
      this.humNumber -= 1;
    },
    confirmSetting () {
      this.sendFunc("2DD.0", this.temNumber);
      this.sendFunc("2DE.0", this.humNumber);
      this.temperatureVisible = false;
    },
    intoSet () {
      if (!this.isOpen) {
        return;
      }
      this.$router.push({
        path: "/set",
        query: {
          deviceId: this.deviceId,
          wxDeviceId: this.wxDeviceId,
          customerId: this.customerId,
          masterFormat: 0, // 此版式不能作为主机版式
          hasTwoAbility: this.hasTwoAbility()
        }
      });
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
    modelClicked (index, data, which) {
      if (which == 3) {
        this.currentOptionForWind = index;
      } else {
        this.currentOption = index;
      }
      this.sendFunc(data.dirValue, data.abilityOptionList[index].dirValue);
    },
    sendFunc (funcId, value, cb) {
      // 发送指令
      sendFunc({
        deviceId: this.deviceId,
        funcId: funcId,
        value: value
      }).then(() => {
        if (cb) {
          cb();
        }
        Toast({
          mes: "指令发送成功",
          timeout: 1000,
          icon: "success"
        });
        console.info("指令发送成功:", funcId, "-", value);
      });
    },
    functionClicked (item) {
      if (!this.isOpen) {
        this.$toast("当前关机状态，不可操作", "bottom");
        return;
      }
      this.sendFunc("210", item.optionValue, () => {
        Toast({
          mes: "指令发送成功",
          timeout: 1000,
          icon: "success"
        });
      });
    },
    getIndexAbilityData () {
      // 获取H5控制页面功能项数据，带isSelect参数
      getModelVo({ deviceId: this.deviceId, pageNo: 1 }).then(res => {
        if (res.code == 200 && res.data) {
          const data = res.data;
          Store.save("modelId", data.modelId)
          this.formatItemsList = data.formatItemsList;

          data.abilitysList.forEach(item => {
            item["currValue"] = "";
          });
          this.abilitysList = data.abilitysList;
          // 定时请求接口数据，更新页面数据
          this.setInter = setInterval(() => {
            this.getIndexFormatData(res.data);
            this.getWeather();
          }, 2000);

          // 显示页面内容
          this.pageIsShow = true;
        }
      });
    },
    getIndexFormatData (list) {
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
          // 如果有值，说明是温度功能项，讲数值拿过来
          if (data[index] && data[index].currValue) {
            // 找到对应的温度功能项对象
            const temp = this.abilitysList.filter(
              itemA => itemA.abilityId == data[index].id
            )[0];
            if (!data[index]) {
              return;
            }
            try {
              temp.currValue = data[index].currValue;
            } catch (e) {
              // 怪异的错误，就算判断data[index]不为空，也会出现currValue of undefined错误～
            }
          }
          if (!item.abilityOptionList || item.abilityOptionList.length == 0) {
            return;
          }
          item.abilityType !== 1 &&
            item.abilityOptionList.forEach((option, oIndex) => {
              const result = findTheAbility(data, item.abilityId);
              if (result) {
                const temp = Object.assign(
                  option,
                  result.abilityOptionList[oIndex]
                );
              }
            });
        });

        this.switchHandler();
        this.setTemperature();
        this.setPopDialogData();
      });
    },
    setPopDialogData () {
      // 实时设置下方模式、风速，功能等弹框内的数据
      // 为了解决：弹框打开的情况下，设备状态变化时，弹框内选项数据却没有变更的问题。

      // 更新模式选项
      let modeData = {};
      const updateModel = () => {
        modeData = this.abilitysList.filter(
          item => item.abilityId == this.formatItemsList[1].abilityId
        )[0];
        if (!modeData) {
          return;
        }

        // 根据isSelect的值，对相应选项执行默认选中行为
        modeData.abilityOptionList.forEach((item, iIndex) => {
          if (item.isSelect == 0) {
            return;
          }

          // “模式选项”
          this.modeCurrent = iIndex;
          this.modeCurrentLabel = item.optionDefinedName || item.optionName;

          // 如果当前选中对模式是致热，打开次级功能模式
          if ([41, 42, 43, 44].includes(Number(item.optionValue))) {
            this.isOptionalFunctionOpen = true;
          } else {
            this.isOptionalFunctionOpen = false;
            // 如果可以的话，显示通风或者致冷图标
            if (item.dirValue == 2) {
              this.setIconVisible(["isVentilation"]);
            } else if (item.dirValue == 3) {
              this.setIconVisible(["isTopCold"]);
            } else if (item.dirValue == 4) {
              this.setIconVisible(["isFloorHot"]);
            } else {
              this.setIconVisible([""]);
            }
          }
        });
      };

      const updateWindSpeed = () => {
        const data = this.abilitysList.filter(
          item => item.abilityId == this.formatItemsList[2].abilityId
        )[0];
        if (!data) {
          return;
        }
        // 根据isSelect的值，对相应选项执行默认选中行为
        data.abilityOptionList.forEach((item, iIndex) => {
          if (item.isSelect == 0) {
            return;
          }
          // “内风速选项”
          this.currentSpeed = this.leftStep() * iIndex;
          this.currentSpeedIndexLabel =
            item.optionDefinedName || item.definedName;
        });
      };

      // 次级模式的初始化
      const updateAbility = () => {
        const data = this.getListData(this.formatItemsList[3].abilityId, 'func');
        data.forEach((item, index) => {
          if (item.isSelect == 1) {
            this.currFunction = index;

            // 将模式的下标设置成致热
            modeData.abilityOptionList.forEach((item, index) => {
              if (item.optionValue === "4") {
                this.modeCurrent = index;
                this.modeCurrentLabel =
                  item.optionDefinedName || item.optionName;
              }
            });
            // 启用对应图标
            if (item.optionName === "空调") {
              this.setIconVisible(["isAirConditioning"]);
            } else if (item.optionName === "地暖") {
              this.setIconVisible(["isFloorHot"]);
            } else if (item.optionName === "快暖") {
              this.setIconVisible(["isTopHot", "isFloorHot"]);
            } else if (item.optionName === "辅热") {
              this.setIconVisible(["isAuxiliaryHot"]);
            }
          }
        });
      };

      if (this.formatItemsList[1].abilityId) {
        updateModel();
      }
      if (this.formatItemsList[2].abilityId) {
        updateWindSpeed();
      }
      if (this.formatItemsList[3].abilityId) {
        updateAbility();
      }
    },
    setIconVisible (keys) {
      this.functionIcon = {
        isFloorHot: false,
        isAirConditioning: false,
        isAuxiliaryHot: false,
        isTopCold: false,
        isTopHot: false,
        isVentilation: false
      };
      keys.forEach(key => {
        this.functionIcon[key] = true;
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
    getLocation () {
      getLocation(this.masterDeviceId).then(res => {
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
      getWeather(this.masterDeviceId).then(res => {
        const data = res.data;

        this.weather = data.weather;
        this.outerTem = data.outerTem;
        this.outerPm = data.outerPm;
        this.outerHum = data.outerHum;

        this.setWeather();
      });
    },
    setWeather () {
      // 当前天气模式
      if (!this.isOpen) {
        this.img = this.shutdown;
        return;
      }

      const setColor = day => {
        this.leftSideColor = this.toolColor[day];
      };

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
          setColor("sunnyNight");
        } else {
          //白天
          currentBak = this.sunnyDay;
          setColor("sunnyDay");
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
            setColor("cloudyNight");
          } else {
            //白天
            currentBak = this.cloudyDay;
            setColor("cloudyDay");
          }
        } else {
          if (
            (parseInt(h) < 6 && parseInt(h) >= 0) ||
            (parseInt(h) < 24 && parseInt(h) > 18)
          ) {
            //夜晚
            currentBak = this.sunnyNight;
            setColor("sunnyNight");
          } else {
            //白天
            currentBak = this.sunnyDay;
            setColor("sunnyDay");
          }
        }
      }

      this.img = currentBak;
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
    intiTime () {
      if (!this.isOpen) {
        this.$toast("当前关机状态，不可操作", "bottom");
        return;
      }
      this.$router.push({
        path: "/timinglist",
        query: {
          deviceId: this.deviceId,
          wxDeviceId: this.wxDeviceId,
          customerId: this.customerId
        }
      });
    }
  },
  watch: {
    isOpen (val) {
      if (val) {
        this.setWeather();
      } else {
        // 关机时，如果客户设置了关机图片就用，否则用默认背景
        this.img = this.shutdown || "";
        this.leftSideColor = this.toolColor["shutdown"];
      }
    }
  },
  created () {
    this.deviceName = Store.fetch("deviceName");
    this.customerName = Store.fetch("customerName");
    setWechatTitle(this.customerName, "");

    this.getIndexAbilityData();
    this.getLocation();
    this.getWeather();
    this.initBackground();
    this.hasSet = false;
  },
  destroyed () {
    clearInterval(this.setInter);
  },
  components: {
    "yd-popup": Popup
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/common/scss/variable.scss";
@import "src/common/scss/mixins.scss";
@import "~@/assets/scss-function.scss";

.index-container {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  box-sizing: border-box;
  background-color: #999;
  display: flex;
  flex-direction: column;
  background-repeat: no-repeat;
  background-size: cover;
  .header {
    box-sizing: border-box;
    margin: tvw(0) tvw(162) 0 tvw(162);
    font-size: 16px;
    line-height: 40px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      font-size: tvw(125);
      color: #f2f2f2;
      font-weight: bold;
    }
    img:first-child {
      display: block;
      height: tvw(111);
      position: absolute;
      left: 0;
    }
    img.setting {
      display: block;
      position: absolute;
      right: 0;
      height: tvw(140);
    }
  }
  .info {
    margin: 0 auto tvw(34) auto;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      color: #fff;
      font-size: tvw(83);
    }
    img {
      width: 12px;
      height: auto;
    }
  }
  .switch {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: tvw(2685);
    margin: tvw(200) auto;
    > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      > div {
        border-radius: 50%;
        border: 0.5px solid #fff;
        width: tvw(251);
        height: tvw(251);
        margin-bottom: tvw(50);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        input {
          transform: scale(0.5);
          position: absolute;
          left: -tvw(55);
        }
        img {
          width: tvw(147);
          position: relative;
          top: -tvw(10);
        }
      }
      p {
        color: #fff;
      }
    }
    div.left {
      img {
        width: tvw(167);
        position: relative;
        top: -0.1vw;
        left: -0.2vw;
      }
    }
  }
  .main {
    width: tvw(1501);
    height: tvw(1472);
    border: 1px solid #ffffff;
    border-radius: 50%;
    margin: auto;
    margin-top: tvw(150);
    > div {
      width: 95%;
      height: 100%;
      border: 1px solid #ffffff;
      border-radius: 50%;
      margin: 0 auto;
      line-height: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      * {
        font-weight: normal;
      }
      h3 {
        color: #fff;
        font-size: tvw(150);
      }
      h1 {
        color: #00ffdc;
        font-size: tvw(650);
        margin-top: tvw(100);
        margin-bottom: tvw(100);
      }
      h3 {
        color: #fff;
        font-size: tvw(200);
        margin-bottom: tvw(20);
      }
    }
  }
  .current-info {
    width: tvw(2685);
    margin: auto;
    margin-top: tvw(100);
    margin-bottom: tvw(100);
    font-size: tvw(120);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    p {
      width: fit-content;
      .strong {
        font-size: tvw(290);
      }
    }
  }
  .function {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    div.able {
      background-image: url("~@/assets/able.png");
    }
    div {
      background-image: url("~@/assets/disable.png");
      background-size: contain;
      background-repeat: no-repeat;
      height: tvw(350);
      width: tvw(450);
      display: flex;
      line-height: 1;
      justify-content: center;
      align-items: center;
      span {
        top: -tvw(10);
        position: relative;
        color: white;
      }
    }
  }
  .menu {
    width: tvw(2485);
    margin: auto;
    margin-bottom: tvw(100);
    display: flex;
    align-items: center;
    justify-content: space-between;
    > div {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      div {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        width: tvw(300);
        height: tvw(300);
        border: 2px solid #fff;
        img {
          height: tvw(180);
        }
        img:not(.first) {
          transform: scale(0.65);
        }
        img.third {
          transform: scale(0.8);
        }
      }
      div.grey {
        border-color: #aaa;
      }
      span {
        margin-top: tvw(50);
        font-size: tvw(125);
        color: #fff;
      }
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
      span:last-child {
        float: right;
      }
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
      .inside {
        > div {
          width: fit-content;
          display: flex;
          align-items: center;
          margin: tvw(300) auto tvw(100) auto;
          > div {
            margin: auto tvw(205);
            width: tvw(605);
            height: tvw(255);
            background-image: url("~@/assets/small_background.png");
            background-size: cover;
            background-repeat: no-repeat;
            line-height: tvw(255);
            text-align: center;
            color: #fff;
            span.number {
              font-size: tvw(150);
            }
            span.icon {
              font-size: tvw(17);
            }
          }
          img {
            width: tvw(141);
            height: tvw(141);
          }
          .info {
            margin: 0;
            margin-right: 30px;
            color: grey;
          }
        }
      }
    }
    .wind-speed {
      display: flex;
      align-items: center;
      width: 90%;
      flex-direction: column;
      margin: auto;
      margin-top: 20px;
      > div,
      > p {
        width: 90%;
      }
      > p {
        display: flex;
        justify-content: space-between;
      }
    }
  }
  .left-side {
    position: fixed;
    width: tvw(700);
    height: tvw(600);
    left: 0;
    top: 32%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    background: transparent;
    opacity: 0.9;
    border-radius: 0 3vw 3vw 0;
    > div {
      display: flex;
      align-items: center;
      span {
        display: inline-block;
        color: white;
        font-size: 15px;
        width: 36px;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 21px;
      }
    }
    img {
      opacity: 0.5;
      height: tvw(160);
      margin-right: tvw(90);
    }
    img.first {
      transform: scale(0.9);
    }
    img.second {
      transform: scale(0.7);
    }
  }
  .right-side {
    position: fixed;
    width: tvw(600);
    right: tvw(100);
    top: 33.2%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    img {
      width: tvw(260);
    }
  }
  .gif {
    position: fixed;
    top: 0;
    width: 100vw;
    height: 40vh;
    background-size: cover;
    background-repeat: no-repeat;
    z-index: -1;
    opacity: 0.5;
  }
}

@-webkit-keyframes flow {
  0% {
    top: 0;
  }
  100% {
    top: 40%;
  }
}

@-webkit-keyframes blow {
  0% {
    right: -100%;
  }
  100% {
    right: 100%;
  }
}

@-webkit-keyframes shine {
  0% {
    right: -100%;
  }
  100% {
    right: 100%;
  }
}

.index-container.wind {
  background-image: url("~@/assets/background.png");
  .gif {
    background-image: url("~@/assets/blow-wind.png");
    -webkit-animation: blow 15s infinite linear;
    top: 20%;
    height: 20vh;
  }
}
.index-container.hot {
  background: #ea9705;
  .gif {
    background-image: url("~@/assets/sunshine.png");
    -webkit-animation: shine 12s infinite linear;
    width: 150vw;
    height: 80vh;
    top: -42vh;
  }
}

.index-container.cold {
  background: #004696;
  .gif {
    background-image: url("~@/assets/flow-snow.png");
    -webkit-animation: flow 8s infinite linear;
  }
}

.index-container.off {
  background: grey;
}
</style>

