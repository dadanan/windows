<template>
  <div class="main-wrapper" v-show='pageIsShow' :class="{ active: isOpen == true }" @touchmove.prevent :style="{ 'background-image': 'url(' + img + ')'}">
    <div class="header">
      <span>{{ deviceName }}</span>
      <span class="edit" @click="intoSet"></span>
      <span class="time" v-if="1==2">{{ currentTime }}s</span>
    </div>
    <div class="info">
      <img src="../../assets/map.png" style="width:12px;height:auto" />&nbsp;
      <span v-show='formatItemsList[12] && formatItemsList[2].showStatus'>{{location}}&nbsp;</span>
      <span v-show='formatItemsList[13] && formatItemsList[13].showStatus'>{{weather}} {{getOuterTem}}℃&nbsp;</span>
      <span v-show='formatItemsList[14] && formatItemsList[14].showStatus'>湿度: {{getOuterHum}}%&nbsp;</span>
      <span v-show='formatItemsList[15] && formatItemsList[15].showStatus'>PM2.5: {{getOuterPM}}ug/m3&nbsp;</span>
      <span>质量: {{AQI}}</span>
    </div>
    <div class="but-list">
      <!-- 童锁 -->
      <div class="but-group" v-if='formatItemsList[10] && formatItemsList[10].showStatus'>
        <div class="icon suo" @click="childMethod"></div>
        <div class="text" @click="childMethod">{{formatItemsList[10].showName}}</div>
      </div>
      <div class="but-group" v-if="1==2">
        <div class="icon shop"></div>
        <div class="text">商城</div>
      </div>
      <!-- 开关 -->
      <div class="but-group" v-if='formatItemsList[11] && formatItemsList[11].showStatus'>
        <div class="icon close" :class="{ active:isOpen == true  }" @click="onOffMethod"></div>
        <div class="text" @click="onOffMethod">{{formatItemsList[11].showName}}</div>
      </div>
    </div>
    <div class="center">
      <div class="circle-data" :style="{ height:cHeight+'px' }">
        <div class="circle-inner">
          <p>
            PM2.5
            <span>{{AQI}}</span>
          </p>
          <p v-if='formatItemsList[16] &&  getAbilityData(formatItemsList[16].abilityId)' :class="{ active:  isOpen == true}">{{getAbilityData(formatItemsList[16].abilityId).currValue}}</p>
          <p></p>
          <p>ug/m3</p>
        </div>
      </div>
      <div class="temper">
        <div class="t1" v-if='formatItemsList[8] && formatItemsList[8].showStatus'>
          <p>
            <span>{{getAbilityData(formatItemsList[8].abilityId).currValue}}</span>℃</p>
          <p>
            <!-- 温度 -->
            <span style="font-size:16px">{{formatItemsList[8].showName}}</span>
          </p>
        </div>
        <div class="t2" v-if='formatItemsList[9] && formatItemsList[9].showStatus'>
          <p>
            <span>{{getAbilityData(formatItemsList[9].abilityId).currValue}}</span>%</p>
          <p>
            <!-- 湿度 -->
            <span style="font-size:16px">{{formatItemsList[9].showName}}</span>
          </p>
        </div>
      </div>
      <div class="tip" v-show='formatItemsList[7] && formatItemsList[7].showStatus'>
        <p>滤芯剩余寿命 {{batteryList3}} 时</p>
        <p v-if="1==2">设备租赁剩余时间 2 时</p>
      </div>
      <div class="b-data">
        <!-- CO2 -->
        <span v-if='formatItemsList[4] && formatItemsList[4].showStatus'>{{formatItemsList[4].showName}}
          <em>{{getAbilityData(formatItemsList[4].abilityId).currValue}}</em> PPM</span>
        <!-- TVOC -->
        <span v-if='formatItemsList[5] && formatItemsList[5].showStatus'>{{formatItemsList[5].showName}}
          <em>{{Number(getAbilityData(formatItemsList[5].abilityId).currValue) / 100}}</em> mg/m³</span>
        <span v-if='formatItemsList[6] && formatItemsList[6].showStatus'>{{formatItemsList[6].showName}}
          <!-- 甲醛 -->
          <em>{{Number(getAbilityData(formatItemsList[6].abilityId).currValue) / 100}}</em> mg/m³</span>
      </div>
    </div>
    <div class="but-list fixed">
      <div class="but-group" @click="intiTime" v-if='formatItemsList[0] && formatItemsList[0].showStatus'>
        <div class="icon time"></div>
        <!-- 定时 -->
        <div class="text">{{formatItemsList[0].showName}}</div>
      </div>
      <div class="but-group" @click="switchModel(formatItemsList[1].abilityId)" v-if='formatItemsList[1] && formatItemsList[1].showStatus'>
        <div class="icon model"></div>
        <!-- 模式 -->
        <div class="text">{{formatItemsList[1].showName}}</div>
      </div>
      <div class="but-group" @click="switchSpeed(formatItemsList[2].abilityId)" v-if='formatItemsList[2] && formatItemsList[2].showStatus'>
        <div class="icon shan"></div>
        <!-- 风速 -->
        <div class="text">{{formatItemsList[2].showName}}</div>
      </div>
      <div class="but-group" @click="switchFunction(formatItemsList[3].abilityId)" v-if='formatItemsList[3] && formatItemsList[3].showStatus'>
        <div class="icon menu"></div>
        <!-- 功能 -->
        <div class="text">{{formatItemsList[3].showName}}</div>
      </div>
    </div>
    <yd-popup v-model="modeFlag" position="bottom" width="90%">
      <div class="content">
        <div class="title">模式设定</div>
        <div class="list">
          <ul v-if='formatItemsList[1] && formatItemsList[1].abilityId'>
            <li v-if='item.status !== 2' v-for="(item,index) in getListData(formatItemsList[1].abilityId)" :class="{ active: modeCurrent == index }" @click="nodeClicked(getAbilityData(formatItemsList[1].abilityId),index,1)" :key='item.optionValue'>
              <span>{{ item.optionDefinedName || item.optionName }}</span>
              <div class="icon"></div>
            </li>
          </ul>
        </div>
      </div>
    </yd-popup>

    <!-- 单风机风速 -->
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
    <yd-popup v-model="functionFlag" position="bottom" width="90%">
      <div class="content">
        <div class="title">其它功能设定</div>
        <div class="list">
          <ul v-if='formatItemsList[3] && formatItemsList[3].abilityId'>
            <li v-if='item.status !== 2' v-for="item in getListData(formatItemsList[3].abilityId,'func')" :class="{ active: item.isChecked}" @click="nodeClicked(item,'',3)" :key='item.abilityId'>
              <span>{{ item.definedName || item.abilityName }}</span>
              <div class="icon"></div>
            </li>
          </ul>
        </div>
      </div>
    </yd-popup>
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
import { debug ,log } from "@/utils/log";

