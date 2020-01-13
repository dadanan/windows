<template>
  <div class="main-wrapper" v-show='pageIsShow' :class="{ active: isOpen === true }" @touchmove.prevent :style="{ 'background-image': 'url(' + img + ')'}">
    <div class="header">
      <div class="return" @click="returnMethod"></div>
      <span class="edit" @click="intoSet"></span>
      <span>{{deviceName}}</span>
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

    <div class='switch'>
      <div v-show='formatItemsList[0] && formatItemsList[0].showStatus' @click='onOffMethod'>
        <div class="icon" :class="isOpen ? 'on-off-open' : 'on-off'"></div>
        <!-- <p>{{formatItemsList[0] && formatItemsList[0].showName}}</p> -->
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="footer fixed">
      <div class="but-list" v-if="formatItemsList[12].abilityId && formatItemsList[12].showStatus">
        <div class="but-group" @click="showWater">
          <div class="icon water-temp"></div>
          <!-- 水温 -->
          <div class="text">水温</div>
        </div>
        <div class="but-group" @click="showBreakdown"  v-if="breakdownList.length===0">
          <div class="icon successs"></div>
          <!-- 故障 -->
          <div class="text">正常</div>
        </div>
        <div class="but-group" @click="showBreakdown" v-else>
          <div class="icon breakdown"></div>
          <!-- 故障 -->
          <div class="text">故障</div>
        </div>
        
        <div class="but-group" @click="showHotWater" v-if="formatItemsList[12].abilityId && formatItemsList[12].showStatus">
          <div class="icon hot-water"></div>
          <!-- 热水 -->
          <div class="text">热水</div>
        </div>
        <div class="but-group" @click="switchMode('1')" v-if="currMode ==='8'">
          <div class="icon zhileng"  ></div>
          <div class="text">制冷</div>
        </div>
        <div class="but-group" @click="switchMode('8')" v-if="currMode ==='1'">
          <div class="icon gongnuan"></div>
          <div class="text">供暖</div>
        </div>
      </div>

      <div class="but-list" v-else>
        <div class="but-group" @click="showWater">
          <div class="icon water-temp"></div>
          <!-- 水温 -->
          <div class="text">水温</div>
        </div>
        <div class="but-group" @click="showBreakdown"  v-if="breakdownList.length===0">
          <div class="icon successs"></div>
          <!-- 故障 -->
          <div class="text">正常</div>
        </div>
        <div class="but-group" @click="showBreakdown" v-else>
          <div class="icon breakdown"></div>
          <!-- 故障 -->
          <div class="text">故障</div>
        </div>
        
        <div class="but-group" @click="showHotWater" v-if="formatItemsList[12].abilityId && formatItemsList[12].showStatus">
          <div class="icon hot-water"></div>
          <!-- 热水 -->
          <div class="text">热水</div>
        </div>
        <div class="but-group" @click="switchMode('1')" >
          <div class="icon " :class="currMode ==='1'? 'zhileng1':'zhileng'"></div>
          <div class="text">制冷</div>
        </div>
        <div class="but-group" @click="switchMode('8')">
          <div class="icon " :class="currMode ==='8'? 'gongnuan1':'gongnuan'"></div>
          <div class="text">供暖</div>
        </div>
      </div>
    </div>

    <!-- 故障 -->
    <yd-popup v-model="breakdownFlag" position="bottom" width="90%">
      <div class="content">
        <div class="icon">
          <div class="breakdown"></div>
        </div>
        <div class="item">
          <div class="title">
            故障状态
            <div class="state success" v-if="breakdownList.length===0">正常</div>
            <div class="state error" v-else>故障</div>
          </div>
          <div class="list" v-if="breakdownList.length>0">
            <ul>
              <li v-for="item in breakdownList">
                <span class="code"><span class="gray">代码:&nbsp;</span>{{item.code}}</span>
                <span class="line"></span>
                <span class="desc"><span class="gray">描述:&nbsp;</span>{{item.desc}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </yd-popup>

    <!-- 热水 -->
    <yd-popup v-model="hotWaterFlag" position="bottom" width="90%">
      <div class="content hotwater">
        <div class="icon">
          <div class="on-off"></div>
          <p class="desc">开关机</p>
        </div>
        <div class="item">
          <div class="card-panel">
            <div class="card">
              <p class="num">{{hotwater}}°</p>
              <p class="desc">设定</p>
            </div>
          </div>
          <div class="block">
            <span class="min">0°</span>
            <el-slider class="water-slider" v-model="hotwater" :min="0" :max="60" :show-tooltip="false" @change="handleChangeHotWaterSlider"></el-slider>
            <span class="max">60°</span>
          </div>
          <div class="card-panel">
            <div class="card">
              <p class="num">{{currHotwater}}°</p>
              <p class="desc">水温</p>
            </div>
          </div>
        </div>
      </div>
    </yd-popup>
    <yd-popup v-model="functionFlag" position="bottom" width="90%">
      <div class="content">
        <div class="title">功能设定</div>
        <div class="list">
          <ul v-if='formatItemsList[9] && formatItemsList[9].abilityId'>
            <li v-if='item && item.status !== 2' v-for="item in getListData(formatItemsList[9].abilityId,'func')" :class="{ active: item.isChecked}" @click="nodeClicked(item,'',3)" :key='item.abilityId'>
              <span>{{ item.definedName || item.abilityName }}</span>
              <div class="icon"></div>
            </li>
          </ul>
        </div>
      </div>
    </yd-popup>
    <!-- 水温 -->
    <yd-popup v-model="waterTempFlag" position="bottom" width="90%">
      <div class="content">
        <div class="item">
          <div class="card-panel">
            <div class="card">
              <p class="num">{{waterTemp}}°</p>
              <p class="desc">设定回水温度</p>
            </div>
          </div>
          <div class="block" v-if="currMode == 1">
            <span class="min">8°</span>
            <el-slider class="water-slider" v-model="waterTemp" :min="8" :max="25" :show-tooltip="false" @change="handleChangeWaterSlider"></el-slider>
            <span class="max">25°</span>
          </div>
          <div class="block" v-if="currMode == 8">
            <span class="min">25°</span>
            <el-slider class="water-slider" v-model="waterTemp" :min="25" :max="50" :show-tooltip="false" @change="handleChangeWaterSlider"></el-slider>
            <span class="max">50°</span>
          </div>
          <div class="card-panel">
            <div class="card">
              <p class="num">{{waterTemp2}}°</p>
              <p class="desc">用测回水</p>
            </div>
            <div class="card">
              <p class="num">{{waterTemp1}}°</p>
              <p class="desc">源侧供水</p>
            </div>
            
          </div>
        </div>
      </div>
    </yd-popup>

  </div>
</template>

<script type="text/ecmascript-6">
import { Loading, Toast } from "vue-ydui/dist/lib.rem/dialog";
import { Popup } from "vue-ydui/dist/lib.rem/popup";
import { setWechatTitle } from "utils";
// import img1 from "../../assets/bak3.jpg"; // 白天阴
// import img2 from "../../assets/bak2.jpg"; // 夜晚阴
// import img3 from "../../assets/bak1.jpg"; // 夜晚晴
import img1 from "../../assets/rebeng/bak4.jpeg"; // 白天阴
import img2 from "../../assets/rebeng/bak4.jpeg"; // 夜晚阴
import img3 from "../../assets/rebeng/bak4.jpeg"; // 夜晚晴
import img4 from "../../assets/rebeng/bak4.jpeg"; // 白天晴
import Store from "../wenkong/store.js";
import {
  getModelVo,
  newQueryDetailByDeviceId,
  getLocation,
  getWeather,
  sendFunc,
  getFuncResult
} from "../wenkong/api.js";

let prevValues = '' //当一次用户选择的picker组件的第二个值，来判断。只有此值变化，才调用指令接口
let currValues = '' // 当前用户所在的左侧滑杆的值

export default {
  data () {
    return {
      shutdown: img1, // 关机
      cloudyDay: img1, // 阴天
      sunnyDay: img4, // 晴天
      cloudyNight: img2, // 夜晚阴
      sunnyNight: img3, // 夜晚晴
      pageIsShow: false,
      img: img4,
      functionFlag:false,
      customerName: "",
      cHeight: 200,
      isOpen: true, // 开关
      modeCurrent: undefined,
      modeData: [],
      speedFlag: false,
      speedData: [],
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
      breakdownFlag: false,
      hotWaterFlag: false,
      waterTempFlag: false,
      waterTemp: 36,
      hotwater: 30,
      currHotwater: 46,
      waterTemp1: 0,
      waterTemp2: 0,
      breakdownList: [],
      currMode: '1'
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
    guid2 (){
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4());
    },
    getFuncResult(val){
          Toast({
            mes: "设备操作成功",
            timeout: 1000,
            icon: "success"
          });
      // getFuncResult({value:val}).then(res=>{
      //   if(res.data == "ok"){
      //     Toast({
      //       mes: "设备操作成功",
      //       timeout: 1000,
      //       icon: "success"
      //     });
      //   }else{
      //     Toast({
      //       mes: "设备操作失败",
      //       timeout: 1000,
      //       icon: "success"
      //     });
      //   }
      // })
    },
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
    switchFunction () {
      if (!this.isOpen) {
        this.$toast("当前关机状态，不可操作", "bottom");
        return false;
      }

      this.functionFlag = true;
    },
    returnMethod () {
      this.$router.back(-1);
    },
    handleChangeHotWaterSlider () {
    },
    handleChangeWaterSlider () {
      let tempArray = {};
      if (this.currMode == '1') {
        tempArray = this.abilitysList.find(item => item.abilityId == this.formatItemsList[5].abilityId);
      } else if (this.currMode == '8') {
        tempArray = this.abilitysList.find(item => item.abilityId == this.formatItemsList[6].abilityId);
      }

      if (JSON.stringify(tempArray) === '{}') {
        return false;
      }
      var uuid = this.guid2()
      sendFunc({
        deviceId: this.deviceId,
        funcId: tempArray.dirValue,
        value: this.waterTemp,
        funcNo:uuid
      }).then(res => {
        if (res.code === 200) {
          this.getFuncResult(uuid)
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
        index = tempList.findIndex(item => item.optionValue === "0");
      } else {
        index = tempList.findIndex(item => item.optionValue === "1");
      }
      Loading.close();
      var uuid = this.guid2()
      sendFunc({
        deviceId: this.deviceId,
        funcId: tempArray.dirValue,
        value: tempList[index].dirValue,
        funcNo:uuid
      }).then(res => {
        this.getFuncResult(uuid)
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
          }, 3000);

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
        const data = this.abilitysList.find(item => item.abilityId == this.formatItemsList[9].abilityId);
        for(var i = 0; i < data.abilityOptionList.length;i++){
          if(data.abilityOptionList[i].isSelect == 1){
            this.currMode = data.abilityOptionList[i].dirValue
          }
        }
        // this.currMode = data.currValue;
        let tempArray = {};
        if (this.currMode == '1') {
          tempArray = this.abilitysList.find(item => item.abilityId == this.formatItemsList[5].abilityId);
        } else if (this.currMode == '8') {
          tempArray = this.abilitysList.find(item => item.abilityId == this.formatItemsList[6].abilityId);
        }
        this.waterTemp = Number(tempArray.currValue)
      }

      // 更新故障
      const updateBreakdown = () => {
        this.breakdownList = []
        // 空调水流故障
        const data1 = this.abilitysList.find(item => item.abilityId == this.formatItemsList[1].abilityId);
        // 冷却水流故障
        const data2 = this.abilitysList.find(item => item.abilityId == this.formatItemsList[2].abilityId);
        // 出水低温告警
        const data3 = this.abilitysList.find(item => item.abilityId == this.formatItemsList[3].abilityId);
        // 出水高温告警
        const data4 = this.abilitysList.find(item => item.abilityId == this.formatItemsList[4].abilityId);

        const tempArray1 = data1.abilityOptionList;
        const tempArray2 = data2.abilityOptionList;
        const tempArray3 = data3.abilityOptionList;
        const tempArray4 = data4.abilityOptionList;
        // 根据isSelect的值，对相应选项执行默认选中行为
        // 找到空调水流故障的对象
        const tempObj1 = tempArray1[0].dirValue == 0 ? tempArray1[0] : tempArray1[1];
        const tempObj2 = tempArray2[0].dirValue == 0 ? tempArray2[0] : tempArray2[1];
        const tempObj3 = tempArray3[0].dirValue == 0 ? tempArray3[0] : tempArray3[1];
        const tempObj4 = tempArray4[0].dirValue == 0 ? tempArray4[0] : tempArray4[1];
        if (tempObj1.isSelect === 0) {
          // 故障
          this.breakdownList.push({
            code: data1.dirValue,
            desc: data1.abilityName
          })
        }
        if (tempObj2.isSelect === 0) {
          // 故障
          this.breakdownList.push({
            code: data2.dirValue,
            desc: data2.abilityName
          })
        }
        if (tempObj3.isSelect === 0) {
          // 故障
          this.breakdownList.push({
            code: data3.dirValue,
            desc: data3.abilityName
          })
        }
        if (tempObj4.isSelect === 0) {
          // 故障
          this.breakdownList.push({
            code: data4.dirValue,
            desc: data4.abilityName
          })
        }
      };

      const updateTemp = () => {
        // 供水温度
        const data1 = this.abilitysList.find(item => item.abilityId == this.formatItemsList[7].abilityId);
        // 回水温度
        const data2 = this.abilitysList.find(item => item.abilityId == this.formatItemsList[8].abilityId);
        this.waterTemp1 = data1.currValue;
        this.waterTemp2 = data2.currValue;
      };

      updateCurrData();
      updateBreakdown();
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
        this.shutdown = bgImgs[1];
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
    showBreakdown (id) {
      if (!this.isOpen) {
        this.$toast("当前关机状态，不可操作", "bottom");
        return false;
      }
      this.breakdownFlag = true;
    },
    showWater () {
      if (!this.isOpen) {
        this.$toast("当前关机状态，不可操作", "bottom");
        return false;
      }
      this.waterTempFlag = true
    },
    showHotWater () {
      if (!this.isOpen) {
        this.$toast("当前关机状态，不可操作", "bottom");
        return false;
      }
      this.hotWaterFlag = true
      this.$nextTick(() => {
        this.handleChangeHotWaterSlider()
      })
    },
    switchMode (index) {
      if (!this.isOpen) {
        this.$toast("当前关机状态，不可操作", "bottom");
        return false;
      }
      // 模式 1制冷 8 制热
      console.log(index)
      const tempArray = this.abilitysList.filter(
        item => item.abilityId == this.formatItemsList[9].abilityId
      )[0];
      const tempList = tempArray.abilityOptionList;
      sendFunc({
        deviceId: this.deviceId,
        funcId: tempArray.dirValue,
        value: index
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
    this.customerName = Store.fetch("customerName");
    setWechatTitle(this.customerName, "");
    this.deviceName = Store.fetch("deviceName");
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
  width: 100vw;
  height: 100vh;
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
        font-size: tvw(85);
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
  .content {
    padding: tvw(166) tvw(125) tvw(250) tvw(125);
    color: #000000;
    background: #ffffff;
    display: flex;
    align-items: flex-start;
    &.hotwater {
      align-items: center;
    }
    .icon {
      width: tvw(333);
      height: tvw(333);
      margin-right: tvw(83);
      box-sizing: content-box;
      .breakdown {
        background: url("../../assets/rebeng/breakdown-icon.png") no-repeat
          center center;
        background-size: 35px 35px;
        width: tvw(291);
        height: tvw(291);
      }
      .on-off {
        background: url("../../assets/rebeng/on-off-black.png") no-repeat center
          center;
        background-size: 35px 35px;
        width: tvw(291);
        height: tvw(291);
        border: 1px solid #333333;
        border-radius: 100%;
      }
      .desc {
        margin-top: tvw(42);
        font-size: tvw(92);
        color: #333333;
      }
    }
    .item {
      flex: 1;
      width: 100%;
      position: relative;
      margin-bottom: tvw(375);
      .title {
        font-size: tvw(183);
        position: relative;
        height: tvw(291);
        line-height: tvw(291);
        margin-bottom: tvw(166);
        .state {
          float: right;
          font-weight: bold;
          &::before {
            position: absolute;
            content: "";
            width: tvw(250);
            height: tvw(250);
            right: tvw(375);
            top: 1px;
          }
          &.success {
            color: #00be8b;
            &::before {
              background: url("../../assets/rebeng/gouhao.png") no-repeat center
                center;
              background-size: 30px 30px;
            }
          }
          &.error {
            color: #f92400;
            &::before {
              background: url("../../assets/rebeng/warningo.png") no-repeat
                center center;
              background-size: 30px 30px;
            }
          }
        }
      }
      .list {
        border-top: 1px solid #dfdfdf;
        & ul li {
          font-size: tvw(108);
          margin-top: tvw(166);
          .gray {
            color: #9a9a9a;
            &::before {
              display: inline-block;
              width: tvw(84);
              height: tvw(84);
              border-radius: 50%;
              background: linear-gradient(to top right, #599aff, #9a57ff);
              content: "";
              margin-right: tvw(42);
            }
          }
          .line {
            border: 1px solid #dfdfdf;
            margin: 0 tvw(126);
          }
        }
      }
      .block {
        display: flex;
        align-items: center;
        font-size: tvw(117);
        font-weight: bold;
        .min {
          color: #4ca6ff;
          width: tvw(200);
        }
        .max {
          color: #ff874c;
          width: tvw(267);
          text-align: right;
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
          color: #333333;
        }
        .desc {
          font-size: tvw(100);
          color: #999999;
        }
      }
    }
  }
  .footer {
    margin-top: tvw(83);
    text-align: center;
    font-size: tvw(108);
    @media only screen and (min-device-width: 320px) and (max-device-width: 340px) {
      margin-top: tvw(83);
    }
    &.fixed {
      position: fixed;
      bottom: tvw(83);
      width: 100%;
    }
    .but-list {
      display: flex;
      &:not(:first-child) {
        margin-top: tvw(166);
      }
      .but-group {
        flex: 1;
        & .icon {
          width: tvw(291);
          height: tvw(291);
          border: 1px solid #ffffff;
          border-radius: 100%;
          margin: 0 auto;
          margin-bottom: tvw(42);
          &.zhileng {
            background: url("../../assets/rebeng/zhileng.png") no-repeat center
              center;
            background-size: 38px 36px;
          }
          &.zhileng1 {
            background: url("../../assets/rebeng/zhileng1.png") no-repeat center
              center;
              border-color:#55ba8e; 
            background-size: 38px 36px;
          }
          &.successs {
            background: url("../../assets/rebeng/gouhao.png") no-repeat center
              center;
              border: none;
            background-size: 38px 36px;
          }
          &.gongnuan {
            background: url("../../assets/rebeng/gongnuan.png") no-repeat center
              center;
            background-size: 38px 36px;
          }
          &.gongnuan1 {
            background: url("../../assets/rebeng/gongnuan1.png") no-repeat center
              center;
              border-color:#eccc1e; 
            background-size: 38px 36px;
          }
          &.water-temp {
            background: url("../../assets/rebeng/water-temperature.png")
              no-repeat center center;
            background-size: 38px 36px;
          }
          &.breakdown {
            background: url("../../assets/rebeng/breakdown.png") no-repeat
              center center;
              border-color:#eccc1e; 
            background-size: 38px 36px;
          }
          &.hot-water {
            background: url("../../assets/rebeng/hot-water.png") no-repeat
              center center;
            background-size: 38px 36px;
          }
          &.menu {
            background: url("../../assets/menu.png") no-repeat center center;
            background-size: 18px 16px;
          }
        }
      }
    }
  }
  .switch {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: tvw(2685);
    margin: tvw(200) auto;
    & .icon {
      width: tvw(291);
      height: tvw(291);
      border: 1px solid #ffffff;
      border-radius: 100%;
      margin: 0 auto;
      margin-bottom: tvw(42);
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
<style rel="stylesheet/scss" lang="scss">
.water-slider {
  flex: 1;
  .el-slider__runway {
    background: linear-gradient(
      to right,
      #4ca6ff,
      #9556ff,
      #f44cf0,
      #ff66a1,
      #ff7e63,
      #ff874c
    );
  }
  .el-slider__bar {
    background-color: unset;
  }
}
</style>