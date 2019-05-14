<template>
  <div class="set-wrapper">
    <div class="header">
      <div class="return" @click="returnMethod"></div>
      <span>设备配置</span>
    </div>
    <div class="set-cell">
      <div class="cell-item border-bottom" @click="editDevFlag = true">
        <div class="cell-left">
          <span>设备管理名称</span>
        </div>
        <div class="cell-right">
          <span>{{ manageName }}</span>
        </div>
      </div>
    </div>
    <yd-accordion style="background: none;">
      <!-- <yd-accordion-item title="管理设备名">
        <div class="">
          <input type="text" placeholder="请输入用户名">
        </div>
      </yd-accordion-item> -->
      <yd-accordion-item title="转速配置" v-if="FsShow">
        <div class="ipt" slot="txt" style="color:#20aaf8; position: absolute; right: 30px;" @click="sendParamFunc(1)">保存</div>
        <div slot="txt" style="color:#20aaf8; position: absolute; right: 70px;" @click="sendParamFunc(2)">恢复默认</div>
        <div v-for="item in dirValueList1" :key="item.id">
          <div style="padding: .24rem; background: #f2f2f2;">
            <p>{{item.abilityName}}</p>
            <div>
              <table class="table">
                <tr>
                  <th>档位</th>
                  <th>转数</th>
                  <th>默认值</th>
                </tr>
                <tr v-for="ls in item.configValuesList" :key="ls.id">
                  <td>{{ls.definedName}}</td>
                  <td><input type="number" placeholder="请输入档位" v-model="ls.currentValue"></td>
                  <td>{{ls.defaultValue}}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </yd-accordion-item>
      <!-- <yd-accordion-item title="智能逻辑设置">
        <div style="padding: .24rem;"> -->
          <!-- <p>岱宗夫如何，齐鲁青未了。</p>
          <p>造化钟神秀，阴阳割昏晓。</p>
          <p>荡胸生层云，决眦入归鸟。</p>
          <p>会当凌绝顶，一览众山小。</p> -->
        <!-- </div>
      </yd-accordion-item> -->
      <yd-accordion-item title="智能算法设置">
        <div style="padding: .24rem;background: #f2f2f2; ">
          <yd-checkbox-group v-model="checkbox2">
            <yd-checkbox val="1">云端大数据联动</yd-checkbox>
            <yd-checkbox val="2">神经网络算法</yd-checkbox>
            <yd-checkbox val="3">模糊驱动算法</yd-checkbox>
            <yd-checkbox val="4">深度学习算法</yd-checkbox>
          </yd-checkbox-group>
          <p style="color: #b3b3b3;">*注：算法依赖于大量数据，不断完善</p>
        </div>
      </yd-accordion-item>
      <yd-accordion-item title="关联属性设置">
        <div style="padding: .24rem;background: #f2f2f2;">
          <img src="../../assets/gl.png" style="width: 100%;" />
          <yd-radio-group v-model="linkAgeStatus" :callback='linkStatusChanged' style="text-align: center; margin-top: 15px;" size='16'>
            <yd-radio val="1">
              <span style="font-size: 12px; ">设置关联</span>
            </yd-radio>
            <yd-radio val="2">
              <span style="font-size: 12px;">设置非关联</span>
            </yd-radio>
          </yd-radio-group>
        </div>
      </yd-accordion-item>
      <yd-accordion-item v-if='showAccordion()' title="主从设置">
        <div style="padding: .24rem;background: #f2f2f2;">
          <div>
            <span>组网设置:</span>
            <div class="switch-box" style="display: inline-block; margin-left: 20px; vertical-align: middle;">
              <span style="vertical-align: middle;">{{switch1 == true ? '主设备': '从设备' }}</span>
              <span style="vertical-align: middle;" @click="switch1=!switch1">
                <img src="../../assets/switch.png" style="height: 20px;vertical-align: middle" v-if="!switch1" />
                <img src="../../assets/switch2.png" style="height: 20px;vertical-align: middle" v-if="switch1" />
              </span>
            </div>
            <span style="float: right; color: #6fbff8; margin-left: 10px;" @click='delDev()' v-show='switch1'>删除</span>
            <span style="float: right; color: #6fbff8;" @click='addDev()' v-show='switch1'>+添加从设备</span>
          </div>
          <table class="table" style="margin-top: 5px;">
            <tr>
              <th>序号</th>
              <th>名称</th>
              <th>地址</th>
            </tr>
            <tr v-for='(item,index) in childDeviceArray' :key='item.id'>
              <td>{{index + 1}}</td>
              <td>{{item.deviceName}}</td>
              <td>{{item.childId}}</td>
            </tr>
          </table>
        </div>
      </yd-accordion-item>
      <yd-accordion-item title="设备个性设置">
        <div style="padding: .24rem;background: #f2f2f2;">
          <ul class="imglist">
            <li @click="imgLi(item)" v-for='item in ingList' :class={border:item.isSelect} :key="item.sort"><img :src="item.icon"></li>
          </ul>
          <template>
            
          </template>
        </div>
      </yd-accordion-item>
      <yd-accordion-item title="软件更新">
        <div style="padding: .24rem;background: #f2f2f2;">
          <yd-timeline>
            <yd-timeline-item>
              <p>出厂版本</p>

            </yd-timeline-item>

          </yd-timeline>
        </div>
      </yd-accordion-item>
      <yd-accordion-item title="恢复出厂设置">
        <div style="padding: .24rem; background: #f2f2f2;">
          <p style="color: #4d4d4d;">设置只针对高级设备配置选项内的参数设置部份，如需要软件退档类操作，恢复出厂设置是无了效的，望知悉！</p>
          <p style="color: #4d4d4d;">您确认需要恢复吗？恢复后，设置的参数将被清除重置！</p>
          <span class="comfirmBtn" style="height: 30px; width: 85px; background: #ff1d25; border-radius: 5px; display: block;margin: 10px auto;">确认恢复</span>
        </div>
      </yd-accordion-item>
      <yd-accordion-item title="帮助文件">
        <div style="padding: .24rem;background: #f2f2f2;">
          <table class="table2">
            <tr>
              <td>设备接线与安装</td>
              <td>查看</td>
              <td>
                <a href="#">下载</a>
              </td>
            </tr>
          </table>
        </div>
      </yd-accordion-item>
    </yd-accordion>
    <div class="create-dialog dialog" v-if="delDevFlag">
      <div class="confirm" style="padding: 0;">
        <div class="confim-top" style="text-align: left; color: #fff; padding: 0 10px 10px; ">
          <p style="padding-top:10px ;">请选择你需要删除的从设备：</p>
          <div>
            <yd-radio-group color="#00ff00" v-model="deleteTheDevice">
              <yd-radio v-for='item in childDeviceArray' :key='item.id' :val="item.id">
                <span style="color: #fff ">{{item.deviceName}}</span>
              </yd-radio>
            </yd-radio-group>
          </div>
        </div>
        <div class="confim-bottom">
          <div class="but" @click="delDevFlag = false">取消</div>
          <div class="but create" @click="deleteChildDevice">确定</div>
        </div>
      </div>
    </div>
    <!-- 修改名称 -->
    <div class="create-dialog dialog" v-if="editDevFlag">
      <div class="confirm">
        <div class="confim-top">
          <textarea class="name" v-model="manageName" v-text="manageName"></textarea>
        </div>
        <div class="confim-bottom">
          <div class="but" @click="editDevFlag = false">取消</div>
          <div class="but create" @click="editDev">确定</div>
        </div>
      </div>
    </div>
    <div class="create-dialog dialog" v-if="addDevFlag">
      <div class="confirm" style="padding: 0;">
        <div class="confim-top" style="text-align: left; color: #fff; padding:20px 10px; ">
          <div class="flex flex-align-center">
            <label>设备名称:</label>
            <input v-model='deviceName' type="text" class="flex-1" style="background: #fff; border-radius: 5px; border: none; line-height: 30px;" />
          </div>
          <div class="flex flex-align-center" style="margin-top: 10px;">
            <label>设备地址:</label>
            <input v-model='deviceChildId' type="text" class="flex-1" style="background: #fff; border-radius: 5px; border: none; line-height: 30px;" />
          </div>
          <div class="flex flex-align-center" style="margin-top: 10px;">
            <label>设备型号:</label>
            <select class='select' v-model='modelSelected'>
              <option v-for='item in modelList' :key='item.id' :value='item.id'>{{item.name}}</option>
            </select>
          </div>
        </div>
        <div class="confim-bottom">
          <div class="but" @click="addDevFlag = false">取消</div>
          <div class="but create" @click="createChildDevice">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Loading, Alert, Toast } from "vue-ydui/dist/lib.rem/dialog";
