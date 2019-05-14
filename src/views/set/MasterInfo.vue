<template>
  <div class="set-wrapper">
    <div class="header">
      <div class="return" @click="returnMethod"></div>
      <span>设备信息</span>
    </div>
    <div class="set-cell">
      <div class="cell-item" v-for='item in abilityArray' :key='item.id'>
        <div class="cell-left"><span>{{item.definedName || item.abilityName}}</span></div>
        <div>
          <!-- <span v-if='item.dirValue=="2DR.0"'>{{item.status ? '制热' : '制冷'}}</span> -->
          <el-switch v-if='item.dirValue=="2D8.0"' active-text="开 " inactive-text="关 " v-model="item.status" @change="switchStatusHandler(item)" :disabled="isMasterForamt()"></el-switch>
          <el-switch v-if='item.dirValue=="2DR.0"' active-text="制热" inactive-text="制冷" v-model="item.status" @change="switchStatusHandler(item)" :disabled="isMasterForamt()"></el-switch>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Loading, Toast } from "vue-ydui/dist/lib.rem/dialog";
import Store from "../wenkong/store";
import { newQueryDetailByDeviceId, sendFunc } from "../wenkong/api";

export default {
  data() {
    return {
      abilityArray: [],
      deviceId: this.$route.query.deviceId,
      masterFormat: this.$route.query.masterFormat,
      setInter: undefined
    };
  },
  methods: {
    /**
     * 只有主机才可以操作
     * 目前只有智慧新风可以作为主机
     */
    isMasterForamt() {
      return this.masterFormat == 0;
    },
    switchStatusHandler(item) {
      console.log(1, item);
      sendFunc({
        deviceId: this.deviceId,
        funcId: item.dirValue,
        value: item.status ? 1 : 0
      }).then(() => {
        Toast({
          mes: "指令发送成功！",
          timeout: 1000,
          icon: "success"
        });
        console.info("指令发送成功:", item.dirValue, "-", item.status ? 1 : 0);
      });
    },
    returnMethod() {
      this.$router.back(-1);
    },
    getRealTimeValue() {
      newQueryDetailByDeviceId({
        deviceId: this.deviceId,
        abilityIds: this.abilityArray.map(item => item.abilityId)
      }).then(res => {
        // 根据功能项id筛选功能项
        const findTheAbility = (data, id) => {
          return data.filter(item => item.id == id)[0];
        };

        this.abilityArray.forEach((item, index) => {
          const realAbilityData = findTheAbility(
            res.data.filter(item => item.id),
            item.abilityId
          );
          if (!realAbilityData) {
            return;
          }

          if (
            !realAbilityData.abilityOptionList ||
            realAbilityData.abilityOptionList.length === 0
          ) {
            return;
          }

          let ok = false;
          this.$set(item, "status", false);

          realAbilityData.abilityOptionList.forEach((option, oIndex) => {
            if (ok) return;
            if (option.dirValue === "1" && option.isSelect) {
              this.$set(item, "status", true);
              ok = true;
            }
          });
        });
      });
    }
  },
  created() {
    const temp = Store.fetch("masterInfoAbility");
    try {
      this.abilityArray = JSON.parse(Store.fetch("masterInfoAbility"));
      this.getRealTimeValue();
      this.setInter = setInterval(() => {
        this.getRealTimeValue();
      }, 4000);
    } catch (e) {
      // 没有获取到主机开关和主机模式的功能项，因为用户没有在型号第三步选择使用
    }

    Loading.open("很快加载好了");
    setTimeout(() => {
      Loading.close();
    }, 300);
  },
  destroyed() {
    clearInterval(this.setInter);
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/common/scss/variable.scss";
@import "src/common/scss/mixins.scss";
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
      background: url("../../assets/arr-left.png") no-repeat center center;
      background-size: 8px 16px;
      width: 40px;
      height: 40px;
      display: block;
      top: 0px;
    }
  }
  .set-cell {
    padding: 10px 0;
    background: #fff;
    .cell-item {
      position: relative;
      display: flex;
      justify-content: space-between;
      padding: 0 15px;
      overflow: hidden;
      margin-bottom: 20px;
      margin-top: 20px;
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
        display: flex;
        align-items: center;
      }
      .cell-right {
        flex: 1;
        justify-content: flex-end;
        text-align: right;
        &::after {
          display: block;
          color: #c9c9c9;
          content: "";
          width: 8px;
          height: 15px;
          background: url("../../assets/arr-right.png") no-repeat center center;
          background-size: 8px 15px;
          position: absolute;
          right: 30px;
          top: 1px;
        }
        &.none {
          padding-right: 30px;
          &::after {
            display: none;
          }
        }
        & span {
          color: #999999;
        }
      }
    }
  }
}
</style>