import { Popup } from "vue-ydui/dist/lib.rem/popup";
import { setWechatTitle } from "utils";
import img1 from "../../assets/bak3.jpg"; // 白天阴
import img2 from "../../assets/bak2.jpg"; // 夜晚阴
import img3 from "../../assets/bak1.jpg"; // 夜晚晴
import img4 from "../../assets/bak4.jpg"; // 白天晴
import Store from "../wenkong/store";
import {
  getModelVo,
  newQueryDetailByDeviceId,
  getLocation,
  getWeather,
  sendFunc,
  getStrainerData
} from "../wenkong/api";

export default {
  data() {
    return {
      shutdown: "", // 关机
      cloudyDay: img1, // 阴天
      sunnyDay: img4, // 晴天
      cloudyNight: img2, // 夜晚阴
      sunnyNight: img3, // 夜晚晴
      specIndex: 0,
      pageIsShow: false,
      windVisible: false,
      img: img4,
      windData: {},
      currentTime: 2,
      timeSet: null,
      deviceName: "",
      customerName: "",
      cHeight: 200,
      isOpen: true, // 开关
      isLock: false, // 童锁
      isSleep: false, // 睡眠
      modeFlag: false, // 模式设置
      deviceObj: {},
      modeCurrent: undefined,
      currentOptionForWind: undefined,
      currentSpeedIndexLabel: "",
      currentSpeed: 0,
      modeData: [],
      speedData: [],
      functionFlag: false,
      functionCurrent: null,
      functionData: [],
      formatItemsList: [],
      abilitysList: [],
      location: "",
      weather: "",
      outerTem: "",
      outerHum: "", // 湿度
      outerPm: "", // PM2.5
      deviceId: this.$route.query.deviceId,
      wxDeviceId: this.$route.query.wxDeviceId,
      customerId: this.$route.query.customerId,
      setInter: undefined, // 定时id
      batteryList1: [],
      dirValueList: [],
      batteryList3: "",
      setInter2: undefined,
      AQI: "优"
    };
  },
  computed: {
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
          return "";
        }
        return this.outerHum.replace("%", "");
      }
      const currData = this.getAbilityData(this.formatItemsList[14].abilityId);
      if (!currData) {
        if (!this.outerHum) {
          return "";
        }
        return this.outerHum.replace("%", "");
      }
      const currValue = currData.currValue;

      if (currValue && currValue !== "0") {
        return currValue;
      }
      if (!this.outerHum) {
        return "";
      }
      return this.outerHum.replace("%", "");
    },
    getOuterTem() {
      // 室外温度
      if (!this.formatItemsList[13] || !this.formatItemsList[13].abilityId) {
        if (!this.outerTem) {
          return "";
        }
        return this.outerTem.replace("℃", "");
      }
      const currData = this.getAbilityData(this.formatItemsList[13].abilityId);
      if (!currData) {
        if (!this.outerTem) {
          return "";
        }
        return this.outerTem.replace("℃", "");
      }
      const currValue = currData.currValue;

      if (currValue && currValue !== "0") {
        return currValue;
      }
      if (!this.outerTem) {
        return "";
      }
      return this.outerTem.replace("℃", "");
    },
    speedName() {
      const name = "送风风速";
      if (!this.formatItemsList[2] || !this.formatItemsList[2].abilityId) {
        return name;
      }
      const data = this.getAbilityData(this.formatItemsList[2].abilityId);
      if (!data) {
        return name;
      }
      return data.definedName || data.abilityName;
    }
  },
  methods: {
    sliderChanged(val) {
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
    leftStep() {
      if (!this.formatItemsList[2] || !this.formatItemsList[2].abilityId) {
        return 25;
      }
      return (
        100 / (this.getListData(this.formatItemsList[2].abilityId).length - 1)
      );
    },
    changeSleepStatus() {
      this.isSleep = false;
      sendFunc({
        deviceId: this.deviceId,
        funcId: "210",
        value: "3"
      }).then(() => {
        Toast({
          mes: "指令发送成功！",
          timeout: 1000,
          icon: "success"
        });
        console.info("指令发送成功:", "210", "-", "3");
      });
    },
    getAbilityByDirValue(dirValue) {
      // 根据指令值找对应的功能项数据，双风机风速用到
      return this.abilitysList.filter(item => item.dirValue == dirValue)[0];
    },
    /**
     * 返回功能项的选项数据，
     * 如果是 功能（多选），则特殊处理
     * @param which func 功能
     */
    getListData(abilityId, which) {
      // 根据功能id获取功能项的数据
      if (which === "func") {
        return abilityId.split(",").map(id => {
          return this.getAbilityData(id);
        });
      }

      const result = this.abilitysList.filter(
        item => item.abilityId == abilityId
      )[0];

      return result && result.abilityOptionList;
    },
    /**
     * @param which left/right 表示内风机/外风机
     */
    getAbilityData(abilityId, which) {
      if (which == "left") {
        return this.abilitysList.filter(item => item.dirValue == "280")[0];
      }
      if (which == "right") {
        return this.abilitysList.filter(item => item.dirValue == "281")[0];
      }
      const result = this.abilitysList.filter(
        item => item.abilityId == abilityId
      )[0];
      return result;
    },
    intiTime() {
      if (!this.isOpen) {
        this.$toast("当前关机状态，不可操作", "bottom");
        return false;
      }
      this.$router.push({
        path: "/timinglist",
        query: {
          deviceId: this.deviceId,
          wxDeviceId: this.wxDeviceId,
          customerId: this.customerId
        }
      });
    },
    setModelData(index, id) {
      const data = this.abilitysList.filter(item => item.abilityId == id)[0];
      if (!data) {
        return;
      }

      // 如何用户点击的是“模式”
      index == 1 ? (this.modelData = data) : (this.windData = data);

      // 根据isSelect的值，对相应选项执行默认选中行为
      data.abilityOptionList.forEach((item, iIndex) => {
        if (item.isSelect == 0) {
          return;
        }

        // “模式”
        if (index == 1) {
          this.currentOption = iIndex;
          return;
        }
        this.currentOptionForWind = iIndex;
      });
    },
    setPopDialogData() {
      // 实时设置下方模式、风速，功能等弹框内的数据
      // 为了解决：弹框打开的情况下，设备状态变化时，弹框内选项数据却没有变更的问题。

      // 更新模式选项
      const updateModel = () => {
        const data = this.abilitysList.filter(
          item => item.abilityId == this.formatItemsList[1].abilityId
        )[0];
        if (!data) {
          return;
        }

        // 根据isSelect的值，对相应选项执行默认选中行为
        data.abilityOptionList.forEach((item, iIndex) => {
          if (item.isSelect == 0) {
            return;
          }

          // “模式选项”
          this.modeCurrent = iIndex;

          // 如果当前选中对模式是睡眠，那么开启睡眠弹框
          if (item.optionValue == "2") {
            this.isSleep = true;
          } else {
            this.isSleep = false;
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

      // 功能多选项的初始化
      const updateAbility = () => {
        const data = this.getListData(
          this.formatItemsList[3].abilityId,
          "func"
        );
        data.forEach(ability => {
          const options = ability.abilityOptionList;
          if (!options) {
            return;
          }

          const isChecked = options.some(option => {
            return option.optionValue == "1" && option.isSelect == 1;
          });

          this.$set(ability, "isChecked", isChecked);
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
    modelClicked(index, data) {
      this.currentOptionForWind = index;
      this.sendFunc2(index, data);
    },
    sendFunc2(index, data) {
      // 发送指令
      sendFunc({
        deviceId: this.deviceId,
        funcId: data.dirValue,
        value: data.abilityOptionList[index].dirValue
      }).then(res => {
        console.info(
          "指令发送成功:",
          data.dirValue,
          "-",
          data.abilityOptionList[index].dirValue
        );
        Toast({
          mes: "指令发送成功！",
          timeout: 1000,
          icon: "success"
        });
      });
    },
    switchModel(id) {
      if (!this.isOpen) {
        this.$toast("当前关机状态，不可操作", "bottom");
        return false;
      }
      this.modeFlag = true;
    },
    switchSpeed(id) {
      if (!this.isOpen) {
        this.$toast("当前关机状态，不可操作", "bottom");
        return false;
      }
      this.setModelData(2, id);
      this.windVisible = true;
    },
    switchFunction() {
      if (!this.isOpen) {
        this.$toast("当前关机状态，不可操作", "bottom");
        return false;
      }

      this.functionFlag = true;
    },
    intoSet() {
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
    hasTwoAbility() {
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
    childMethod(type) {
      if (!this.isOpen && type) {
        this.$toast("当前关机状态，不可操作", "bottom");
        return false;
      }

      // 童锁开关
      const tempArray = this.abilitysList.filter(
        item => item.abilityId == this.formatItemsList[10].abilityId
      )[0];
      const tempList = tempArray.abilityOptionList;
      let index = 0;
      if (this.isLock) {
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
        item => item.abilityId == this.formatItemsList[11].abilityId
      )[0];
      const tempList = tempArray.abilityOptionList;
      let index = 0;
      let tempd = tempArray.dirValue;
      if (this.isOpen) {
        // 找“关”的项
        index = tempList.findIndex(item => item.dirValue == "0");
        this.offopen(tempd, tempList[index].dirValue);
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
    offopen(DirValue, Dirindex) {
      sendFunc({
        deviceId: this.deviceId,
        funcId: DirValue,
        value: Dirindex
      }).then(res => {
        console.info("指令发送成功:", "-", Dirindex);
      });
    },
    nodeClicked(item, index, type) {
      // 如果是功能，index表示将要发送的指令value： 0/1 不选中/选中
      if (type == 3) {
        index = item.isChecked ? 0 : 1;
      }

      // 如果当前指令是外风机的，判断是否循环阀是否打开，没有的话。禁止发送指令
      const modelData = this.getListData(
        this.formatItemsList[3].abilityId,
        "func"
      );
      const circleSwitch = modelData.filter(item => item.dirValue == "290")[0];

      if (item.dirValue == "281" && circleSwitch.isSelect == 0) {
        Toast({
          mes: "循环阀未打开，禁止操作外风机",
          timeout: 1000,
          icon: "error"
        });
        return;
      }
      this.sendFunc(item, index, type);
    },
    sendFunc(item, index, type) {
      // 模式、风速、功能的指令发送函数
      // Loading.open('发送中...')
      sendFunc({
        deviceId: this.deviceId,
        funcId: item.dirValue,
        value: type == 3 ? index : item.abilityOptionList[index].optionValue
      })
        .then(res => {
          if (res.code == 200) {
            // Loading.close()
            if (type == 1) {
              this.modeCurrent = index;
            } else if (type == 2) {
              this.currentOptionForWind = index;
            } else if (type == 3) {
              item.isChecked = !item.isChecked;
            }
            Toast({
              mes: "发送成功",
              timeout: 1000,
              icon: "success"
            });
            console.info(
              "指令发送成功:",
              item.dirValue,
              "-",
              type == 3 ? index : item.abilityOptionList[index].optionValue
            );
          }
        })
        .catch(error => {
          Loading.close();
        });
    },
    getIndexAbilityData() {
      // 获取H5控制页面功能项数据，带isSelect参数

      getModelVo({ deviceId: this.deviceId, pageNo: 1 }).then(res => {
        if (res.code == 200 && res.data) {
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
          //滤网检查
          const windOption1 = data.abilitysList;
          for (var i = 0; i < windOption1.length; i++) {
            if (windOption1[i].dirValue == "-1") {
              this.batteryList1 = windOption1[i].abilityOptionList;
              this.getStrainerData();
            }
          }

          this.setInter2 = setInterval(() => {
            this.getWeather();
          }, 2000);

          // 显示页面内容
          this.pageIsShow = true;
        }
      });
    },
    getStrainerData() {
      for (var i = 0; i < this.batteryList1.length; i++) {
        this.dirValueList.push(this.batteryList1[i].optionValue);
      }
      getStrainerData({
        deviceId: this.$route.query.deviceId,
        dirValueList: this.dirValueList
      })
        .then(res => {
          if (res.code == 200 && res.data) {
            var s = this.batteryList1[0].optionValue;
            var d = res.data[s];
            this.batteryList3 = d;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getIndexFormatData(list) {
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
        // console.log(data)
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
            item.abilityOptionList.length == 0 ||
            item.abilityType == 1
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
        // 获取列表最后一项：空气质量，的值
        const lastItem = data[data.length - 1];
        if (lastItem.abilityName == "空气质量") {
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
        item => item.abilityId == this.formatItemsList[11].abilityId
      )[0].abilityOptionList;

      // 找到关机的对象
      const tempObj = tempArray[0].dirValue == 0 ? tempArray[0] : tempArray[1];
      if (tempObj.isSelect == 1) {
        // 说明是关机
        this.isOpen = false;
      } else {
        this.isOpen = true;
      }

      // 童锁初始化
      const tempArray2 = this.abilitysList.filter(
        item => item.abilityId == this.formatItemsList[10].abilityId
      )[0].abilityOptionList;

      const tempObj2 =
        tempArray2[0].dirValue == 0 ? tempArray2[0] : tempArray2[1];
      if (tempObj2.isSelect == 1) {
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
}
</style>

