<template>
    <div class="main-wrapper" v-show='pageIsShow' :style="{ 'background-image': 'url(' + img + ')'}">
        <div class="header">
            <span>{{ deviceName }}</span>
            <span class="edit" @click="intoSet"></span>
            <span class="time" v-if="1===2"></span>
            </div>
            <div class="info">
            <img src="../../assets/map.png" style="width:12px;height:auto" />&nbsp;
            <span >{{location}}&nbsp;</span>
            <span >{{weather}} {{outerTem}}&nbsp;</span>
            <span >湿度: {{outerHum}}&nbsp;</span>
            <span>PM2.5: {{outerPm/10}}ug/m3&nbsp;</span>
            <!-- <span>质量: 优</span> -->
        </div>
        <div class="content">
            <div class="content_top">
                <div class="content_yuan">
                    <!-- <div class="content_yuan_t">
                        <p>TDS 优</p>
                        <p>1528</p>
                        <p>ppm</p>
                    </div> -->
                </div>
            </div>
            <div class="content_contents">
                <div class="content_contents_z1">
                    <p v-if = 'alarm'>滤芯正常使用</p>
                    <p v-else>滤芯告警，请处理 ！</p>
                </div>
                <!-- <div class="content_bottom" @click="intoSet">
                    <p><img src="../../assets/kaiguan.png"></p>
                </div> -->
            </div>
        </div>
    </div>

