<template>
 <div class="main-wrapper" >
    <div class="header">
      <span>{{ deviceName }}</span>
    </div>
   <div class="nth-top">
     <div class="nth_l">
       <dl>
         <dd></dd>
         <dt>主机制冷</dt>
       </dl>
     </div>
     <div class="nth_r">
       <dl>
         <dd></dd>
         <dt>主机制热</dt>
       </dl>
     </div>
     <div class="" style="clear:both"></div>
   </div>
   <div class="nth-bot">
     <p>主机开关</p>
   </div>
 </div>
</template>

<script type="text/ecmascript-6">
import { Loading, Toast } from "vue-ydui/dist/lib.rem/dialog";
import { Popup } from "vue-ydui/dist/lib.rem/popup";
import { setWechatTitle } from "utils";
import Store from "../wenkong/store";
// import img1 from "../../assets/bg.png"
import {
  getModelVo,
  newQueryDetailByDeviceId,
  getLocation,
  getWeather,
  sendFunc,
  getStrainerData
} from "../wenkong/api";

let prevValues = '' //当一次用户选择的picker组件的第二个值，来判断。只有此值变化，才调用指令接口
let currValues = '' // 当前用户所在的左侧滑杆的值

export default {
  data() {
    return{
      deviceName:'主机中控器'
    }
  },
  computed: {
    
  },
  methods: {
    
  },
  created () {
    
  },
  components: {
    "yd-popup": Popup
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.main-wrapper {
  width: 100%;
  height: 100%;
  position: fixed;
  overflow: auto;
  top: 0;
  bottom: 0;
  background:url('../../assets/bg.png') no-repeat center center;
  .header {
    height: 40px;
    font-size: 16px;
    line-height: 40px;
    color: #fff;
    text-align: center;
    position: relative;
    .time {
      position: absolute;
      left: 15px;
      top: 3px;
      color: #ffffff;
    }
  }
    .nth-top{
      width: 70%;
      margin: auto;
      margin-top: 150px;
      color: #fff;
      font-size: 14px;
      text-align: center;
      .nth_l{
        float: left;
        width:105px;
        height:105px;
        background: rgba($color: #ffffff, $alpha: 0.3);
        border-radius: 10px;
        dd{
          width: 70px;
          height: 45px;
          margin: auto;
          margin-top: 15px;
          background: url("../../assets/zhileng_dian.png") no-repeat center center;
          background-size:100% 100%; 
        }
        dt{
          margin-top: 14px;
        }
      }
      .nth_r{
        float: right;
        width:105px;
        height:105px;
        background: rgba($color: #ffffff, $alpha: 0.3);
        border-radius: 10px;
        dd{
          width: 70px;
          height: 45px;
          margin: auto;
          margin-top: 15px;
          background: url("../../assets/zhire.png") no-repeat center center;
          background-size:100% 100%; 
        }
        dt{
          margin-top: 14px;
        }
      }
    }
    .nth-bot{
      width: 60%;
      padding: 15px 0px;
      color: #fff;
      font-size: 14px;
      background: #7fffe7;
      margin: auto;
      margin-top: 150px;
      border-radius: 10px;
      text-align: center;
    } 
  }
</style>