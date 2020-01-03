
<template>
  <div class="main-wrapper" v-show='pageIsShow' :class="{ active: isOpen === true }" :style="{ 'background-image': 'url(' + img + ')'}">
    <div class="header">
      <div class="return" @click="returnMethod"></div>
      <span class="edit" @click="intoSet"></span>
      <span>{{deviceName}}</span>
      <span class="time" v-if="1===2"></span>
    </div>
    <!-- <div class='header'>
      <img src='@/assets/arrow_left.png' @click='goBack()'>
      <span>{{deviceName}}</span>
      <img class='setting' @click='intoSet' src='@/assets/set.png'>
    </div> -->
    <!-- 基本信息 -->
    <div class="info">
      <img src="../../assets/map.png" style="width:12px;height:auto" />&nbsp;
      <span>{{location}}&nbsp;&nbsp;</span>
      <span>{{weather}} 温度{{getOuterTem}}℃&nbsp;&nbsp;</span>
      <span>湿度: {{getOuterHum}}%&nbsp;&nbsp;</span>
      <span>PM2.5: {{getOuterPM}}ug/m3&nbsp;&nbsp;</span>
    </div>

    <div class="mode-panel">
      <!-- <template v-if="formatItemsList[1] && formatItemsList[1].showStatus">
        <div class="card" v-for="(item, index) in getListData(formatItemsList[1].abilityId)" v-if="item.dirValue!=='4'" @click="switchMode(item.dirValue)">
          <div class="icon" :class="{active: item.isChecked , hot: item.optionValue === '1' , cold: item.dirValue === '2'}"></div>
          <p class="text" :class="{active: item.isChecked, hot: item.optionValue === '1' , cold: item.dirValue === '2'}">
            {{item.optionDefinedName}}
          </p>
        </div>
      </template> -->
      <div class="card" @click="switchMode(3)">
          <div class="icon" :class="{active: active1 , hot:hots1}"></div>
          <p class="text" :class="{active: active1, hot:hots}">
            采暖
          </p>
      </div>
      <div class="card" @click="switchMode(2)">
          <div class="icon" :class="{active: active2 , cold:colds1}"></div>
          <p class="text" :class="{active: active2, cold:colds}">
            制冷
          </p>
      </div>
      <div class="card" @click="onOffMethod" v-if="formatItemsList[0] && formatItemsList[0].showStatus">
        <div class="icon switch" :class="{active: isOpen}"></div>
        <p class="text switch" :class="{active: isOpen}">{{formatItemsList[0].showName}}</p>
      </div>
    </div>

    <div class="panel" style="margin:80px 0px">
      <div class="item">
        <div class="card-panel">
          <div class="card">
            <p class="desc">{{ modeSwitch}}设定 <span class="num" :class="currMode===coldMode ? 'hot' : currMode===hotMode ? 'cold' : ''">{{waterTemp}}°</span></p>
          </div>
        </div>
        <div class="block" v-if="currMode ==hotMode">
          <span class="min">16°</span>
          <el-slider class="water-slider1" :disabled="!isOpen" v-model="waterTemp" :min="16" :max="32" :show-tooltip="false" @change="handleChangeWaterSlider"></el-slider>
          <span class="max">32°</span>
        </div>
        <div class="block" v-else>
          <span class="min">35°</span>
          <el-slider class="water-slider1" :disabled="!isOpen" v-model="waterTemp" :min="35" :max="50" :show-tooltip="false" @change="handleChangeWaterSlider"></el-slider>
          <span class="max cold">50°</span>
        </div>
        <div class="card-panel" v-if="formatItemsList[4].abilityId && formatItemsList[4].showStatus">
          <div class="card">
            <p class="desc">测量温度 <span class="num">{{waterTempHSd}}°</span></p>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="panel" v-if='formatItemsList[3].abilityId && formatItemsList[3].showStatus'>
      <div class="title">
        <div class="icon hotwater">热水</div>
        <el-switch v-model="value2" :disabled="!isOpen" active-color="#2921ff" inactive-color="#2b2a63" :width="45">
        </el-switch>
      </div>
      <div class="item">
        <div class="card-panel">
          <div class="card">
            <p class="desc">设定 <span class="num hot">{{hotwater}}°</span></p>
          </div>
        </div>
        <div class="block">
          <span class="min">0°</span>
          <el-slider class="water-slider1" :disabled="!isOpen" v-model="hotwater" :min="0" :max="60" :show-tooltip="false" @change="handleChangeHotWaterSlider"></el-slider>
          <span class="max">60°</span>
        </div>
        <div class="card-panel">
          <div class="card">
            <p class="desc">当前 <span class="num">{{hotwater}}°</span></p>
          </div>
        </div>
      </div>
    </div> -->

    <div class="panel break" v-if='formatItemsList[6].abilityId && formatItemsList[6].showStatus'>
      <div class="title">
        <div class="icon break">状态</div>
        <div class="state" v-if="breakdownList.length===0"><i class="el-icon-success"></i>正常</div>
        <div class="state" v-else><i class="el-icon-warning"></i>预警</div>
      </div>
      <div class="item">
        <div class="list" v-if="breakdownList.length>0">
          <ul>
            <li v-for="item in breakdownList" :key="item.id">
              <span class="code">代码:&nbsp;{{item.code}}</span>
              <span class="line"></span>
              <span class="desc">描述:&nbsp;{{item.desc}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="panel break" v-else>
      <div class="title">
        <div class="icon break">状态</div>
        <div class="state">
          <div v-for="(item) in getListData(formatItemsList[7].abilityId)" :key="item.id">
            <span v-show="item.isSelect"><i class="el-icon-success"></i>{{item.optionName}}</span>
          </div>
          </div>
      </div>
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
      modeSwitch:'制热模式',
      colds:true,
      hots:true,
      colds1:true,
      hots1:true,
      active1:true,
      active2:true,
      shutdown: "", // 关机
      cloudyDay: img1, // 阴天
      sunnyDay: img4, // 晴天
      cloudyNight: img2, // 夜晚阴
      sunnyNight: img3, // 夜晚晴
      pageIsShow: false,
      img: img4,
      customerName: "",
      cHeight: 200,
      isOpen: true, // 开关
      modeCurrent: undefined,
      modeData: [],
      speedFlag: false,
      speedData: [],
      functionFlag: false,
      functionCurrent: null,
      functionData: [],
      formatItemsList: [],
      abilitysList: [],
      deviceName:'',
      location: "",
      weather: "", //天气
      outerTem: "", // 温度
      outerHum: "", // 湿度
      outerPm: "", // PM2.5
      deviceId: this.$route.query.deviceId,
      masterDeviceId: Store.fetch("masterDeviceId"),
      wxDeviceId: this.$route.query.wxDeviceId,
      customerId: this.$route.query.customerId,
      setInter: undefined, // 定时id
      dirValueList: [],
      batteryList3: "",
      setInter2: undefined,
      waterTemp: 0,
      hotwater: 0,
      currHotwater: 56,
      waterTempGS: 0,
      waterTempHSd:0,
      waterTempHS: 0,
      breakdownList: [],
      isLock: false, // 童锁
      currMode: '2',
      hotMode: '2',
      coldMode: '3',
      value2: false
    };
  },
  computed: {
    getOuterPM () {
      // 对应配置项被用作室内PM2.5，所以室外PM2.5直接返回第三方数据
      return this.outerPm;
      // 获取室外PM2.5数据，优先使用室外传感器数据
      if (!this.formatItemsList[2] || !this.formatItemsList[2].abilityId) {
        // 如果没有传感器功能项
        return this.outerPm;
      }
      const currData = this.getAbilityData(this.formatItemsList[2].abilityId);
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
      if (!this.formatItemsList[2] || !this.formatItemsList[2].abilityId) {
        if (!this.outerHum) {
          return 0;
        }
        return this.outerHum.replace("%", "");
      }
      const currData = this.getAbilityData(this.formatItemsList[2].abilityId);
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
      if (!this.formatItemsList[2] || !this.formatItemsList[2].abilityId) {
        if (!this.outerTem) {
          return 0;
        }
        return this.outerTem.replace("℃", "");
      }
      const currData = this.getAbilityData(this.formatItemsList[2].abilityId);
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
    handleChangeHotWaterSlider () {
      if (!this.isOpen) {
        this.$toast("当前关机状态，不可操作", "bottom");
        return false;
      }
    },
    handleChangeWaterSlider () {
      if (!this.isOpen) {
        this.$toast("当前关机状态，不可操作", "bottom");
        return false;
      }
      let tempArray = {}
      if (this.currMode == '2') {
        tempArray = this.abilitysList.find(item => item.abilityId == this.formatItemsList[3].abilityId);
        this.modeSwitch = tempArray.abilityName
      } else if (this.currMode == '3') {
        tempArray = this.abilitysList.find(item => item.abilityId == this.formatItemsList[2].abilityId);
        this.modeSwitch = tempArray.abilityName
      } else {
        return false;
      }
      
      sendFunc({
        deviceId: this.deviceId,
        funcId: tempArray.dirValue,
        value: this.waterTemp
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
            this.waterTemp
          );
        }
      });
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
    getListData (abilityId, which) {
      // 说明是风速的abilityId，那么特殊情况，特殊处理
      // if (which === "left") {
      //   return this.getListData(abilityId.split(",")[0]);
      // } else if (which === "right") {
      //   return this.getListData(abilityId.split(",")[1]);
      // } else if (which === "func") {
      //   return abilityId.split(",").map(id => {
      //     return this.getAbilityData(id);
      //   });
      // }

      // 根据功能id获取功能项的数据
      const result = this.abilitysList.filter(
        item => item.abilityId == abilityId
      )[0];
      console.log(result)
      return result && result.abilityOptionList;
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
    //   var tempArray
      const tempArray = this.abilitysList.filter(
        item => item.abilityId == this.formatItemsList[0].abilityId
      )[0];
      const tempList = tempArray.abilityOptionList;
      let index = 0;
      let tempd = tempArray.dirValue;
    //   let index = 0;
    //   if (this.isOpen) {
    //     // 找“关”的项
    //     index =1;
    //   } else {
    //     index =0;
    //   }
      if (this.isOpen) {
        // 找“关”的项
        index = tempList.findIndex(item => item.dirValue === "1");
        this.offopen(tempd, tempList[index].dirValue);
      } else {
        index = tempList.findIndex(item => item.dirValue === "0");
      }
      Loading.close();
      sendFunc({
        deviceId: this.deviceId,
        funcId: tempArray.dirValue,
        value: index
      }).then(res => {
        this.isOpen = !this.isOpen;
        Toast({
          mes: "指令发送成功",
          timeout: 1000,
          icon: "success"
        });
        console.info(
          "指令发送成功:",
          tempArray.dirValue,
          "-",
          index
        );
      });
    },
    offopen (DirValue, Dirindex) {
      sendFunc({
        deviceId: this.deviceId,
        funcId: DirValue,
        value: Dirindex,
      }).then(res => {
        console.info("指令发送成功:", "-", Dirindex);
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
          }, 3000);
        //   console.log(123)

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
      // console.log(ids)
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
          // console.log(realAbilityData)
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
          const tempArray1 = this.abilitysList.filter(
            item => item.abilityId == this.formatItemsList[1].abilityId
          )[0];
          console.log(tempArray1,221)
          if(tempArray1.abilityOptionList[0].isSelect == 1){
            // this.active1 = false
            this.hots = true
            this.active2 = true
          }else{
            this.hots = false
            this.active2 = false
          }
         const tempArray2 = this.abilitysList.filter(
            item => item.abilityId == this.formatItemsList[1].abilityId
          )[0];
          if(tempArray2.abilityOptionList[1].isSelect == 1){
            this.active1 = true
            this.colds = true
          }else{
            this.active1 = false
            this.colds = false
          }
        this.switchHandler();
        this.setPopDialogData();
      });
    },
    switchHandler () {
      // 开关机初始化
        // 开机
      const tempArray = this.abilitysList.filter(
        item => item.abilityId == this.formatItemsList[0].abilityId
      )[0].abilityOptionList;
        // 关机
    //   const tempArray1 = this.abilitysList.filter(
    //     item => item.abilityId == this.formatItemsList[1].abilityId
    //   )[0].abilityOptionList;
        // console.log(tempArray)
      // 找到关机的对象
      const tempObj = tempArray[0].optionValue == 0 ? tempArray[0] : tempArray[1];
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
        // 模式
        const data = this.abilitysList.find(item => item.abilityId == this.formatItemsList[1].abilityId);
        const tempArray = data.abilityOptionList
        let temp = {}
        tempArray.map(m => {
          if (data.currValue === m.dirValue) {
            this.currMode = m.dirValue
            console.log(this.currMode ,12311231)
            m.isChecked = true
          } else {
            m.isChecked = false
          }
          if (data.currValue === '3') {
            temp = this.abilitysList.find(item => item.abilityId == this.formatItemsList[2].abilityId);
            this.waterTemp = Number(temp.currValue)
          } else if (data.currValue === '2') {
            temp = this.abilitysList.find(item => item.abilityId == this.formatItemsList[3].abilityId);
            this.waterTemp = Number(temp.currValue)
          }
        })
      }

      // 更新故障
      // const updateBreakdown = () => {
      //   this.breakdownList = []
      //   const ids = this.formatItemsList[6] && this.formatItemsList[6].abilityId.split(",");
      //   ids.map(id => {
      //     let tempdata = this.abilitysList.find(item => item.abilityId == id);
      //     let tempArr = tempdata.abilityOptionList
      //     tempArr.map(arr => {
      //       // 故障
      //       if (arr.optionValue === '1' && arr.isSelect === '1') {
      //         this.breakdownList.push({
      //           code: tempdata.dirValue,
      //           desc: tempdata.abilityName
      //         })
      //       }
      //     })
      //   })
      // };

      const updateTemp = () => {
        // 供水温度
        // const data1 = this.abilitysList.find(item => item.abilityId == this.formatItemsList[4].abilityId);
        // 回水温度
        // const data2 = this.abilitysList.find(item => item.abilityId == this.formatItemsList[5].abilityId);
        const data3 = this.abilitysList.find(item => item.abilityId == this.formatItemsList[4].abilityId);
        // this.waterTempGS = data1.currValue / 10;
        // this.waterTempHS = data2.currValue / 10;
        this.waterTempHSd = data3.currValue / 10;

      };

      updateCurrData();
      // updateBreakdown();
      updateTemp();
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
    /**
     * 返回功能项的选项数据，
     * 如果是风速，和功能（多选），则特殊处理
     * @param which left 回风风速
     * @param which right 送风风速
     * @param which func 功能
     */
    // getListData (abilityId, which) {
    //   // 说明是风速的abilityId，那么特殊情况，特殊处理
    //   // if (which === "left") {
    //   //   return this.getListData(abilityId.split(",")[0]);
    //   // } else if (which === "right") {
    //   //   return this.getListData(abilityId.split(",")[1]);
    //   // } else if (which === "func") {
    //   //   return abilityId.split(",").map(id => {
    //   //     console.log(11)
    //   //     return this.getAbilityData(id);
    //   //   });
    //   // }
    //   // console.log(abilityId)
    //   // 根据功能id获取功能项的数据
    //   const result = this.abilitysList.filter(
    //     item => item.abilityId == abilityId
    //   )[0];
    //   console.log(result)
    //   return result && result.abilityOptionList;
    // },
    switchMode (index) {
      if (this.isOpen) {
        this.$toast("请先关机，再切换模式", "bottom");
        return false;
      }
      // 模式 1制冷 8 制热
      var tempArray,tempArray1
      if(index == 2){
        tempArray = this.abilitysList.filter(
          item => item.abilityId == this.formatItemsList[1].abilityId
        )[0];
        console.log(tempArray,221122)
        tempArray1 = tempArray.abilityOptionList[0]
        // if(tempArray.abilityOptionList[0].isSelect == 1){
          this.active1 = false
          this.hots = false
        // }else{
          this.active2 = true
          this.colds = true
        // }
        // console.log(tempArray)
      }else{
        tempArray = this.abilitysList.filter(
          item => item.abilityId == this.formatItemsList[1].abilityId
        )[0];
        // if(tempArray.abilityOptionList[0].isSelect == 1){
          this.active1 = true
          this.hots = true
        // }else{
          this.active2 = false
          this.colds = false
        // }
        tempArray1 = tempArray.abilityOptionList[1]
      }
      // var val
      const tempList = tempArray1;
      // for(var i = 0; i < tempList.length; i++){
      //   if(tempList[i].isSelect == 1){
      //     val = tempList[i].dirValue
      //     // console.log(val)
      //   }
      // }
      console.log(tempList)
      this.modeSwitch = tempList.optionDefinedName
      sendFunc({
        deviceId: this.deviceId,
        funcId: tempArray.dirValue,
        value: tempList.optionValue
      }).then(res => {
        if (res.code === 200) {
          this.currMode = index
          Toast({
            mes: "发送成功",
            timeout: 1000,
            icon: "success"
          });
          console.info(
            "指令发送成功:",
            tempArray.dirValue,
            "-",
            // val
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
  position: absolute;
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
      &:last-child{
        font-size: tvw(88);
        margin-top: 4px;
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
  .mode-panel {
    text-align: center;
    margin-top: tvw(375);
    display: flex;
    justify-content: space-around;
    align-items: center;
    .card {
      width: tvw(880);
      height: tvw(880);
      background: rgba(255, 255, 255, 0.13);
      font-size: tvw(120);
      border-radius: 10px;
      .icon {
        width: tvw(375);
        height: tvw(375);
        border: 1px solid #ffffff;
        border-radius: 100%;
        margin: tvw(120) auto;
        &.cold {
          background: url("../../assets/rebeng/zhileng.png") no-repeat center
            center;
          background-size: 48px 46px;
        }
        &.cold.active {
          border: 1px solid #2921ff;
          background: url("../../assets/rebeng/cold-active.png") no-repeat
            center center;
          background-size: 48px 46px;
        }
        &.hot {
          background: url("../../assets/rebeng/gongnuan.png") no-repeat center
            center;
          background-size: 48px 46px;
        }
        &.hot.active {
          border: 1px solid #ff8925;
          background: url("../../assets/rebeng/hot-avtive.png") no-repeat center
            center;
          background-size: 48px 46px;
        }
        &.switch {
          background: url("../../assets/rebeng/on-off.png") no-repeat center
            center;
          background-size: 48px 46px;
        }
        &.switch.active {
          border: 1px solid #20e645;
          background: url("../../assets/rebeng/on-off-open.png") no-repeat
            center center;
          background-size: 48px 46px;
        }
      }
      .text {
        &.cold.active {
          color: #2921ff;
        }
        &.hot.active {
          color: #ff8925;
        }
        &.switch.active {
          color: #20e645;
        }
      }
    }
  }
  .panel + .panel {
    border-top: 1px solid #eeeeee;
  }
  .panel {
    margin: tvw(142) tvw(142);
    &.break {
      padding-bottom: tvw(375);
    }
    .title {
      font-size: tvw(183);
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .icon {
        position: relative;
        &.hotwater::before {
          content: "";
          background: url("../../assets/rebeng/hot-water-active.png") no-repeat
            center center;
          background-size: 35px 28px;
          height: tvw(375);
          width: tvw(375);
          display: inline-block;
          vertical-align: -tvw(108);
        }
        &.break::before {
          content: "";
          background: url("../../assets/rebeng/state.png") no-repeat center
            center;
          background-size: 35px 28px;
          height: tvw(375);
          width: tvw(375);
          display: inline-block;
          vertical-align: -tvw(108);
        }
      }
      .state {
        font-weight: bold;
        i {
          margin-right: 5px;
        }
      }
    }
    .item {
      padding: tvw(80);
      .list {
        border-top: 1px solid #dfdfdf;
        & ul li {
          font-size: tvw(108);
          margin-top: tvw(166);
          .gray {
            color: #9a9a9a;
            &::before {
              display: inline-block;
              width: tvw(83);
              height: tvw(83);
              border-radius: 50%;
              background: #ffffff;
              content: "";
              margin-right: 5px;
            }
          }
          .line {
            border: 1px solid #dfdfdf;
            margin: 0 tvw(166);
          }
        }
      }
      .block {
        display: flex;
        align-items: center;
        font-size: tvw(116);
        font-weight: bold;
        .min {
          color: #2921ff;
          width: tvw(200);
        }
        .max {
          color: #ff3b21;
          width: tvw(266);
          text-align: right;
          &.cold {
            color: #06fbda;
          }
        }
      }
      .card-panel {
        display: flex;
        justify-content: space-around;
      }
      .card {
        display: inline-block;
        text-align: center;
        .num {
          font-size: tvw(183);
          &.hot {
            color: #ff8925;
          }
          &.cold {
            color: #2921ff;
          }
        }
        .desc {
          font-size: tvw(100);
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
}
</style>
<style rel="stylesheet/scss" lang="scss">
.water-slider1 {
  flex: 1;
  .el-slider__bar {
    background-color: unset;
  }
}
</style>