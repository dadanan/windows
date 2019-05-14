<template>
  <div class="set-wrapper">
    <div class="header">
      <div class="return" @click="returnMethod"></div>
      <span>滤芯寿命</span>
    </div>
    <!--总共3000小时-->
    <div class="cell-list" v-for="(item,index) in batteryList" :key="index">
      <div class="name">{{ item.optionName }}</div>
      <div class="cell-content">
        <div class="progress">
          <div class="trail">
            <!--<span :style="{ width:((item.value / 3600) / 30) + '%' }">-->
            <span :style="{ width:((item.value /item.maxVal)*100) + '%' }">
              <p :style="{ left:((item.value / item.maxVal)*100) + '%' }">
                <!--剩余{{ (item.value/3600).toFixed(2) }}h-->
                <label v-if="setType==='1'">剩余{{item.value}}h</label>
                <label v-if="setType!=='1'">剩余{{(item.value/item.maxVal*100)}}%</label>
              </p>
            </span>
          </div>
        </div>
        <!--<div class="recove" @click="recove(item.type,index)">滤网复位</div>-->
        <div class="recove" @click="showRecove(item.optionValue,item.maxVal)">滤网复位</div>
      </div>
    </div>
    <div class="switch-box  flex flex-pack-justify flex-align-center">
      <span>显示设置</span>
      <div>
        <span>{{ setType === '1' ? '小时': '百分比' }}</span>
        <yd-switch @click.native="switchMethod()"></yd-switch>
      </div>

    </div>
    <div class="create-dialog dialog" v-if="recoveFlag">
      <div class="confirm">
        <div class="confim-top">
          <h4 class="title">复位分子滤芯</h4>
          <p>当您更换或清洁滤芯后， 请按确认</p>
        </div>
        <div class="confim-bottom">
          <div class="but" @click="recoveFlag = false">取消</div>
          <div class="but create" @click="recove()">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Loading } from 'vue-ydui/dist/lib.rem/dialog'
