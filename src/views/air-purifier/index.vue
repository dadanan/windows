<template>
  <div class="we-page" v-show='pageIsShow' :style="{ 'background-image': 'url(' + img + ')'}">
    <div class="we-header">
      <router-link class="we-back" to="/list">
        <i class="iconfont icon-xiangzuojiantou"></i>
      </router-link>
      {{ pageName }}
      <span class="we-setting" @click="handleSetting">
        <i></i>
      </span>
    </div>
    <div class="we-content">
      <div class="base-info-text">
        <span v-if='formatItemsList[12] && formatItemsList[12].showStatus'>
          <i class="iconfont icon-weizhi vam"></i> {{ location }}</span>
        <span v-if='formatItemsList[13] && formatItemsList[13].showStatus'>{{ weather }}&nbsp;&nbsp;{{ getOuterTem }}℃</span>
      </div>
      <div class="control-btn-group">
        <div class="btn" @click="shows" v-if='formatItemsList[10] && formatItemsList[10].showStatus'>
          <i class="iconfont icon-sheding"></i>
          <span>{{formatItemsList[10].showName || '设定'}}</span>
        </div>
        <div class="btn" v-if='formatItemsList[11] && formatItemsList[11].showStatus'>
          <i class="iconfont icon-kaiguan" @click="handleOpen"></i>
          <span>{{formatItemsList[11].showName || '开关'}}</span>
        </div>
      </div>
      <div class="data-show-container">
        <div @click='changeMode' :class='{"data-show": true,"data-show-auto": theModeType === "1", "data-show-manual": theModeType === "3", "data-show-no-mode": theModeType === "0"}'></div>
        <div class="data1">
          <div class="data-template1" v-if='formatItemsList[7] && formatItemsList[7].showStatus'>
            <span>PM2.5</span>
            <span>{{ getOuterPM }}</span>
            <span>μg/m³</span>
          </div>
        </div>
        <div class="data2">
          <div class="data-template1" v-if='formatItemsList[8] && formatItemsList[8].showStatus'>
            <span>PM2.5</span>
            <span>{{ getAbilityData(formatItemsList[8].abilityId).currValue}}</span>
            <span>μg/m³</span>
          </div>
        </div>
        <div class="data3">
          <div class="data-template2">室外</div>
        </div>
        <div class="data4" v-if='formatItemsList[9] && formatItemsList[9].showStatus'>
          <div class="data-template3" :class="{ 'off': !isOpen }">
            <span>{{ puriEffic }}
              <span>%</span>
            </span>
            <span>净化效率</span>
          </div>
        </div>
        <div class="data5">
          <div class="data-template4">室内</div>
        </div>
        <div class="data6">
          <div class="data-template5">
            <span v-if='formatItemsList[3] && formatItemsList[3].showStatus'>
              <i class="iconfont icon-wendu"></i> {{ getOuterTem }}
              <span>℃</span>
            </span>
            <span v-if='formatItemsList[4] && formatItemsList[4].showStatus'>
              <i class="iconfont icon-shidu"></i> {{ getOuterHum }}
              <span>%</span>
            </span>
          </div>
        </div>
        <div class="data7">
          <div class="data-template5">
            <span v-if='formatItemsList[5] && formatItemsList[5].showStatus'>
              <i class="iconfont icon-wendu"></i> {{ getAbilityData(formatItemsList[5].abilityId).currValue }}
              <span>℃</span>
            </span>
            <span v-if='formatItemsList[6] && formatItemsList[6].showStatus'>
              <i class="iconfont icon-shidu"></i> {{ getAbilityData(formatItemsList[6].abilityId).currValue }}
              <span>%</span>
            </span>
          </div>
        </div>
      </div>
      <!-- <div class="data-alert" v-if="tem < 16 ">
        <i class="iconfont icon-baojing"></i>
        温度较低，请开启加热
      </div>
      <div class="data-alert" v-if="hum < 40 ">
        <i class="iconfont icon-baojing"></i>
        温度较低，请开启加湿
      </div> -->
      <div class="data-alert" v-if="pur < pur1 ">
        <i class="iconfont icon-baojing"></i>
        净化效率低，请注意更换滤网或者清洗
      </div>
      <div class="data-alert" v-if="pm > pm1 ">
        <i class="iconfont icon-baojing"></i>
        PM2.5高，请注意更换滤网或者清洗
      </div>
    </div>
    <div class="we-footer">
      <div class="func-sw" v-if='formatItemsList[0] && formatItemsList[0].showStatus'>
        <i class="iconfont icon-jiare"></i>
        <div @click="handleSwitch('2B0', jrSwitch)">
          <!-- :disabled="!isOpen" -->
          <yd-switch v-model="jrSwitch" true-value="1" false-value="0" :disabled='!isOpen || theModeType === "1"'></yd-switch>
        </div>
      </div>
      <div class="func-sw" v-if='formatItemsList[1] && formatItemsList[1].showStatus'>
        <i class="iconfont icon-jiashi"></i>
        <div @click="handleSwitch('250', jsSwitch)">
          <yd-switch v-model="jsSwitch" true-value="1" false-value="0" :disabled='!isOpen || theModeType === "1"'></yd-switch>
        </div>
      </div>
      <div class="func-sw" v-if='formatItemsList[2] && formatItemsList[2].showStatus'>
        <i class="iconfont icon-dianzijinghua"></i>
        <div @click="handleSwitch('2A0', jhSwitch)">
          <yd-switch v-model="jhSwitch" true-value="1" false-value="0" :disabled='!isOpen || theModeType === "1"'></yd-switch>
        </div>
      </div>
    </div>
    <yd-popup v-model="show1" position="center" width="80%">
      <div class="we-popup">
        <div class="we-popup-body">
          <div class="we-form">
            <div class="we-input-group" v-for="item in masge" :key="item.abilityName">
              <span class="we-label">
                <span>{{item.abilityName}}</span>
                <!-- <span>μg/m³</span> -->
              </span>
              <yd-spinner v-model="item.currValue" :min="0" :max="item.max" ></yd-spinner>
            </div>
            <!-- <div class="we-input-group">
              <span class="we-label">
                <span>净化效率预值设定</span>
                <span>%</span>
              </span>
              <yd-spinner v-model="preJhSpinner" :min="0"></yd-spinner>
            </div>
            <div class="we-input-group">
              <span class="we-label">
                <span>湿度最低预值设定</span>
                <span>%</span>
              </span>
              <yd-spinner v-model="preHumSpinner" :min="0"></yd-spinner>
            </div>
            <div class="we-input-group">
              <span class="we-label">
                <span>温度最低预值设定</span>
                <span>℃</span>
              </span>
              <yd-spinner v-model="preTemSpinner" :min="0"></yd-spinner>
            </div> -->
          </div>
        </div>
        <div class="we-popup-footer">
          <div class="we-btn" @click="defaults" >默认值</div>
          <div class="we-btn-solid" @click="show1 = false">取消</div>
          <div class="we-btn" @click="handleSetFuncs">确认</div>
        </div>
      </div>
    </yd-popup>
  </div>
