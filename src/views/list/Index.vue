<template>
  <div class="list-wrapper">
    <yd-accordion style="position: relative;padding-bottom: 50px;" v-if="teamList.length">
      <yd-accordion-item open="open" v-for="(item,index) in teamList" :key="index" v-swipeleft="swipeTeamLeft" v-swiperight="swipeTeamRight">
        <div slot="title">
          <img class='team-icon' :src="item.icon" />
          <span>{{item.teamName}}</span>
        </div>
        <div slot="txt" style="color:#20aaf8;margin-left:5px; position: absolute; right: 150px;" v-show="groupFlag" @click="openTeam(item.teamId)">组开
        </div>
        <div slot="txt" style="color:#20aaf8;margin-left:5px; position: absolute; right: 180px;" v-show="groupFlag" @click="teamShare(item.teamId)">组分享
        </div>
        <div slot="txt" style="color:#20aaf8;margin-left:5px; position: absolute; right: 120px;" v-show="groupFlag" @click="closeTeam(item.teamId)">组关
        </div>
        <div slot="txt" style="color:#20aaf8;margin-left:5px; position: absolute; right: 90px;" v-show="groupFlag" @click="OpenGroup(item)">编辑
        </div>
        <div slot="txt" style="color:#20aaf8;margin-left:5px; position: absolute; right: 60px;" v-show="groupFlag" @click="deleteTeam(item.teamId)">删除
        </div>
        <div slot="txt" style="color:#20aaf8;margin-left:5px; position: absolute; right: 30px;" v-show="groupFlag" @click="groupFlag = false">取消
        </div>
        <div style="padding:0px 15px">
          <div class="list-item" style="padding:15px 0px;" v-swipeleft.stop="swipeleft" v-swiperight="swiperight" @click="intoIndex(child,item)" v-for="(child,cindex) in item.deviceItemPos" :key="cindex">
            <div class="item-left">
              <div class="img">
                <div class="p-img">
                  <img :src="child.icon">
                  <span v-if="child.onlineStatus === 1">
                    <em>在线</em>
                  </span>
                  <span class="active" v-else>
                    <em>离线</em>
                  </span>
                </div>
                <!-- <div class="img-text">
                  <p>
                    <span class="img-text1">{{ child.deviceName }}</span>
                    <i class="addr" v-if="loopValue === false && child.location"></i>
                    <span v-if="loopValue === false">{{child.location && child.location.split(' ').map(str => str.split(',')).reduce((a, b) => a.concat(b),[]) .filter(s => s !== '')[0]}}</span>
                    <img v-if='child.onlineStatus && child.powerStatus' class='power-status' src='../../assets/power-open.png'>
                    <img v-if='child.onlineStatus && !child.powerStatus' class='power-status' src='../../assets/power-close.png'>
                  </p>
                  <template v-if='child.hasOwnProperty("childId")'>
                    <p><span>从设备ID:{{ child.childId }}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>主设备ID:{{child.masterDeviceId}}</span></p>
                    <p>主机型号:{{child.deviceModelName}}</p>
                  </template>
                  <template v-else>
                    <p>ID:{{ child.deviceId }}</p>
                    <p>型号：{{ child.deviceModelName }}</p>
                  </template>
                </div> -->
                <div class="img-text">
                  <p>
                    <span class="img-text1" style="font-size:16px;">
                      <img v-if='child.onlineStatus && child.powerStatus' class='power-status' src='../../assets/power-open.png'>
                      <img v-if='child.onlineStatus && !child.powerStatus' class='power-status' src='../../assets/power-close.png'>
                      {{ child.deviceName }}
                    </span>
                    <span class="img-text2">
                      <i class="addr" v-if="loopValue === false && child.location"></i>
                      <span v-if="loopValue === false" style="font-size:12px">{{child.location && child.location.split(' ').map(str => str.split(',')).reduce((a, b) => a.concat(b),[]) .filter(s => s !== '')[0]}}</span>
                    </span>
                  </p>
                  <template v-if='child.hasOwnProperty("childId")'>
                    <p  style="margin:8px 0px;"><span>从ID:{{ child.childId }}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span style="margin-left:20px" >主ID:{{child.masterDeviceId}}</span></p>
                    <p>主机型号:{{child.deviceModelName}}</p>
                  </template>
                  <template v-else>
                    <p>ID:{{ child.deviceId }}</p>
                    <p>型号：{{ child.deviceModelName }}</p>
                  </template>
                </div>
              </div>
            </div>
            <div class='item-right' v-if='!child.hasOwnProperty("childId")'>
              <span class="group" v-if="loopValue === true" @click.stop="OpenDev(child,item.teamId,1)">分组</span>
              <span class="edit" v-if="loopValue === true" @click.stop="OpenDev(child,2)">编辑</span>
              <span class="delete" v-if="loopValue === true" @click.stop="deleteDev(child)" style="color: #a0a0a0;">删除</span>
              <!-- <p>{{child.listShowName}}</p>
              <p>{{child.listShowValue}}{{child.listShowUnit}}</p> -->
            </div>
          </div>
          <div v-if="item.deviceItemPos.length === 0">暂无产品</div>
        </div>
      </yd-accordion-item>
    </yd-accordion>
    <div v-else style="padding:10px 10px;">暂无产品</div>
    <div class="fixed-bottom">
      <div class="group">
        <div class="active" @click="qRcode" v-if="!loopValue">
          <p class="ssa">扫码添加</p>
        </div>
        <div class="active" v-else @click="selctButtonMethod(1,'cancel')">取消分组</div>
        <div class="" @click="selctButtonMethod(0,'create')">
          <p class="ssa1">新建分组</p>
        </div>
      </div>
    </div>
    <div class="wx-dialog dialog" v-if="wxValue">
      <div class="confirm">
        <div class="confim-top">
          <p>设备联网提示</p>
          <ul>
            <li>
              <p>1.请打开设备电源</p>
            </li>
            <li>
              <p>2.长按设备上的配置按钮3秒以上</p>
            </li>
            <li>
              <p>3.听到‘滴’声后点击下一步</p>
            </li>
          </ul>
        </div>
        <div class="confim-bottom">
          <div class="but" @click="wxValue = false">取消</div>
          <div class="but">下一步</div>
        </div>
      </div>
    </div>
    <div class="create-dialog dialog" v-if="createValue">
      <div class="confirm">
        <div class="confim-top">
          <textarea class="name" placeholder="在此输入新建分组的名称" v-model="teamName"></textarea>
        </div>
        <div class="confim-bottom">
          <div class="but" @click="createValue = false">取消</div>
          <div class="but create" @click="addGroup">确定</div>
        </div>
      </div>
    </div>
    <div class="create-dialog dialog" v-if="editDevFlag">
      <div class="confirm">
        <div class="confim-top">
          <textarea class="name" style="min-height:50px;" placeholder="输入新设备的名称" v-model="devInfo.deviceName"></textarea>
        </div>
        <div class="confim-bottom">
          <div class="but" @click="editDevFlag = false">取消</div>
          <div class="but create" @click="editDev">确定</div>
        </div>
      </div>
    </div>
    <div class="create-dialog dialog" v-if="teamNameFlag">
      <div class="confirm">
        <div class="confim-top">
          <textarea class="name" style="min-height:50px;" placeholder="输入组的名称" v-model="groupInfo.teamName"></textarea>
        </div>
        <div class="confim-bottom">
          <div class="but" @click="teamNameFlag = false">取消</div>
          <div class="but create" @click="updateTeamName">确定</div>
        </div>
      </div>
    </div>
    <div class="create-dialog dialog" v-if="groupDialog">
      <div class="confirm" style="padding: 0;">
        <div class="confim-top" style="text-align: left; color: #fff; padding: 0 10px 10px; ">
          <h4 class="title">{{selname}}</h4>
          <p style="padding-top:10px ;">请选择组：</p>
          <div>
            <yd-radio-group v-model="selectId" color="#00ff00">
              <yd-radio :val="item.teamId" v-if="currentTeamId != item.teamId" style="margin-top:10px;width:100%;color: #fff " v-for="(item,index) in teamList" :key="index">{{ item.teamName }}
              </yd-radio>
            </yd-radio-group>
          </div>
        </div>
        <div class="confim-bottom">
          <div class="but" @click="cancelGroup">取消</div>
          <div class="but create" @click="editGroup">确定</div>
        </div>
      </div>
    </div>
    <!--删除设备-->
    <div class="create-dialog dialog" v-if="delDevFlag">
      <div class="confirm">
        <div class="confim-top">
          <p style="padding:10px;">您确认要解除该设备的绑定吗？</p>
        </div>
        <div class="confim-bottom">
          <div class="but" @click="delDevFlag = false">取消</div>
          <div class="but create" @click="confirmdeleteDev">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Loading, Toast, Confirm } from "vue-ydui/dist/lib.rem/dialog";