import myUrl from 'common/js/api'
import { Switch } from 'vue-ydui/dist/lib.rem/switch'
import { getModelVo, getStrainerData , sendFunc} from '../wenkong/api'
export default {
  data() {
    return {
      value: '',
      pw: 0,
      batteryList: [],
      recoveFlag: false,
      selectType: '',
      selectIndex: '',
      setType: '1',
      dirValueList: [],
      batteryList1: []
    }
  },
  components: {
    'yd-switch': Switch
  },
  created() {
    // Loading.open('很快加载好了')
    this.getIndexAbilityData()
  },
  mounted() {
  },
  methods: {
    returnMethod() {
      this.$router.back(-1)
    },
    getIndexAbilityData() {
      // 获取H5控制页面功能项数据，带isSelect参数
      getModelVo({ deviceId: this.$route.query.deviceId, pageNo: 1 }).then(
        res => {
          if (res.code === 200 && res.data) {
            const data = res.data.abilitysList
            for (var i = 0; i < data.length; i++) {
              if (data[i].dirValue == '-1') {
                this.batteryList1 = data[i].abilityOptionList
                this.getStrainerData()
              }
            }
          }
        }
      )
    },
    getStrainerData() {
      for (var i = 0;i< this.batteryList1.length; i++) {
        this.dirValueList.push(this.batteryList1[i].optionValue)
      }
      getStrainerData({
        deviceId: this.$route.query.deviceId,
        dirValueList: this.dirValueList
      }).then(res => {
        if (res.code === 200 && res.data) {
          for(var i = 0;i<this.batteryList1.length;i++){
            var s =+this.batteryList1[i].optionValue;
            var d = (res.data)[s]
            this.batteryList1[i].value = d
          }
          this.batteryList = this.batteryList1
        }
      }).catch(error => {
          console.log(error)
        })
    },

    // 打开滤网复位弹出框
    showRecove(type, index) {
      this.recoveFlag = true
      this.selectType = type
      this.selectIndex = index
    },
    recove() {
      // 获取H5控制页面功能项数据，带isSelect参数
    Loading.open('很快加载好了')
      sendFunc({ deviceId: this.$route.query.deviceId, funcId: this.selectType ,value:this.selectIndex}).then(
        res => {
          if (res.code === 200) {
              Loading.close()
            // console.log(res)
            this.getIndexAbilityData()
            this.recoveFlag = false
          }
        }
      ).catch(error => {
          Loading.close()
        })
    },
    // 显示小时还是100%
    switchMethod: function() {
      this.setType == '1' ? (this.setType = '2') : (this.setType = '1')
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/common/scss/variable.scss';
@import 'src/common/scss/mixins.scss';
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

.switch-box {
  padding: 10px 15px;
  div {
    span {
      float: left;
      line-height: 30px;
    }
    .yd-switch {
      float: left;
      margin-left: 10px;
    }
  }
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
    animation: zoom-in 0.15s ease forwards;
    overflow: hidden;
    .confim-top {
      background: #2689ee;
      color: #ffffff;
      text-align: center;
      position: relative;
      overflow: hidden;
      .title {
        text-align: center;
        line-height: 35px;
        font-size: 16px;
        font-weight: normal;
        border-bottom: 1px solid #6fa7f1;
        margin: 0 10px;
      }
      & p {
        text-align: center;
        padding: 25px 10px;
      }
    }
    .confim-bottom {
      padding: 20px;
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

.set-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  .header {
    height: 40px;
    font-size: 16px;
    line-height: 40px;
    text-align: center;
    position: relative;
    .return {
      position: absolute;
      left: 0px;
      background: url('../../assets/arr-left.png') no-repeat center center;
      background-size: 8px 16px;
      width: 40px;
      height: 40px;
      display: block;
      top: 0px;
    }
  }
  .cell-list {
    background: #ffffff;
    margin-bottom: 5px;
    padding: 20px 20px 50px 20px;
    .name {
      font-size: 14px;
    }
    .cell-content {
      width: 100%;
      position: relative;
      overflow: hidden;
      .progress {
        float: left;
        width: 70%;
        padding-left: 30px;
        padding-top: 50px;
        position: relative;
        .trail {
          width: 100%;
          height: 10px;
          background: #e6e6e6;
          border-radius: 20px;
          position: relative;
          & span {
            position: absolute;
            height: 10px;
            left: 0;
            top: 0;
            /*background: #3fa9f5;*/
            border-radius: 20px;
            transition: width 500ms ease;
            & p {
              position: absolute;
              height: 50px;
              width: 100px;
              top: -36px;
              font-size: 14px;
              color: #3fa9f5;
              background: url('../../assets/san.png') no-repeat center top 20px;
              background-size: 15px 13px;
              text-align: center;
              margin-left: -50px;
            }
          }
        }
      }
      .recove {
        width: 22%;
        font-size: 12px;
        height: 23px;
        line-height: 23px;
        /*background: #1fb1fb;*/
        text-align: center;
        color: #ffffff;
        float: right;
        margin-top: 43px;
        background: -webkit-gradient(
          linear,
          0 0,
          100% 0,
          from(#268aed),
          to(#1eb2fb)
        );
        /*border-radius: 5px;*/
        &.none {
          background: #f5f5f5;
          color: #4d4d4d;
        }
      }
    }
  }
  .cell-list:nth-child(4n + 2) {
    & .progress {
      & span {
        background-color: #ff931e;
      }
    }
  }
  .cell-list:nth-child(4n + 3) {
    & .progress {
      & span {
        background-color: #3fa9f5;
      }
    }
  }
  .cell-list:nth-child(4n + 4) {
    & .progress {
      & span {
        background-color: #00ff00;
      }
    }
  }
  .cell-list:nth-child(4n + 5) {
    & .progress {
      & span {
        background-color: #ff1d25;
      }
    }
  }
}
</style>