</template>

<script>
import { Loading, Toast } from "vue-ydui/dist/lib.rem/dialog";
import { Switch } from "vue-ydui/dist/lib.rem/switch";
import { Popup } from "vue-ydui/dist/lib.rem/popup";
import { Spinner } from "vue-ydui/dist/lib.rem/spinner";
import img from "../../assets/bak4.jpg";
import { setWechatTitle } from "utils";
import Store from "../wenkong/store";
import {
  getModelVo,
  newQueryDetailByDeviceId,
  getLocation,
  getWeather,
  sendFunc
} from "../wenkong/api";
import { debug } from "@/utils/log";
import img1 from "../../assets/bak3.jpg"; // 白天阴
import img2 from "../../assets/bak2.jpg"; // 夜晚阴
import img3 from "../../assets/bak1.jpg"; // 夜晚晴
import img4 from "../../assets/bak4.jpg"; // 白天晴

export default {
  components: {
    "yd-switch": Switch,
    "yd-popup": Popup,
    "yd-spinner": Spinner
  },
  data() {
    return {
      shutdown: "", // 关机
      cloudyDay: img1, // 阴天
      sunnyDay: img4, // 晴天
      cloudyNight: img2, // 夜晚阴
      sunnyNight: img3, // 夜晚晴
      img: img4,
      jrSwitch: "0",
      jsSwitch: "0",
      jhSwitch: "0",
      show1: false,
      pageIsShow: false,
      prePmSpinner: 0,
      preJhSpinner: 0,
      preTemSpinner: 0,
      preHumSpinner: 0,
      isOpen: true,
      loopLoadTimeSet: null,
      once: true,
      pageName: "",
      formatItemsList: [],
      abilitysList: [],
      i:0,
      location: "",
      weather: "", // 天气
      outerTem: "", // 温度
      outerHum: "", // 湿度
      outerPm: "", // PM2.5
      deviceId: this.$route.query.deviceId,
      wxDeviceId: this.$route.query.wxDeviceId,
      customerId: this.$route.query.customerId,
      setInter: undefined, // 定时器的id
      setInter1: undefined, // 定时器的id
      isOpen: false, // 开机状态？
      status: false, // 主机状态
      theModeType: "1", // 当前模式 0：关机 1:自动模式 3: 手动模式
      masge:[],
      datas:[],
      pm1:0,  //shipm25
      pur:0,  //算净化效率
      pur1:0,  //设净化效率
      pm :0   //pm25
    };
  },
  computed: {
    puriEffic() {
      /**
       * 计算净化效率
       * (室外PM2.5 - 室内PM2.5)/室外PM2.5
       */
      if (!this.formatItemsList[8] || !this.formatItemsList[8].abilityId) {
        return this.outerPm || 0;
      }
      const interId =
        this.formatItemsList[8] && this.formatItemsList[8].abilityId;
      if (interId === null) {
        return 0;
      }

      const interData = this.getAbilityData(this.formatItemsList[8].abilityId);
      if (!interData) {
        return 0;
      }

      const interPM = Number(interData.currValue);
      const outerPM = Number(this.getOuterPM);
      const result = Math.floor(((outerPM - interPM ) / outerPM) * 100);
      if (Number.isNaN(result)) {
        // 如果净化效率不是数字，说明上面某个数据里有字符串
        // 或者是负数的话，也0
        this.pur = 0
        return 0;
      }
      this.pur = Math.abs(result)      
      return Math.abs(result);
    },
    getOuterPM() {
      if (!this.formatItemsList[7] || !this.formatItemsList[7].abilityId) {
        return this.outerPm;
      }
      // 获取室外PM2.5 湿度 数据，如果室外传感器有值，就用。否则用第三方接口的
      const currValue = this.getAbilityData(this.formatItemsList[7].abilityId)
        .currValue;
      if (currValue && currValue !== "0") {
        return currValue;
      }
      return this.outerPm;
    },
    getOuterHum() {
      // 室外湿度
      if (!this.formatItemsList[4] || !this.formatItemsList[4].abilityId) {
        if (!this.outerHum) {
          return "";
        }
        return this.outerHum.replace("%", "")
      }
      const currData = this.getAbilityData(this.formatItemsList[4].abilityId);
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
      if (!this.formatItemsList[3] || !this.formatItemsList[3].abilityId) {
        if (!this.outerTem) {
          return "";
        }
        return this.outerTem.replace("℃", "");
      }
      const currData = this.getAbilityData(this.formatItemsList[3].abilityId);
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
    }
  },
  methods: {
    defaults(){
      const arr = {
        '2DD0':16,
        '2DE0':40,
        '2DG0':88,
        '2DF0':10
      }
      for(var i = 0;i<this.masge.length;i++){
        this.masge[i].currValue = arr[this.masge[i].dirValue]
      }
    },
    shows(){
      this.show1 = true
      clearInterval(this.setInter)

    },
    /**
     * 型号功能项数据中存在模式数据？
     */
    hasModeData() {
      const modeData = this.getAbilityDataByDirValue(210, "模式");
      if (!modeData) {
        debug("型号未添加「模式功能项」数据！");
        return false;
      }
      const option = modeData.abilityOptionList;
      if (!option) {
        debug("模式功能项数据中没有选项数据！");
        return false;
      }
      return true;
    },
    /**
     * 切换手动/智能模式
     */
    changeMode() {
      this.sendFunc(210, this.theModeType == "1" ? 3 : 1, () => {
        this.theModeType = this.theModeType === "1" ? "3" : "1";
      });
    },
    handleOpen() {
      this.sendFunc("210", this.isOpen ? "0" : "1", () => {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
          Toast({
            mes: "开启成功",
            timeout: 1500,
            icon: "success"
          });
        } else {
          Toast({
            mes: "关闭成功",
            timeout: 1500,
            icon: "success"
          });
        }
      });
    },
    handleSetting() {
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
    handleSwitch(code, value) {
      if (this.theModeType === "1") {
        Toast({
          mes: "智能模式下，禁止操作！",
          timeout: 1000
        });
        return;
      }
      if (!this.isOpen) {
        Toast({
          mes: "设备已关机，禁止操作！",
          timeout: 1000
        });
        return;
      }
      this.sendFunc(code, value == "0" ? "1" : "0");
    },
    sendFunc(funcId, value, cb) {
      Loading.open("发送中...");
      sendFunc({
        deviceId: this.$route.query.deviceId,
        funcId,
        value
      })
        .then(res => {
          if (res.code == 200) {
            Loading.close();
            Toast({
              mes: "发送成功",
              timeout: 1000,
              icon: "success"
            });
            console.log("指令发送成功", funcId, "-", value);
            if (cb) {
              cb();
            }
          }
        })
        .catch(() => {
          Loading.close();
        });
    },
    asyncSendFunc(code, value) {
        this.i++
        sendFunc({
          deviceId: this.$route.query.deviceId,
          funcId: code,
          value: value
        })
          .then(res => {
            if (res.code == 200) {
              if(this.i < this.masge.length){
                this.sleep(300)
                this.as(this.i)
              }else{
                
                 Toast({
                  mes: "发送成功",
                  timeout: 1000,
                  icon: "success"
                });
              }
            }
          })
          .catch(e => {
            // reject(e);
          });
    },
    as(i){
      this.asyncSendFunc(this.masge[i].dirValue,this.masge[i].currValue)
    },
    // asyncSendFunc(code, value) {
    //   return new Promise((resolve, reject) => {
    //     let data = {
    //       deviceId: this.$route.query.deviceId,
    //       funcId: code,
    //       value: value
    //     };
    //     sendFunc({
    //       deviceId: this.$route.query.deviceId,
    //       funcId: code,
    //       value: value
    //     })
    //       .then(res => {
    //         if (res.code == 200) {
    //           resolve();
    //         }
    //       })
    //       .catch(e => {
    //         reject(e);
    //       });
    //   });
    // },
    sleep(delay){
       var start = (new Date()).getTime();
        while ((new Date()).getTime() - start < delay) {
          continue;
        }
    },
    handleSetFuncs() {
      this.i = 0
      this.show1 = false
      const that = this   
      that.asyncSendFunc(that.masge[0].dirValue,that.masge[0].currValue)
        this.setInter = setInterval(() => {
            this.getIndexFormatData();
            this.getWeather();
        }, 2000);
    },
    getIndexAbilityData() {
      // 获取H5控制页面功能项数据，带isSelect参数
      getModelVo({ deviceId: this.deviceId, pageNo: 1 }).then(res => {
        if (res.code == 200 && res.data) {
          const data = res.data;
          Store.save("modelId",data.modelId)
          // console.log(res.data)
          this.pageName = data.manageName;

          /**
           * 因为目前电子净化器版式中没有模式的配置项
           * 找到模式功能项，后续需要添加进查询接口数据列表中
           */
          data.abilitysList.forEach(item => {
            if (item.dirValue == "210" && item.abilityName == "模式") {
              data.formatItemsList.push({
                abilityId: item.abilityId,
                showStatus: 1
              });
            }
          });

          this.formatItemsList = data.formatItemsList;
          data.abilitysList.forEach(item => {
            item["currValue"] = "";
          });
          this.abilitysList = data.abilitysList;

          // 定时请求接口数据，更新页面数据
          this.setInter = setInterval(() => {
            this.getIndexFormatData();
            this.getWeather();
          }, 2000);

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
      // console.log(this.formatItemsList)
      // const ids = this.formatItemsList
      //   .filter(item => item.showStatus == 1 && item.abilityId)
      //   .map(item => item.abilityId);
        
        const iss = []
        this.masge = []
        for(var i = 0 ;i<this.formatItemsList.length; i++){
          if(i == '10'){
            var ss = this.formatItemsList[i].abilityId.split(',')
            for(var j = 0;j< ss.length; j++){
              for(var s= 0;s<this.abilitysList.length;s++){

                // console.log(ss[j])
                if(ss[j] == this.abilitysList[s].abilityId){
                  this.masge.push(this.abilitysList[s])
                }
              }
              iss.push(ss[j])
            }
          }else if(i=='14'){ 
          }else{
            if(this.formatItemsList[i].abilityId){
              iss.push(this.formatItemsList[i].abilityId)
            }
          }
        }
        const arr = {
          '2DD0':35,
          '2DE0':100,
          '2DG0':100,
          '2DF0':150
        }
        for(var i = 0;i<this.masge.length;i++){
          this.masge[i].max = arr[this.masge[i].dirValue]
          this.masge[i].currValue = Number(this.masge[i].currValue)
        }
        // console.log(iss)
      // console.log(ids)
      /**
       * 在后台型号未完善版式数据更新的逻辑前，先在代码层面处理添加新功能项的情况。
       */

      newQueryDetailByDeviceId({
        deviceId: this.deviceId,
        abilityIds: iss
      }).then(res => {
        const data = res.data;
        for(var i = 0;i<data.length;i++){
          if(data[i].dirValue){
            if(data[i].dirValue == '110'){
              this.pm1 = Number(data[i].currValue)
            } 
            // if(data[i].dirValue == '2DE0'){
            //   this.hum = Number(data[i].currValue)
            // }
            if(data[i].dirValue == '2DG0'){
              this.pur1 = Number(data[i].currValue)
              console.log(this.pur1)
            }
            if(data[i].dirValue == '2DF0'){
              this.pm = Number(data[i].currValue)
            }
          }
          
        }
        this.datas = data
        // this.masge = res.data
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
        this.initHandler();
        this.initSwitch();
        this.initMode();
      });
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
    getAbilityData(abilityId) {
      const result = this.abilitysList.filter(
        item => item.abilityId == abilityId
      )[0];
      return result;
    },
    getAbilityDataByDirValue(dirValue, abilityName) {
      // console.log(this.abilitysList)
      const result = this.datas.filter(
        item => item.dirValue == dirValue && item.abilityName == abilityName
      );
      return result && result[0];
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
    initHandler() {
      // 初始化下方三个按钮的状态
      if (this.formatItemsList[0]) {
        const temp = this.getAbilityData(this.formatItemsList[0].abilityId)
          .abilityOptionList;

        const tempObj = temp[0].dirValue == 0 ? temp[0] : temp[1];
        if (tempObj.isSelect == 1) {
          // 说明是关
          this.jrSwitch = "0";
        } else {
          this.jrSwitch = "1";
        }
      }

      if (this.formatItemsList[1]) {
        const temp = this.getAbilityData(this.formatItemsList[1].abilityId)
          .abilityOptionList;

        const tempObj = temp[0].dirValue == 0 ? temp[0] : temp[1];
        if (tempObj.isSelect == 1) {
          // 说明是关
          this.jsSwitch = "0";
        } else {
          this.jsSwitch = "1";
        }
      }

      if (this.formatItemsList[2]) {
        const temp = this.getAbilityData(this.formatItemsList[2].abilityId)
          .abilityOptionList;

        const tempObj = temp[0].dirValue == 0 ? temp[0] : temp[1];
        if (tempObj.isSelect == 1) {
          // 说明是关
          this.jhSwitch = "0";
        } else {
          this.jhSwitch = "1";
        }
      }
    },
    initSwitch() {
      // 初始化开关的状态
      const tempArray = this.abilitysList.filter(
        item => item.abilityId == this.formatItemsList[11].abilityId
      )[0].abilityOptionList;

      // 找到关机的对象
      const tempObj = tempArray[0].dirValue == 0 ? tempArray[0] : tempArray[1];
      if (tempObj.isSelect == 1) {
        // 说明是关机
        this.isOpen = false;
        this.bg = null;
      } else {
        this.isOpen = true;
        this.bg = img;
      }
    },
    initMode() {
      // 初始化模式：智能、手动
      const modeData = this.getAbilityDataByDirValue(210, "模式");
      if (!modeData) {
        debug("型号未添加「模式功能项」数据！");
        return;
      }
      // const option = modeData.abilityOptionList;
      const option = this.datas
      console.log(option)
      if (!option) {
        debug("模式功能项数据中没有选项数据！");
        return;
      }
      // 设备上传：选择了自动模式
      let modeType = "0";
      option.forEach(item => {
        if (item.dirValue == "3" && item.isSelect) {
          modeType = "3";
        } else if (item.dirValue == "1" && item.isSelect) {
          modeType = "1";
        }
      });
      console.log(modeType)
      this.theModeType = modeType;
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
  beforeDestroy() {
    clearInterval(this.setInter);
  }
};
</script>

<style lang="scss" scoped>
.we-form {
  padding: 0 0.5rem;
}

.we-input-group {
  display: flex;
  margin-bottom: 0.4rem;
  &:last-child {
    margin-bottom: 0;
  }
}

.we-label {
  color: #fff;
  display: flex;
  flex-direction: column;
  text-align: right;
  flex: 1;
  justify-content: center;
  margin-right: 0.5rem;
  span:nth-child(1) {
    font-size: 0.2rem;
  }
  span:nth-child(2) {
    font-size: 0.18rem;
  }
}

.we-btn,
.we-btn-solid {
  padding: 0.15rem 0.2rem;
  font-size: 0.2rem;
  border: 1px solid #2689ee;
  border-radius: 5px;
  color: #2689ee;
  font-weight: bold;
  text-align: center;
  display: inline-block;
  width: 1.5rem;
}

.we-btn {
  background-color: #2689ee;
  color: #fff;
}

.we-popup {
  border-radius: 5px;
  overflow: hidden;
  .we-popup-body {
    background-color: #2689ee;
    padding: 0.3rem;
  }
  .we-popup-footer {
    padding: 0.3rem;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
  }
}

.we-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #999999;
  display: flex;
  flex-direction: column;
  background-repeat: no-repeat;
  background-size: cover;
}

.we-header {
  position: relative;
  height: 0.85rem;
  /*background-color: #2493f1;*/
  /*background-color: #ccc;*/
  font-size: 0.3rem;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.we-back {
  position: absolute;
  color: #fff;
  top: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 0.85rem;
}

.we-setting {
  position: absolute;
  color: #fff;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 0.85rem;
  i {
    height: 20px;
    width: 20px;
    background: url("../../assets/set.png") no-repeat center center;
    background-size: 20px 20px;
  }
}

.we-content {
  padding: 0 0.5rem;
  flex: 1;
  overflow: auto;
}

.we-footer {
  height: 2rem;
  /*background-color: #2493f1;*/
  /*background-color: #ccc;*/
  padding: 0.4rem 0;
  display: flex;
  justify-content: space-around;
}

.vam {
  vertical-align: middle;
}

.base-info-text {
  font-size: 0.2rem;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0;
  span {
    margin-right: 0.25rem;
  }
}

.control-btn-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0 0.3rem;
  .btn {
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.2rem;

    i {
      font-size: 0.8rem;
    }
  }
}

.data-show {
  width: 6.39rem;
  height: 2.78rem;
  display: block;
  margin: auto;
}

.data-show-auto {
  background: url("~assets/air-purifier-data-auto.png") no-repeat;
  background-size: contain;
}

.data-show-manual {
  background: url("~assets/air-purifier-data-manual.png") no-repeat;
  background-size: contain;
}

.data-show-no-mode {
  background: url("~assets/air-purifier-data-show-bg.png") no-repeat;
  background-size: contain;
}

.data-show-container {
  padding: 0.5rem 0;
  position: relative;
  margin-bottom: 0.5rem;
  .data-template1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    span:nth-child(1) {
      color: #e6e6e6;
      font-size: 0.26rem;
    }
    span:nth-child(2) {
      color: #fff;
      font-size: 0.65rem;
    }
    span:nth-child(3) {
      color: #e6e6e6;
      font-size: 0.2rem;
    }
  }
  .data-template2 {
    font-size: 0.21rem;
    color: #b6f94b;
  }
  .data-template3 {
    display: flex;
    flex-direction: column;
    /*align-items: center;*/
    text-align: center;
    width: 100%;
    span:nth-child(1) {
      font-size: 0.92rem;
      color: #ffff00;
      display: flex;
      justify-content: center;
      span {
        font-size: 0.23rem;
        color: #e6e6e6;
      }
    }

    &.off {
      span:nth-child(1) {
        color: #d86e5d;
      }
    }

    span:nth-child(2) {
      font-size: 0.15rem;
      color: #e6e6e6;
    }
  }

  .data-template4 {
    font-size: 0.21rem;
    color: #c5d6ff;
  }

  .data-template5 {
    display: flex;
    flex-direction: column;
    span {
      color: #fff;
      font-size: 0.35rem;
      span {
        color: #e6e6e6;
        font-size: 0.17rem;
      }
    }
  }

  .data1 {
    position: absolute;
    top: 0.25rem;
    left: 0.4rem;
  }

  .data2 {
    position: absolute;
    top: 0.25rem;
    right: 0.4rem;
  }

  .data3 {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 1.3rem;
    height: 0.15rem;
    margin: auto;
  }

  .data4 {
    position: absolute;
    top: 1.3rem;
    right: 0;
    left: 0;
    /*margin: auto;*/
  }

  .data5 {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 1.5rem;
    height: 0.15rem;
    margin: auto;
  }

  .data6 {
    position: absolute;
    bottom: 0.16rem;
    left: 0.25rem;
  }

  .data7 {
    position: absolute;
    bottom: 0.16rem;
    right: 0.25rem;
  }
}

.func-sw {
  display: flex;
  flex-direction: column;
  align-items: center;
  i {
    font-size: 0.6rem;
    color: #fff;
    margin-bottom: 0.2rem;
  }
}

.data-alert {
  text-align: center;
  color: #fff;
  padding: 0.1rem 0rem;
  font-size: 0.29rem;
  i {
    color: #ff0000;
  }
}
</style>

<style lang="scss">
.func-sw {
  .yd-switch {
    width: 0.8rem;
    height: 0.3rem;
    &:checked::after {
      transform: translateX(0.5rem);
    }
    &::after {
      width: 0.3rem;
      height: 0.3rem;
    }
    &::before {
      width: 0.8rem;
      height: 0.3rem;
    }
  }
}
</style>