import { Accordion, AccordionItem } from "vue-ydui/dist/lib.rem/accordion";
import { getQueryString } from "utils";
import { scanQRCode } from "utils/wx";
import { Radio, RadioGroup } from "vue-ydui/dist/lib.rem/radio";
import {
  obtainMyDevice,
  createTeam,
  deleteTeam,
  updateTeamName,
  editDevice,
  updateDeviceTeam,
  share,
  childDeviceList,
  deleteDevice,
  getBgImgs,
  teamControl,
  teamShare
} from "../wenkong/api";
import Store from "../wenkong/store";

export default {
  data () {
    return {
      currentTeamId: "",
      selectId: "", // 选择需要的分组id
      groupDialog: false,
      teamNameFlag: false,
      groupFlag: false,
      value: "",
      loop: null, // 长按
      loopValue: false,
      select: 0,
      wxValue: false,
      createValue: false,
      editDevFlag: false,
      teamName: "",
      devInfo: {},
      groupInfo: {},
      devName: "",
      devGroupList: [],
      devIds: [], // 选中设备id列表
      delDevFlag: false,
      deviceId: "",
      customerId: this.$route.query.customerId,
      deleteTheDeviceId: "", //将要删除的设备id
      deleteTheDeviceName: "",
      selname: "",
      teamList: [],
      editingDeviceData: [],
      // forbidBack:''
    };
  },

  methods: {
    teamShare(teams){
      this.$router.push({
        path: "/teamShare",
        query: {
          teamID: teams,
          // customerId: this.customerId
        }
      });
    },
    // forbidBack () {
    //         window.history.pushState('forward', null, '#');
    //         // alert(1)
    //         window.history.forward(1);
    // },
    obtainMyDevice () {
      obtainMyDevice().then(res => {
        const data = res.data;
        this.teamList = data.teamDataList;
        data.teamDataList.forEach(team => {
          const deviceList = team.deviceItemPos;
          if (!deviceList || deviceList.length === 0) {
            return;
          }
          // 如果设备存在从设备，调接口
          deviceList.forEach(device => {
            if (device.childDeviceCount === 0) {
              return;
            }
            if (device.deviceId == 1 || device.deviceId == 11 || device.deviceId == 12 || device.deviceId == 13 || device.deviceId == 14) {

            } else {
              this.childDeviceList(device.deviceId, deviceList,device.onlineStatus);
            }
          });
        });
      });
    },
    /**
     * 获取主设备id下的从设备
     */
    childDeviceList (id, data,datas) {
      childDeviceList(id).then(res => {
        res.data.forEach(item => {
          item["deviceId"] = item.id;
          item["masterDeviceId"] = id;
          item.onlineStatus= datas
        });

        // 找到主设备的index
        let parentIndex = 0;
        let ok = false;
        data.forEach((item, index) => {
          if (ok) {
            return;
          }
          if (item.deviceId === id) {
            parentIndex = index;
            ok = true;
          }
        });
        // 将从设备插入到主设备的后面
        data.splice(parentIndex + 1, 0, ...res.data);
      });
    },
    cancelGroup () {
      this.groupDialog = false;
      this.selectId = "";
    },
    qRcode () {
      scanQRCode();
    },
    swipeleft (s, e) {
      // 左滑动
      this.loopValue = true;
      this.groupFlag = false;
    },
    swiperight (s, e) {
      // 右滑动
      this.loopValue = false;
    },
    swipeTeamLeft (s, e) {
      this.groupFlag = true;
    },
    swipeTeamRight (s, e) {
      this.groupFlag = false;
    },
    returnMethod () {
      this.$router.back(-1);
    },
    updateTeamName () {
      Loading.open("很快加载好了");
      const teamId = this.groupInfo.teamId;
      const teamName = this.groupInfo.teamName;
      updateTeamName({
        teamId,
        teamName
      })
        .then(res => {
          if (res.code === 200) {
            Loading.close();
            this.teamNameFlag = false;
            this.teamList.forEach(item => {
              if (item.teamId === teamId) {
                item.teamName = teamName;
              }
            });
          }
        })
        .catch(error => {
          Loading.close();
          this.$toast(error.msg, "bottom");
        });
    },
    deleteTeam (id) {
      Confirm({
        title: "删除组",
        mes: "删除后无法恢复，确认删除？",
        opts: () => {
          deleteTeam({
            value: id
          })
            .then(res => {
              if (res.code === 200) {
                Toast({
                  mes: "删除成功",
                  timeout: 1500,
                  icon: "success"
                });
                this.teamList = this.teamList.filter(
                  item => item.teamId !== id
                );
                Loading.close();
              }
            })
            .catch(error => {
              Loading.close();
            });
        }
      });
    },
    editGroup () {
      if (this.selectId === "") {
        this.$toast("请选择组", "bottom");
      } else {
        const deviceId = this.devInfo.wxDeviceId;
        updateDeviceTeam({
          teamId: this.selectId,
          deviceIds: [deviceId]
        })
          .then(res => {
            if (res.code === 200) {
              Toast({
                mes: "分组成功",
                timeout: 1500,
                icon: "success"
              });

              // 首先从当前组中移除，然后添加到目标组中
              this.teamList.forEach(team => {
                if (team.teamId === this.currentTeamId) {
                  team.deviceItemPos = team.deviceItemPos.filter(
                    item => item.wxDeviceId !== deviceId
                  );
                  return;
                }

                if (team.teamId === this.selectId) {
                  team.deviceItemPos.push(this.editingDeviceData);
                }
              });

              this.groupDialog = false;
              this.selectId = "";
              Loading.close();
            }
          })
          .catch(error => {
            Loading.close();
          });
      }
    },
    deleteDev (obj) {
      this.delDevFlag = true;
      this.deleteTheDeviceId = obj.deviceId;
      this.deleteTheDeviceName = obj.deviceName;
    },
    confirmdeleteDev () {
      Loading.open("很快加载好了");
      deleteDevice({
        value: this.deleteTheDeviceId
      })
        .then(res => {
          if (res.code === 200) {
            Toast({
              mes: "删除成功",
              timeout: 1500,
              icon: "success"
            });
            Loading.close();
            this.obtainMyDevice();
            this.delDevFlag = false;
          }
        })
        .catch(error => {
          Loading.close();
        });
    },
    gtouchstart () {
      let that = this;
      that.loop = setTimeout(function () {
        that.loopValue = true;
      }, 3000);
      return false;
    },
    gtouchmove () {
      clearTimeout(this.loop); // 清除定时器
      this.loopValue = false;
    },
    gtouchend () {
      clearTimeout(this.loop); // 清除定时器
      if (this.loopValue) {
      }
      return false;
    },
    selctButtonMethod (nums, type) {
      this.select = nums;
      if (type === "cancel") {
        this.loopValue = false;
        this.groupFlag = false;
        this.select = 0;
      } else if (type === "wx") {
        this.wxValue = true;
      } else if (type === "create") {
        this.createValue = true;
      }
    },
    addGroup () {
      if (this.teamName === null || this.teamName === "") {
        this.$toast("请输入设备组名称", "bottom");
        return;
      }

      Loading.open("很快加载好了");
      createTeam({
        teamName: this.teamName
      })
        .then(res => {
          if (res.code === 200) {
            Loading.close();
            this.teamList.push({
              teamName: this.teamName,
              teamId: res.data,
              deviceItemPos: []
            });
            this.createValue = false;
          }
        })
        .catch(error => {
          Loading.close();
        });
    },
    OpenGroup (obj) {
      this.teamNameFlag = true;
      this.groupInfo = Object.assign({}, obj);
    },
    openTeam (teamId) {
      // 小组设备全部开启
      teamControl({
        funcId: "210",
        value: "1",
        teamId
      }).then(() => {
        Toast({
          mes: "组设备开启成功！",
          timeout: 1500,
          icon: "success"
        });
        this.obtainMyDevice();
      });
    },
    closeTeam (teamId) {
      // 小组设备全部关闭
      teamControl({
        funcId: "210",
        value: "0",
        teamId
      }).then(() => {
        Toast({
          mes: "组设备关闭成功！",
          timeout: 1500,
          icon: "success"
        });
        this.obtainMyDevice();
      });
    },
    OpenDev (obj, id, type) {
      if (id + "") {
        this.currentTeamId = id;
      }
      this.selname = obj.deviceName;
      if (type === 1) {
        this.groupDialog = true;
      } else {
        this.editDevFlag = true;
      }
      this.devInfo = Object.assign({}, obj);
      this.editingDeviceData = obj;
    },
    editDev () {
      Loading.open("很快加载好了");
      const deviceName = this.devInfo.deviceName;
      editDevice({
        deviceId: this.devInfo.deviceId,
        deviceName
      })
        .then(res => {
          if (res.code === 200) {
            Loading.close();
            this.editDevFlag = false;
            this.editingDeviceData.deviceName = deviceName;
          }
        })
        .catch(error => {
          Loading.close();
          this.$toast(error.msg, "bottom");
        });
    },
    intoIndex (child, team) {
      Store.save("customerName", child.customerName);
      Store.save("customerId", this.customerId);
      Store.save("deviceName", child.deviceName);
      Store.save("formatName", child.formatName);
      Store.save("teamId", team.teamId);
      Store.save("icon", child.icon);

      Store.save("deviceId", child.deviceId || child.id);
      Store.save("MAC", child.mac);
      Store.save("wxDeviceId", child.wxDeviceId);
      Store.save("linkAgeStatus", child.linkAgeStatus);

      Store.save("masterDeviceId", child.masterDeviceId);
      const query = {
        wxDeviceId: child.wxDeviceId,
        deviceId: child.deviceId || child.id,
        customerId: this.customerId,
        masterDeviceId: child.masterDeviceId,
        hostPowerStatus: child.hostPowerStatus,
        hasChildren: Boolean(child.childDeviceCount) ? 1 : 0
      };

      if (child.formatName === "电子净化器") {
        this.$router.push({
          path: "/air-purifier",
          query
        });
      } else if (child.formatName === "温控器") {
        this.$router.push({
          path: "/wenkongindex",
          query
        });
      } else if (child.formatName === "智慧新风-单风机") {
        // 智慧新风
        this.$router.push({
          path: "/indexsingle",
          query
        });
      } else if (child.formatName === "智慧新风") {
        // 智慧新风
        this.$router.push({
          path: "/index",
          query
        });
      } else if (child.formatName === "负离子检测器") {
        // 纯检测器
        this.$router.push({
          path: "/detection",
          query
        });
      } else if (child.formatName === "露点温控器14") {
        // 纯检测器
        this.$router.push({
          path: "/indexwenk",
          query
        });
      } else if (child.formatName === "露点温控器13") {
        // 纯检测器
        this.$router.push({
          path: "/indexwenk",
          query
        });
      } else if (child.formatName === "露点温控器12") {
        // 纯检测器
        this.$router.push({
          path: "/indexwenk",
          query
        });
      } else if (child.formatName === "露点温控器11") {
        // 纯检测器
        this.$router.push({
          path: "/indexwenk",
          query
        });
      } else if (child.formatName === "能源热泵") {
        // 纯检测器
        this.$router.push({
          path: "/indextem",
          query
        });
      } else if (child.formatName === "地源热泵") {
        // 纯检测器
        this.$router.push({
          path: "/rebengindex",
          query
        });
      } else if (child.formatName === "中控器") {
        // 纯检测器
        this.$router.push({
          path: "/controldeviceindex",
          query
        });
      } else if (child.formatName === "风冷热泵") {
        // 纯检测器
        this.$router.push({
          path: "/aircoolindex",
          query
        });
      }else if (child.formatName === "万能板") {
        // 纯检测器
        this.$router.push({
          path: "/wnbindex",
          query
        });
      }else if (child.formatName === "VRV空调") {
        // 纯检测器
        this.$router.push({
          path: "/vrvindex",
          query
        });
      }else if (child.formatName === "混水控制器") {
        // 纯检测器
        this.$router.push({
          path: "/mixWater",
          query
        });
      }else if (child.formatName === "漏水保护器") {
        // 漏水保护器
        this.$router.push({
          path: "/quality",
          query
        });
      }else if (child.formatName === "水质检测器") {
        // 水质检测器
        this.$router.push({
          path: "/leakingWater",
          query
        });
      }else if (child.formatName === "辐射调温混水控制器") {
        // 水质检测器
        this.$router.push({
          path: "/mixFsWater",
          query
        });
      }
    },
    selectDev (id) {
      let index = this.devIds.indexOf(id);
      if (index > -1) {
        // 找到了
        this.devIds.splice(index, 1);
      } else {
        this.devIds.push(id);
      }
    },
    containIds (id) {
      return this.devIds.includes(id);
    },
    shareBind (obj) {
      // 分享绑定
      share({
        masterOpenId: obj.masterOpenId,
        deviceId: obj.deviceId,
        token: obj.token
      })
        .then(res => {
          if (res.code === 200) {
            if (res.data) {
              // 成功
              Toast({
                mes: "绑定成功！",
                timeout: 1500,
                icon: "success"
              });
            } else {
              console.log("绑定失败：", res);
            }
            this.obtainMyDevice();
            // 绑定成功后，删除“绑定相关”数据
            Store.remove("obj");
          }
        })
        .catch(error => {
          Store.remove("obj");
          this.$toast(error.msg, "bottom");
        });
    },
    shareBinds (obj) {
      // 分享绑定
      teamShare({
        masterOpenId: obj.masterOpenId,
        teamId: obj.teamIds,
        token: obj.token
      })
        .then(res => {
          if (res.code === 200) {
            if (res.data) {
              // 成功
              Toast({
                mes: "绑定成功！",
                timeout: 1500,
                icon: "success"
              });
            } else {
              console.log("绑定失败：", res);
            }
            this.obtainMyDevice();
            // 绑定成功后，删除“绑定相关”数据
            Store.remove("obj");
          }
        })
        .catch(error => {
          Store.remove("obj");
          this.$toast(error.msg, "bottom");
        });
    },
    getBgImgs () {
      getBgImgs().then(res => {
        if (res.code === 200 && Array.isArray(res.data)) {
          const data = res.data.slice(0, 5);
          Store.save("bgImgs", JSON.stringify(data));
        } else {
          Store.save("bgImgs", "[]");
        }
      });
    }
  },
  created () {
    console.log(JSON.parse(Store.fetch("obj")))
    if (JSON.parse(Store.fetch("obj"))) {
      // 分享人进来
      if(JSON.parse(Store.fetch("obj")).deviceId){
        this.shareBind(JSON.parse(Store.fetch("obj")));
      }else{
        this.shareBinds(JSON.parse(Store.fetch("obj")));
      }
      console.log("从分享进来");
    } else {
      console.log("未从分享进来");
      this.obtainMyDevice();
      Store.remove("obj");
    }
    this.getBgImgs();
  },
  // mounted () {
  //     // 监听手机物理返回键时禁止返回之前的路由
  //     if (window.history && window.history.pushState) {
  //         window.addEventListener('popstate', this.forbidBack);
  //         // this.forbidBack() 
  //         // this.forbidBack() 
  //         // this.forbidBack() 
  //     }
  // },
  // destoryed () {
  //     // 离开页面时销毁监听
  //     window.removeEventListener('popstate', this.forbidBack);
  //     // alert(2)
  // },
  components: {
    "yd-accordion": Accordion,
    "yd-accordion-item": AccordionItem,
    "yd-radio-group": RadioGroup,
    "yd-radio": Radio
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/common/scss/variable.scss";
@import "src/common/scss/mixins.scss";
.ssa{
  padding-left:30px;
  background:url("../../assets/Component25.png") no-repeat 52px center
}
.ssa1{
  padding-left:30px;
  background:url("../../assets/Component46.png") no-repeat 52px center
}
.list-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #ffffff;
  .none-device {
    padding: 10px 10px;
  }
  .flex {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
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
  .fixed-bottom {
    position: fixed;
    bottom: 0px;
    height: 50px;
    line-height: 50px;
    width: 100%;
    font-size: 14px;
    .group {
      position: relative;
      width: 100%;
      font-size: 14px;
      & div {
        width: 50%;
        text-align: center;
        float: left;
        // border-top: 1px solid #2689ee;
        background: #F2F9FF;
        color: #004A8F;
        &.active {
          background: #004A8F;
          color: #ffffff;
        }
      }
    }
  }
  .list-item {
    position: relative;
    display: flex;
    border-bottom: 1px solid #d9d9d9;
    margin-bottom: 5px;
    .item-left {
      display: flex;
      align-items: center;
      .icon {
        width: 15px;
        height: 15px;
        background: url("../../assets/ju.png") no-repeat center center;
        background-size: 15px 15px;
        margin-right: 5px;
        &.active {
          background: url("../../assets/ju_select.png") no-repeat center center;
          background-size: 15px 15px;
        }
      }
      .img {
        width: 60px;
        height: 60px;
        border: 1px solid #d9d9d9;
        border-radius: 100%;
        position: relative;
        //overflow: hidden;
        .p-img {
          position: relative;
          width: 60px;
          height: 60px;
          overflow: hidden;
          border-radius: 100%;
          box-shadow: 0px 2px 6px rgba(0, 74, 143, 0.15);
          & span {
            position: absolute;
            width: 100%;
            height: 70px;
            bottom: 3px;
            left: -1px;
            text-align: center;
            color: #ffffff;
            background: url("../../assets/bak.png") no-repeat center center;
            background-size: 70px 70px;
            line-height: 30px;
            font-size: 10px;
            &.active {
              background: url("../../assets/bak2.png") no-repeat center center;
              background-size: 60px 19px;
              bottom: 0px;
              height: 19px;
            }
            & em {
              position: absolute;
              bottom: -5px;
              text-align: center;
              width: 100%;
              left: 0;
            }
          }
          & img {
            width: 60%;
            margin-left: 20%;
            margin-top: 10%;
            height: auto;
          }
        }
        .img-text {
          position: absolute;
          left: 75px;
          top: 50%;
          transform: translateY(-50%);
          width: 220px;
          color: #666666;
          line-height: 16px;
          // overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          & p:nth-child(1) {
            font-size: 14px;
            margin-bottom: 5px;
            color: #111111;
            display: flex;
            align-items: center;
            span:first-child {
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          .img-text1 {
            width: 120px;
            font-size: 16px;
          }
          .img-text2{
            position: absolute;
            right: -36px;
            color: #061780;
          }
          & p:nth-child(2) {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-bottom: 3px;
          }
          .addr {
            /*background: url('../../assets/addr2.png') no-repeat center center;*/
            height: 11px;
            width: 13px;
            display: inline-block;
            background: url("../../assets/Frame.png") no-repeat center center;
            background-size: contain;
            // margin: 0 8px;
          }
          .power-status {
            width: 12px;
            height: 12px;
            // margin-left: 10px;
          }
        }
      }
    }
    .item-right {
      flex: 1;
      line-height: 16px;
      align-items: center;
      justify-content: flex-end;
      text-align: right;
      padding-top: 30px;
      position: relative;
      & span {
        text-decoration: underline;
      }
      & .group {
        position: absolute;
        top: 10px;
        font-size: 12px;
        color: #20aaf8;
        right: 60px;
      }
      & .edit {
        position: absolute;
        top: 10px;
        font-size: 12px;
        color: #20aaf8;
        right: 30px;
      }
      & .delete {
        position: absolute;
        top: 10px;
        font-size: 12px;
        color: #aaa;
        right: 0px;
      }
    }
    &:last-child {
      border-bottom: none;
      margin-bottom: 0px;
    }
  }
  .team-icon {
    width: 40px;
  }
}

@keyframes zoom-in {
  0% {
    opacity: 0;
    -webkit-transform: scale3d(0.3, 0.3, 0.3);
    transform: scale3d(0.3, 0.3, 0.3);
  }
  50% {
    opacity: 1;
  }
}

textarea::-webkit-input-placeholder {
  color: #93c4f7 !important;
}

input {
  -webkit-user-select: auto;
  /*webkit浏览器*/
}
</style>