import myUrl from "common/js/api";
import Vue from "vue";
import { Accordion, AccordionItem } from "vue-ydui/dist/lib.rem/accordion";
import { CheckBox, CheckBoxGroup } from "vue-ydui/dist/lib.rem/checkbox";
import { Radio, RadioGroup } from "vue-ydui/dist/lib.rem/radio";
import { TimeLine, TimeLineItem } from "vue-ydui/dist/lib.rem/timeline";
import { Switch } from "vue-ydui/dist/lib.rem/switch";
import {
  childDeviceList,
  getToken,
  addChildDevice,
  delChildDevice,
  modelList,
  getModelVo,
  sendParamFunc,
  paramList,
  queryDeviceBack,
  editManageName,
  queryDeviceIconList,
  setDeviceIcon,
  setLinkStatus
} from "../wenkong/api";
import Store from "../wenkong/store";
export default {
  data() {
    return {
      radio:"1",
      editDevFlag: false,
      manageName: "",
      inItems: [],
      outItems: [],
      isEdit: false,
      open: 0,
      checkbox2: [],
      linkAgeStatus: 1,
      switch1: true,
      delDevFlag: false,
      addDevFlag: false,
      FsShow:true,
      pwd: '',
      pwdList: [],
      childDeviceArray: [],
      modelList: [],
      modelSelected: "1",
      deviceChildId: "",
      deviceId: this.$route.query.deviceId,
      customerId:Store.fetch("modelId"),
      deviceName: "",
      deleteTheDevice: "",
      dirValueList: [],
      dirValueList1: [],
      status: true,
      deviceName: "",
      ingList:[]
    };
  },
  methods: {
    imgLi(val){
      setDeviceIcon({'deviceId':this.deviceId,"iconSelect":val.sort}).then(res=>{
        if(res.code == 200){
           Toast({
            mes: "设置成功",
            timeout: 1500,
            icon: "success"
          });
          this.queryDeviceIconList()
        }
      })
    },
    showAccordion() {
      // 显示从设备添加入口？
      // 如果从主设备版式（目前是新风版式）跳转过来，则显示；其他情况不显示
      return this.$route.query.masterFormat == 1;
    },
    goBack() {
      history.back();
    },
    createChildDevice() {
      addChildDevice({
        hostDeviceId: this.deviceId,
        childId: this.deviceChildId,
        deviceName: this.deviceName,
        modelId: this.modelSelected
      })
        .then(res => {
          Toast({
            mes: "添加成功！",
            timeout: 1500,
            icon: "success"
          });
          this.childDeviceArray.push({
            deviceName: this.deviceName,
            childId: this.deviceChildId,
            id: res.data
          });
          this.addDevFlag = false;
        })
        .catch(err => {
          Alert({
            mes: `添加失败：${err.msg}`
          });
        });
    },
    deleteChildDevice() {
      delChildDevice(this.deleteTheDevice)
        .then(res => {
          Toast({
            mes: "删除成功！",
            timeout: 1500,
            icon: "success"
          });
          this.childDeviceArray = this.childDeviceArray.filter(
            item => item.id !== this.deleteTheDevice
          );
          this.delDevFlag = false;
        })
        .catch(err => {
          Alert({
            mes: `删除失败：${err.msg}`
          });
        });
    },
    returnMethod() {
      this.$router.back(-1);
    },
    addDev() {
      this.addDevFlag = true;
    },
    delDev() {
      this.delDevFlag = true;
    },
    childDeviceList() {
      childDeviceList(this.deviceId).then(res => {
        this.childDeviceArray = res.data;
      });
    },
    queryDeviceIconList() {
      queryDeviceIconList(this.deviceId).then(res => {
        // console.log(res.data)
        this.ingList = res.data
      });
    },
    getModelList() {
      modelList(this.customerId).then(res => {
        this.modelList = res.data;
        this.modelSelected = res.data[0].id;
      });
    },
    // 修改设备名称
    editDev() {
      editManageName({ deviceId: this.deviceId, deviceName: this.manageName })
        .then(res => {
          this.editDevFlag = false;
        })
        .catch(() => {
          Toast({
            mes: "名称修改失败",
            timeout: 1000,
            icon: "error"
          });
          this.editDevFlag = false;
        });
    },
    //获取转速值
    paramList() {
      Loading.open("很快加载好了");
      paramList({ deviceId: this.deviceId, typeName: "C10" })
        .then(res => {
          Loading.close()
          this.dirValueList1 = res.data
          if(this.dirValueList1.length == 0){
            this.FsShow = false
          }
          for (var i = 0; i < this.dirValueList.length; i++) {
            this.dirValueList1[i].abilityName = this.dirValueList[
              i
            ].abilityName;
          }
        })
        .catch(() => {
          Loading.close();
        });
    },
    //设备参数修改
    sendParamFunc(id) {
      this.status = true;
      let paramConfigList = [];
      if (id == 1) {
        for (var i = 0; i < this.dirValueList1.length; i++) {
          var valuesList = {};
          const list = this.dirValueList1[i].configValuesList;
          var defaultValue = [];
          for (var j = 0; j < list.length; j++) {
            if (list[j].currentValue == "") {
              defaultValue.push(Number(list[j].defaultValue));
            } else {
              var s = list[j].currentValue;
              if (s < list[j].maxValue && s > list[j].minValue) {
                defaultValue.push(Number(list[j].currentValue));
              } else {
                Toast({
                  mes:
                    this.dirValueList1[i].abilityName +
                    " " +
                    list[j].definedName +
                    "最小值为" +
                    list[j].minValue +
                    "最大值为" +
                    list[j].maxValue,
                  timeout: 2000,
                  icon: "error"
                });
                this.status = false;
              }
            }
          }
          valuesList.sort = i;
          valuesList.valuesList = defaultValue;
          paramConfigList.push(valuesList);
          // console.log(paramConfigList)
        }
      } else {
        for (var i = 0; i < this.dirValueList1.length; i++) {
          var valuesList = {};
          const list = this.dirValueList1[i].configValuesList;
          var defaultValue = [];
          for (var j = 0; j < list.length; j++) {
            defaultValue.push(Number(list[j].defaultValue));
          }
          valuesList.sort = i;
          valuesList.valuesList = defaultValue;
          paramConfigList.push(valuesList);
          // console.log(paramConfigList)
        }
      }
      if (this.status) {
        sendParamFunc({
          deviceId: this.deviceId,
          abilityTypeName: "C10",
          paramConfigList: paramConfigList
        }).then(res => {
          // console.log(res)
          // this.queryDeviceBack()
          this.paramList();
          Toast({
            mes: "指令发送成功！",
            timeout: 1000,
            icon: "success"
          });
        });
      }
    },
    // 判断设备是否接收参数
    queryDeviceBack() {
      Loading.open("很快加载好了");
      queryDeviceBack({
        deviceId: this.deviceId,
        typeName: "C10"
      })
        .then(res => {
          Loading.close();
          // this.paramList()
          // console.log(res)
          if (res.data) {
            Toast({
              mes: "设备收到配置",
              timeout: 1000,
              icon: "success"
            });
            this.paramList();
          } else {
            Toast({
              mes: "设备未收到配置",
              timeout: 1000,
              icon: "error"
            });
          }
        })
        .catch(() => {
          Loading.close();
        });
    },
    // 获取总数据
    getModelVo() {
      // 获取H5控制页面功能项数据，带isSelect参数
      getModelVo({ deviceId: this.deviceId, pageNo: 1 }).then(res => {
        if (res.code == 200 && res.data) {
          this.manageName = res.data.manageName;
          const data = res.data;

          // 将功能集里的内外风机的数据加到版式集合中。为了后面持续刷新两个风机的数据
          let windData = [];
          data.abilitysList.forEach(item => {
            if (item.dirValue === "280" || item.dirValue === "281") {
              windData.push({
                ...item,
                showStatus: 1
              });
            }
          });

          this.formatItemsList = data.formatItemsList.concat(windData);

          this.abilitysList = data.abilitysList;
          for (var i = 0; i < this.abilitysList.length; i++) {
            const dirValue = this.abilitysList[i].dirValue.substring(0, 3);
            if (dirValue == "C10") {
              this.dirValueList.push(this.abilitysList[i]);
            }
          }
          this.paramList();
        }
      });
    },
    initLinkAgeStatus() {
      // 初始化设备关联状态
      const status = Store.fetch("linkAgeStatus");
      this.linkAgeStatus = status == 1 ? 1 : 2;
    },
    linkStatusChanged(linkAgeStatus) {
      setLinkStatus({
        deviceId: this.deviceId,
        linkAgeStatus: Number(linkAgeStatus),
        teamId: Number(Store.fetch("teamId"))
      }).then(() => {
        Toast({
          mes: "设置成功",
          timeout: 1500,
          icon: "success"
        });
        Store.save("linkAgeStatus", linkAgeStatus);
      });
    }
  },
  created() {
    Loading.open("很快加载好了");
    setTimeout(() => {
      Loading.close();
    }, 300);
    this.childDeviceList();
    this.getModelList();
    this.getModelVo();
    this.queryDeviceIconList()
    this.initLinkAgeStatus();
  },
  components: {
    "yd-accordion": Accordion,
    "yd-accordion-item": AccordionItem,
    "yd-checkbox-group": CheckBoxGroup,
    "yd-checkbox": CheckBox,
    "yd-radio-group": RadioGroup,
    "yd-radio": Radio,
    "yd-timeline-item": TimeLineItem,
    "yd-timeline": TimeLine,
    "yd-switch": Switch
  },
  watch: {
    pwd: function() {
      if (this.pwd && this.pwd.length > 0) {
        if (this.pwd.length >= 4) {
          this.pwd = this.pwd.slice(0, 4);
        }
        this.pwdList = this.pwd.split("");
      } else {
        this.pwdList = [];
      }
    }
  },
  mounted() {
    // this.getConfigInfo();
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/common/scss/variable.scss";
@import "src/common/scss/mixins.scss";
.set-wrapper {
  .set-cell {
    padding-top: 10px;
    background: #fff;
    .cell-item {
      position: relative;
      display: flex;
      overflow: hidden;
      margin-bottom: 10px;
      font-size: 14px;
      &.white {
        background: #ffffff;
        padding-top: 15px;
        padding-bottom: 15px;
        margin-bottom: 10px;
        .cell-right {
          &::after {
            top: 16px;
          }
        }
      }
      &.border-bottom {
        padding-bottom: 15px;
        &::after {
          content: "";
          margin-left: 15px;
          position: absolute;
          z-index: 0;
          bottom: 0;
          left: 0;
          width: 100%;
          border-bottom: 1px solid #d9d9d9;
          transform: scaleY(0.5);
          transform-origin: 0 0;
        }
      }
      .cell-left {
        padding-left: 15px;
        display: flex;
        align-items: center;
      }
      .cell-right {
        flex: 1;
        justify-content: flex-end;
        text-align: right;
        padding-right: 40px;
        &::after {
          display: block;
          color: #c9c9c9;
          content: "";
          width: 8px;
          height: 15px;
          background: url("../../assets/arr-right.png") no-repeat center center;
          background-size: 8px 15px;
          position: absolute;
          right: 20px;
          top: 3px;
        }
        & span {
          color: #999999;
        }
      }
    }
  }
  input {
    border: none;
    text-indent: 4em;
  }
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  .box {
    height: 40px;
    width: 40px;
    border: 1px solid #fff;
    display: block;
    line-height: 40px;
  }
  .flex {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
  }
  .flex-v {
    -webkit-box-orient: vertical;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
  }
  .flex-1 {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }
  .flex-align-center {
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
  }
  .flex-pack-center {
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
  }
  .flex-pack-justify {
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
  }
  .dialog {
    position: fixed;
    z-index: 2000;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    .confirm {
      width: 80%;
      background-color: #ffffff;
      border-radius: 5px;
      font-size: 15px;
      overflow: hidden;
      animation: zoom-in 0.15s ease forwards;
      .confim-top {
        padding-top: 20px;
        padding-bottom: 20px;
        background: #2689ee;
        color: #ffffff;
        text-align: center;
        position: relative;
        overflow: hidden;
        .title {
          line-height: 35px;
          font-size: 16px;
          font-weight: normal;
          border-bottom: 1px solid #6fa7f1;
        }
        .name {
          text-align: left;
          width: 100%;
          padding-left: 15px;
          padding-right: 15px;
          background: none;
          float: left;
          border: none;
          color: #93c4f7;
          font-size: 14px;
          min-height: 100px;
        }
        & p {
          line-height: 24px;
          &:nth-child(1) {
            font-size: 16px;
            margin-bottom: 5px;
          }
        }
        & ul {
          width: 205px;
          margin: 0 auto;
          & li {
            text-align: left;
            & p {
              display: inline-block;
              text-align: left;
              font-size: 14px !important;
              margin-bottom: 0px !important;
            }
          }
        }
      }
      .confim-bottom {
        background: #ffffff;
        padding: 20px 20px;
        position: relative;
        overflow: hidden;
        font-size: 14px;
        .but {
          width: 46%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border: 1px solid #2689ee;
          color: #2689ee;
          border-radius: 5px;
          float: left;
          &:nth-child(2) {
            float: right;
            &.create {
              background: #2689ee;
              color: #ffffff;
            }
          }
        }
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
    .edit {
      position: absolute;
      right: 15px;
    }
  }
  .yd-accordion {
    background: none;
    & > div {
      margin-bottom: 10px;
      background: #fff;
    }
    .table {
      width: 100%;
      table-layout: fixed;
      text-align: center;
      border: 1px solid #b6b6b6;
      border-collapse: collapse;
    }
    .table tr th,
    .table tr td {
      border: 1px solid #b6b6b6;
      height: 30px;
    }
    .table2 {
      width: 100%;
      table-layout: fixed;
      text-align: center;
      border-collapse: collapse;
    }
    .table2 a {
      text-decoration: underline;
      color: #3fa9f5;
    }
    .yd-checkbox {
      width: 48%;
      margin-bottom: 20px;
    }
  }
  .comfirmBtn {
    color: #fff;
    text-align: center;
    line-height: 30px;
  }
  .config-wrapper {
    position: absolute;
    top: 40px;
    bottom: 0px;
    height: auto;
    background: #ffffff;
    left: 0;
    width: 100%;
    padding-left: 15px;
    padding-right: 15px;
    .cell-header {
      display: flex;
      border-bottom: 1px solid #d9d9d9;
      padding-left: 10px;
      .cell-value {
        flex: 1;
        text-align: left;
        font-size: 16px;
        line-height: 40px;
        color: #1fb1fb;
      }
    }
    .cell-content {
      display: flex;
      border-bottom: 1px solid #d9d9d9;
      .cell-txt {
        flex: 1;
        text-align: left;
        font-size: 12px;
        line-height: 30px;
        padding-left: 10px;
        border-right: 1px solid #d9d9d9;
        &:last-child {
          border-right: none;
        }
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
  .imglist li {
    height: 60px;
    width: 60px;
    border-radius: 100%;
    overflow: hidden;
    background: #fff;
    display: inline-block;
    margin-right: 20px;
  }
  .imglist li img {
    display: block;
    width: 100%;
  }
}
.border{
  border: 2px solid #67c23a
}
</style>