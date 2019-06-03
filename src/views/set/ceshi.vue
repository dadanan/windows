<template>
  <div class="main-wrapper" v-show='pageIsShow' :class="{ active: isOpen === true }" @touchmove.prevent :style="{ 'background-image': 'url(' + img + ')'}">
    <div class="header">
      <span>id:{{ 662 }}</span>
    </div>
    <div class="center">
        <div class="circle-inner">
          <span>负离子:</span><span v-html='anion'></span>
          <span>个/cm³</span>
        </div>
    </div>
    <div class=''>
      <div class='box'>
        <div class='left'>
          <span>甲醛:</span>
          {{Number(getAbilityData((formatItemsList[5] || '').abilityId).currValue) / 100}}<em>mg/m³</em>
        </div>
      </div>
    </div>
    <div class="header">
      <span>id:{{ 687 }}</span>
    </div>
    <div class="center">
        <div class="circle-inner">
          <span>负离子:</span><span v-html='anion1'></span>
          <span>个/cm³</span>
        </div>
    </div>
    <div class=''>
      <div class='box'>
        <div class='left'>
          <span>甲醛</span>
          :{{Number(getAbilityData1((formatItemsList[5] || '').abilityId).currValue) / 100}}<em>mg/m³</em>
        </div>
      </div>
    </div>

    <div class="header">
      <span>id:{{ 682 }}</span>
    </div>
    <div class="center">
        <div class="circle-inner">
          <span>负离子:</span><span v-html='anion2'></span>
          <span>个/cm³</span>
        </div>
    </div>
    <div class=''>
      <div class='box'>
        <div class='left'>
          <span>甲醛</span>
          :{{Number(getAbilityData2((formatItemsList[5] || '').abilityId).currValue) / 100}}<em>mg/m³</em>
        </div>
      </div>
    </div>

    <div class="header">
      <span>id:{{ 707 }}</span>
    </div>
    <div class="center">
        <div class="circle-inner">
          <span>负离子:</span><span v-html='anion3'></span>
          <span>个/cm³</span>
        </div>
    </div>
    <div class=''>
      <div class='box'>
        <div class='left'>
          <span>甲醛</span>
          :{{Number(getAbilityData3((formatItemsList[5] || '').abilityId).currValue) / 100}}<em>mg/m³</em>
        </div>
      </div>
    </div>

    <div class="header">
      <span>id:{{ 664 }}</span>
    </div>
    <div class="center">
        <div class="circle-inner">
          <span>负离子:</span><span v-html='anion4'></span>
          <span>个/cm³</span>
        </div>
    </div>
    <div class=''>
      <div class='box'>
        <div class='left'>
          <span>甲醛</span>
          :{{Number(getAbilityData4((formatItemsList[5] || '').abilityId).currValue) / 100}}<em>mg/m³</em>
        </div>
      </div>
    </div>

    <div class="header">
      <span>id:{{ 141 }}</span>
    </div>
    <div class="center">
        <div class="circle-inner">
          <span>负离子:</span><span v-html='anion5'></span>
          <span>个/cm³</span>
        </div>
    </div>
    <div class=''>
      <div class='box'>
        <div class='left'>
          <span>甲醛:</span>
          {{Number(getAbilityData5((formatItemsList[5] || '').abilityId).currValue) / 100}}<em>mg/m³</em>
        </div>
      </div>
    </div>

    <div class="header">
      <span>id:{{ 650 }}</span>
    </div>
    <div class="center">
        <div class="circle-inner">
          <span>负离子:</span><span v-html='anion6'></span>
          <span>个/cm³</span>
        </div>
    </div>
    <div class=''>
      <div class='box'>
        <div class='left'>
          <span>甲醛</span>
          :{{Number(getAbilityData6((formatItemsList[5] || '').abilityId).currValue) / 100}}<em>mg/m³</em>
        </div>
      </div>
    </div>


    <div class="header">
      <span>id:{{ 629 }}</span>
    </div>
    <div class="center">
        <div class="circle-inner">
          <span>负离子:</span><span v-html='anion7'></span>
          <span>个/cm³</span>
        </div>
    </div>
    <div class=''>
      <div class='box'>
        <div class='left'>
          <span>甲醛:</span>
          {{Number(getAbilityData7((formatItemsList[5] || '').abilityId).currValue) / 100}}<em>mg/m³</em>
        </div>
      </div>
    </div>
    <div style="width:100%;height:50px;"></div>
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
      formatItemsList1: [],
      formatItemsList2: [],
      formatItemsList3: [],
      formatItemsList4: [],
      formatItemsList5: [],
      formatItemsList6: [],
      formatItemsList7: [],
      abilitysList: [],
      abilitysList1: [],
      abilitysList2: [],
      abilitysList3: [],
      abilitysList4: [],
      abilitysList4: [],
      abilitysList6: [],
      abilitysList7: [],

      location: "",
      weather: "", //天气
      outerTem: "", // 温度
      outerHum: "", // 湿度
      outerPm: "", // PM2.5
    //   deviceId: this.$route.query.deviceId,
    //   wxDeviceId: this.$route.query.wxDeviceId,
    //   customerId: this.$route.query.customerId,
      setInter: undefined, // 定时id
      setInter1: undefined, // 定时id
      setInter2: undefined, // 定时id
      setInter3: undefined, // 定时id
      setInter4: undefined, // 定时id
      setInter5: undefined, // 定时id
      setInter6: undefined, // 定时id
      setInter7: undefined, // 定时id
      s:{},
      setInter8: undefined,
      AQI: "优",
      tableData:[{
        id:622,
      }]
    };
  },
  computed: {
    anion() {
      // 负离子数值处理
      let number = Number(
        this.getAbilityData((this.formatItemsList[6]).abilityId).currValue
      );
      if (Number.isNaN(number)) {
        return 0;
      }
      if (number < 10000) {
        return number;
      }
      // 如果数值过万，精简显示：x.y万
      return number;
    },
    anion1() {
      // 负离子数值处理
      let number = Number(
        this.getAbilityData1(this.formatItemsList1[6].abilityId).currValue
      );
      if (Number.isNaN(number)) {
        return 0;
      }
      if (number < 10000) {
        return number;
      }
      // 如果数值过万，精简显示：x.y万
      return number;
    },
    anion2() {
      // 负离子数值处理
      let number = Number(
        this.getAbilityData2(this.formatItemsList2[6].abilityId).currValue
      );
      if (Number.isNaN(number)) {
        return 0;
      }
      if (number < 10000) {
        return number;
      }
      // 如果数值过万，精简显示：x.y万
      return number;
    },
    anion3() {
      // 负离子数值处理
      let number = Number(
        this.getAbilityData3(this.formatItemsList3[6].abilityId).currValue
      );
      if (Number.isNaN(number)) {
        return 0;
      }
      if (number < 10000) {
        return number;
      }
      // 如果数值过万，精简显示：x.y万
      return number;
    },
    anion4() {
      // 负离子数值处理
      let number = Number(
        this.getAbilityData4(this.formatItemsList4[6].abilityId).currValue
      );
      if (Number.isNaN(number)) {
        return 0;
      }
      if (number < 10000) {
        return number;
      }
      // 如果数值过万，精简显示：x.y万
      return number;
    },
    anion5() {
      // 负离子数值处理
        // let number1 = Number(
        //     this.getAbilityData5(this.formatItemsList5[6].abilityId).currValue
        // );
        this.s =  Object.assign(this.getAbilityData5(this.formatItemsList5[6].abilityId));
        let number1 = Number(
            (this.s).currValue
        );
        if (Number.isNaN(number1)) {
            return 0;
        }
        if (number1 < 10000) {
            return number1;
        }
        // 如果数值过万，精简显示：x.y万
        return number1;
      
    },
    anion6() {
      // 负离子数值处理
      let number = Number(
        this.getAbilityData6(this.formatItemsList6[6].abilityId).currValue
      );
      if (Number.isNaN(number)) {
        return 0;
      }
      if (number < 10000) {
        return number;
      }
      // 如果数值过万，精简显示：x.y万
      return number;
    },
    anion7() {
      // 负离子数值处理
      let number = Number(
        this.getAbilityData7(this.formatItemsList7[6].abilityId).currValue
      );
      if (Number.isNaN(number)) {
        return 0;
      }
      if (number < 10000) {
        return number;
      }
      // 如果数值过万，精简显示：x.y万
      return number;
    },
  },
  methods: {
    // 662
    getAbilityData(abilityId, which) {
      const result = this.abilitysList.filter(
        item => item.abilityId == abilityId
      )[0];
      return result;
    },
    getIndexAbilityData() {
      // 获取H5控制页面功能项数据，带isSelect参数
      getModelVo({ deviceId: 662, pageNo: 1 }).then(res => {
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
          this.setInter8 = setInterval(() => {
            this.getWeather();
          }, 2000);
          // 显示页面s
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
        deviceId: 662,
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

        // this.switchHandler();
        // 获取列表最后一项：空气质量，的值
      });
    },

        // 687
    getAbilityData1(abilityId, which) {
      if (which === "left") {
        return this.abilitysList1.filter(item => item.dirValue === "280")[0];
      }
      if (which === "right") {
        return this.abilitysList1.filter(item => item.dirValue === "281")[0];
      }
      const result = this.abilitysList1.filter(
        item => item.abilityId == abilityId
      )[0];
      return result;
    },
    getIndexAbilityData1() {
      // 获取H5控制页面功能项数据，带isSelect参数
      getModelVo({ deviceId: 687, pageNo: 1 }).then(res => {
        if (res.code === 200 && res.data) {
          const data = res.data;
          Store.save("modelId",data.modelId)      
          this.pageName = data.pageName;

          this.formatItemsList1 = data.formatItemsList;

          data.abilitysList.forEach(item => {
            item["currValue"] = "";
            item.abilityOptionList &&
              item.abilityOptionList.forEach(iItem => {
                iItem.isChecked = false;
              });
          });
          this.abilitysList1 = data.abilitysList;
          // 定时请求接口数据，更新页面数据
          this.setInter1 = setInterval(() => {
            this.getIndexFormatData1();
          }, 1000);
          // 显示页面
        }
      });
    },
    getIndexFormatData1() {
      // 获取H5控制页面功能项数据，带isSelect参数
      // 根据功能项id筛选功能项
      const findTheAbility = (data, id) => {
        return data.filter(item => item.id == id)[0];
      };
      let ids = this.formatItemsList1
        .filter(item => item.showStatus == 1 && item.abilityId)
        .map(item => item.abilityId);
      newQueryDetailByDeviceId({
        deviceId: 687,
        abilityIds: ids
      }).then(res => {
        const data = res.data;
        // 将res.data中的isSelect和dirValue赋值过去
        this.abilitysList1.forEach((item, index) => {
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

        // this.switchHandler();
        // 获取列表最后一项：空气质量，的值
        const lastItem = data[data.length - 1];
        if (lastItem.abilityName === "空气质量") {
          this.AQI = lastItem.currValue;
        }
      });
    },

        // 682
    getAbilityData2(abilityId, which) {
      if (which === "left") {
        return this.abilitysList2.filter(item => item.dirValue === "280")[0];
      }
      if (which === "right") {
        return this.abilitysList2.filter(item => item.dirValue === "281")[0];
      }
      const result = this.abilitysList2.filter(
        item => item.abilityId == abilityId
      )[0];
      return result;
    },
    getIndexAbilityData2() {
      // 获取H5控制页面功能项数据，带isSelect参数
      getModelVo({ deviceId: 682, pageNo: 1 }).then(res => {
        if (res.code === 200 && res.data) {
          const data = res.data;
          Store.save("modelId",data.modelId)      
          this.pageName = data.pageName;

          this.formatItemsList2 = data.formatItemsList;

          data.abilitysList.forEach(item => {
            item["currValue"] = "";
            item.abilityOptionList &&
              item.abilityOptionList.forEach(iItem => {
                iItem.isChecked = false;
              });
          });
          this.abilitysList2 = data.abilitysList;
          // 定时请求接口数据，更新页面数据
          this.setInter2 = setInterval(() => {
            this.getIndexFormatData2();
          }, 1000);
          // 显示页面
        }
      });
    },
    getIndexFormatData2() {
      // 获取H5控制页面功能项数据，带isSelect参数
      // 根据功能项id筛选功能项
      const findTheAbility = (data, id) => {
        return data.filter(item => item.id == id)[0];
      };
      let ids = this.formatItemsList2
        .filter(item => item.showStatus == 1 && item.abilityId)
        .map(item => item.abilityId);
      newQueryDetailByDeviceId({
        deviceId: 682,
        abilityIds: ids
      }).then(res => {
        const data = res.data;
        // 将res.data中的isSelect和dirValue赋值过去
        // console.log(this.abilitysList2)
        this.abilitysList2.forEach((item, index) => {
          const realAbilityData = findTheAbility(data, item.abilityId);
        //   console.log(realAbilityData)
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

        // this.switchHandler();
        // 获取列表最后一项：空气质量，的值
        const lastItem = data[data.length - 1];
        if (lastItem.abilityName === "空气质量") {
          this.AQI = lastItem.currValue;
        }
      });
    },


    // 707
    getAbilityData3(abilityId, which) {
      if (which === "left") {
        return this.abilitysList3.filter(item => item.dirValue === "280")[0];
      }
      if (which === "right") {
        return this.abilitysList3.filter(item => item.dirValue === "281")[0];
      }
      const result = this.abilitysList3.filter(
        item => item.abilityId == abilityId
      )[0];
      return result;
    },
    getIndexAbilityData3() {
      // 获取H5控制页面功能项数据，带isSelect参数
      getModelVo({ deviceId: 707, pageNo: 1 }).then(res => {
        if (res.code === 200 && res.data) {
          const data = res.data;
          Store.save("modelId",data.modelId)      
          this.pageName = data.pageName;

          this.formatItemsList3 = data.formatItemsList;

          data.abilitysList.forEach(item => {
            item["currValue"] = "";
            item.abilityOptionList &&
              item.abilityOptionList.forEach(iItem => {
                iItem.isChecked = false;
              });
          });
          this.abilitysList3 = data.abilitysList;
          // 定时请求接口数据，更新页面数据
          this.setInter3 = setInterval(() => {
            this.getIndexFormatData3();
          }, 1000);
          // 显示页面
        }
      });
    },
    getIndexFormatData3() {
      // 获取H5控制页面功能项数据，带isSelect参数
      // 根据功能项id筛选功能项
      const findTheAbility = (data, id) => {
        return data.filter(item => item.id == id)[0];
      };
      let ids = this.formatItemsList3
        .filter(item => item.showStatus == 1 && item.abilityId)
        .map(item => item.abilityId);
      newQueryDetailByDeviceId({
        deviceId: 707,
        abilityIds: ids
      }).then(res => {
        const data = res.data;
        // 将res.data中的isSelect和dirValue赋值过去
        this.abilitysList3.forEach((item, index) => {
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
      });
    },

    // 664
    getAbilityData4(abilityId, which) {
      if (which === "left") {
        return this.abilitysList4.filter(item => item.dirValue === "280")[0];
      }
      if (which === "right") {
        return this.abilitysList4.filter(item => item.dirValue === "281")[0];
      }
      const result = this.abilitysList4.filter(
        item => item.abilityId == abilityId
      )[0];
    //   console.log(result)
      return result;
    },
    getIndexAbilityData4() {
      // 获取H5控制页面功能项数据，带isSelect参数
      getModelVo({ deviceId: 664, pageNo: 1 }).then(res => {
        if (res.code === 200 && res.data) {
          const data = res.data;
          Store.save("modelId",data.modelId)      
          this.pageName = data.pageName;

          this.formatItemsList4 = data.formatItemsList;

          data.abilitysList.forEach(item => {
            item["currValue"] = "";
            item.abilityOptionList &&
              item.abilityOptionList.forEach(iItem => {
                iItem.isChecked = false;
              });
          });
          this.abilitysList4 = data.abilitysList;
          // 定时请求接口数据，更新页面数据
          this.setInter4 = setInterval(() => {
            this.getIndexFormatData4();
          }, 1000);
        }
      });
    },
    getIndexFormatData4() {
      // 获取H5控制页面功能项数据，带isSelect参数
      // 根据功能项id筛选功能项
      const findTheAbility = (data, id) => {
        return data.filter(item => item.id == id)[0];
      };
      let ids = this.formatItemsList4
        .filter(item => item.showStatus == 1 && item.abilityId)
        .map(item => item.abilityId);
      newQueryDetailByDeviceId({
        deviceId: 664,
        abilityIds: ids
      }).then(res => {
        const data = res.data;
        // 将res.data中的isSelect和dirValue赋值过去
        this.abilitysList4.forEach((item, index) => {
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
      });
    },


    // 141
    getAbilityData5(abilityId, which) {
      const result = this.abilitysList5.filter(
        item => item.abilityId == abilityId
      )[0];
      // console.log(result)
      return result;
    },
    getIndexAbilityData5() {
      // 获取H5控制页面功能项数据，带isSelect参数
      getModelVo({ deviceId: 141, pageNo: 1 }).then(res => {
        if (res.code === 200 && res.data) {
          const data = res.data;
        //   console.log(data)
          Store.save("modelId",data.modelId)      
          this.pageName = data.pageName;

          this.formatItemsList5 = data.formatItemsList;

          data.abilitysList.forEach(item => {
            item["currValue"] = "";
            item.abilityOptionList &&
              item.abilityOptionList.forEach(iItem => {
                iItem.isChecked = false;
              });
          });
          this.abilitysList5 = data.abilitysList;
          // 定时请求接口数据，更新页面数据
          this.setInter5 = setInterval(() => {
            this.getIndexFormatData5();
          }, 1000);
        }
      });
    },
    getIndexFormatData5() {
      // 获取H5控制页面功能项数据，带isSelect参数
      // 根据功能项id筛选功能项
      const findTheAbility = (data, id) => {
        return data.filter(item => item.id == id)[0];
      };
      let ids = this.formatItemsList5
        .filter(item => item.showStatus == 1 && item.abilityId)
        .map(item => item.abilityId);
      newQueryDetailByDeviceId({
        deviceId: 141,
        abilityIds: ids
      }).then(res => {
        const data = res.data;
        // console.log(data)
        // 将res.data中的isSelect和dirValue赋值过去
        this.abilitysList5.forEach((item, index) => {
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
      });
    },

    // 650
    getAbilityData6(abilityId, which) {
      if (which === "left") {
        return this.abilitysList6.filter(item => item.dirValue === "280")[0];
      }
      if (which === "right") {
        return this.abilitysList6.filter(item => item.dirValue === "281")[0];
      }
      const result = this.abilitysList6.filter(
        item => item.abilityId == abilityId
      )[0];
      return result;
    },
    getIndexAbilityData6() {
      // 获取H5控制页面功能项数据，带isSelect参数
      getModelVo({ deviceId: 650, pageNo: 1 }).then(res => {
        if (res.code === 200 && res.data) {
          const data = res.data;
          Store.save("modelId",data.modelId)      
          this.pageName = data.pageName;

          this.formatItemsList6 = data.formatItemsList;

          data.abilitysList.forEach(item => {
            item["currValue"] = "";
            item.abilityOptionList &&
              item.abilityOptionList.forEach(iItem => {
                iItem.isChecked = false;
              });
          });
          this.abilitysList6 = data.abilitysList;
          // 定时请求接口数据，更新页面数据
          this.setInter6 = setInterval(() => {
            this.getIndexFormatData6();
          }, 1000);
        }
      });
    },
    getIndexFormatData6() {
      // 获取H5控制页面功能项数据，带isSelect参数
      // 根据功能项id筛选功能项
      const findTheAbility = (data, id) => {
        return data.filter(item => item.id == id)[0];
      };
      let ids = this.formatItemsList6
        .filter(item => item.showStatus == 1 && item.abilityId)
        .map(item => item.abilityId);
      newQueryDetailByDeviceId({
        deviceId: 650,
        abilityIds: ids
      }).then(res => {
        const data = res.data;
        // 将res.data中的isSelect和dirValue赋值过去
        this.abilitysList6.forEach((item, index) => {
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
      });
    },


    // 629
    getAbilityData7(abilityId, which) {
      if (which === "left") {
        return this.abilitysList7.filter(item => item.dirValue === "280")[0];
      }
      if (which === "right") {
        return this.abilitysList7.filter(item => item.dirValue === "281")[0];
      }
      const result = this.abilitysList7.filter(
        item => item.abilityId == abilityId
      )[0];
      return result;
    },
    getIndexAbilityData7() {
      // 获取H5控制页面功能项数据，带isSelect参数
      getModelVo({ deviceId: 629, pageNo: 1 }).then(res => {
        if (res.code === 200 && res.data) {
          const data = res.data;
          Store.save("modelId",data.modelId)      
          this.pageName = data.pageName;

          this.formatItemsList7 = data.formatItemsList;

          data.abilitysList.forEach(item => {
            item["currValue"] = "";
            item.abilityOptionList &&
              item.abilityOptionList.forEach(iItem => {
                iItem.isChecked = false;
              });
          });
          this.abilitysList7 = data.abilitysList;
          // 定时请求接口数据，更新页面数据
          this.setInter7 = setInterval(() => {
            this.getIndexFormatData7();
          }, 1000);
        }
      });
    },
    getIndexFormatData7() {
      // 获取H5控制页面功能项数据，带isSelect参数
      // 根据功能项id筛选功能项
      const findTheAbility = (data, id) => {
        return data.filter(item => item.id == id)[0];
      };
      let ids = this.formatItemsList7
        .filter(item => item.showStatus == 1 && item.abilityId)
        .map(item => item.abilityId);
      newQueryDetailByDeviceId({
        deviceId: 629,
        abilityIds: ids
      }).then(res => {
        const data = res.data;
        // 将res.data中的isSelect和dirValue赋值过去
        this.abilitysList7.forEach((item, index) => {
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
      getWeather(662).then(res => {
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
    this.getIndexAbilityData1();
    this.getIndexAbilityData2();
    this.getIndexAbilityData3();
    this.getIndexAbilityData4();
    this.getIndexAbilityData5();
    this.getIndexAbilityData6();
    this.getIndexAbilityData7();
    this.getWeather();
  },
//   watch: {
//     isOpen(val) {
//       if (val) {
//         this.setWeather();
//       } else {
//         // 关机时，如果客户设置了关机图片就用，否则用默认背景
//         this.img = this.shutdown || "";
//       }
//     }
//   },
  destroyed() {
    clearInterval(this.setInter);
    clearInterval(this.setInter1);
    clearInterval(this.setInter2);
    clearInterval(this.setInter3);
    clearInterval(this.setInter4);
    clearInterval(this.setInter5);
    clearInterval(this.setInter6);
    clearInterval(this.setInter7);
    clearInterval(this.setInter8);
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
    height: 20px;
    font-size: 16px;
    line-height: 40px;
    text-align: left;
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