</template>
<script>
import imgbg from '../../assets/szjc_bg.png'
import { Loading, Toast } from "vue-ydui/dist/lib.rem/dialog";
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
  getStrainerData,
  getFuncResult
} from "../wenkong/api";
export default {
    data(){
        return{
            img:imgbg,
            isOpen:true,
            pageIsShow:true,
            deviceName:'漏水保护器',
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
            wendus:0,
            breakdownList: [],
            isLock: false, // 童锁
            currMode: '2',
            hotMode: '1',
            coldMode: '2',
            value2: false,
            alarm:true
        }
    },
    created(){
        this.deviceName = Store.fetch("deviceName");
        this.customerName = Store.fetch("customerName");
        this.getIndexAbilityData();
        this.getLocation()
        this.getWeather();
        // this.initBackground()
    },
    methods:{
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
        // 获取天气
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
                // console.log(123)
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
                this.setPopDialogData();
            });
        },
        switchHandler () {
            // 开关机初始化
            const tempArray = this.abilitysList.filter(
                item => item.abilityId == this.formatItemsList[0].abilityId
            )[0];
            // console.log(tempArray,1)
            if(tempArray.currValue == 0){
                this.alarm = false
            }else{
                this.alarm = true
            }
            // 找到关机的对象
            // const tempObj = tempArray[1];
            // const tempObj = tempArray[0].dirValue == 0? tempArray[0]: tempArray[1];
            // if (tempObj.isSelect === 1) {
            //     // 说明是关机
            //     this.isOpen = false;
            // } else {
            //     this.isOpen = true;
            // }
        },
        setPopDialogData () {
      // 实时设置下方弹框内的数据
      // 为了解决：弹框打开的情况下，设备状态变化时，弹框内选项数据却没有变更的问题。
      const updateCurrData = () => {
        // 模式
        // const data = this.abilitysList.find(item => item.abilityId == this.formatItemsList[1].abilityId);
        // const tempArray = data.abilityOptionList
        // let temp = {}
        // console.log(data)
        // tempArray.map(m => {
        //   // console.log(m)
        //   if (data.currValue === m.dirValue) {
        //     this.currMode = m.dirValue
        //     m.isChecked = true
        //   } else {
        //     m.isChecked = false
        //   }
        //   if (data.currValue === '1') {
        //     temp = this.abilitysList.find(item => item.abilityId == this.formatItemsList[3].abilityId);
        //     this.waterTemp = Number(temp.currValue) / 10
        //   } else if (data.currValue === '2') {
        //     temp = this.abilitysList.find(item => item.abilityId == this.formatItemsList[2].abilityId);
        //     this.waterTemp = Number(temp.currValue) / 10
        //   }
        // })
      }

    //   // 更新故障
    //   const updateBreakdown = () => {
    //     this.breakdownList = []
    //     const ids = this.formatItemsList[6] && this.formatItemsList[6].abilityId.split(",");
    //     ids.map(id => {
    //       let tempdata = this.abilitysList.find(item => item.abilityId == id);
    //       let tempArr = tempdata.abilityOptionList
    //       tempArr.map(arr => {
    //         // 故障
    //         if (arr.optionValue === '1' && arr.isSelect === '1') {
    //           this.breakdownList.push({
    //             code: tempdata.dirValue,
    //             desc: tempdata.abilityName
    //           })
    //         }
    //       })
    //     })
    //   };

      const updateTemp = () => {
        // 供水温度
        const data1 = this.abilitysList.find(item => item.abilityId == this.formatItemsList[1].abilityId);
        // 回水温度
        const data2 = this.abilitysList.find(item => item.abilityId == this.formatItemsList[2].abilityId);
        const data3 = this.abilitysList.find(item => item.abilityId == this.formatItemsList[3].abilityId);
        const data4 = this.abilitysList.find(item => item.abilityId == this.formatItemsList[5].abilityId);
        console.log(data2,data3)
        this.waterTempGS = data1.currValue;
        this.waterTempHS = data2.currValue;
        this.waterTempHSd = data3.currValue;
        this.wendus = data4.currValue;
      };

      updateCurrData();
    //   updateBreakdown();
    //   updateTemp();
    },
            intoSet () {
                // Toast({
                //     mes: "设备不可用",
                //     timeout: 1000,
                //     icon: "error"
                // });
                // if (!this.isOpen) {
                //     return;
                // }
                const query = this.$route.query;
                this.$router.push({
                    path: "/set",
                    query: {
                    deviceId: this.deviceId,
                    wxDeviceId: this.wxDeviceId,
                    customerId: this.customerId,
                    masterFormat: 1, // 可能作为主机（目前只有新风版式可以作为主机）
                    hasChildren: query.hasChildren,
                    // hasTwoAbility: this.hasTwoAbility()
                    }
                });
            },
    }
}
</script>
<style lang="scss" scoped>
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
  .content{
      margin-top: 10vh;
      &_top{
          width: 70vw;
          margin: auto;
          text-align: center;
      }
      &_yuan{
            width: 100%;
            height: 33vh;
            background: url('../../assets/loushui.png') no-repeat center center;
            background-size: 100% 100%;
            &_t{
                padding-top: 9vh;
                p{
                    font-weight: 600;
                    &:first-child{
                        font-size: 18px;
                    }
                    &:nth-child(2){
                        font-size: 36px;
                        line-height: 60px;
                    }
                    &:nth-child(3){
                        font-size: 14px;
                    }
                }
            }
        }
  
  
  
  }
  .content_contents{
      width: 70%;
      margin: auto;
      margin-top: 7vh;
      .content_contents_z{
        display: -webkit-flex;
        display: flex;
        -webkit-justify-content: space-between;
        justify-content: space-between;
        .content_contents_item{
            padding: 0.1rem 0.4rem;
            border:1px solid #fff;
            text-align: center;
            border-radius: 0.2rem;
            p{
                &:first-child{
                    font-size: 15px;
                    font-weight: 600;
                    line-height: 25px;
                }
                &:nth-child(2){
                    font-size: 13px;
                }
            }
        }
        
      }
      .content_contents_z1{
          width: 100%;
          margin-top: 3vh;
          text-align: center;
          p{
              font-size: 16px;
              font-weight: 600;
          }
      }
      .content_contents_z2{
        display: -webkit-flex;
        display: flex;
        width: 70%;
        margin: auto;
        margin-top: 3vh;
        -webkit-justify-content: space-between;
        justify-content: space-between;
        &_item{
            p{
                float: left;
                img{
                    width: 0.22rem;
                    margin-right: 0.1rem;
                }
                &:nth-child(2){
                    font-size: 20px;
                }
            }
        }
      }
  }
  .content_bottom{
      position: absolute;
      left: 50%;
      bottom: 6vh;
      margin-left: -0.4rem;
      p{
          img{
              width: 0.8rem;
          }
      }
  }
}
</style>