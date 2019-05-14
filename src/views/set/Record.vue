<template>
  <div class="set-wrapper">
    <div class="header">
      <div class="return" @click="returnMethod"></div>
      <span>客户反馈记录</span>
    </div>
    <div class="record">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="反馈标题">
        </el-table-column>
        <el-table-column prop="description" label="反馈内容">
        </el-table-column>
        <el-table-column prop="status" label="状态" >
        </el-table-column>
        <el-table-column prop="createTime" label="时间" >
          <template slot-scope="scope">
            {{new Date(scope.row.createTime).toLocaleString()}}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Store from "../wenkong/store";
import { getRepairInfoLog } from '../wenkong/api'

export default {
  data() {
    return {
       tableData:[]
    };
  },
  methods: {
    returnMethod() {
      this.$router.back(-1);
    },
    getRepairInfoLog(){
      getRepairInfoLog({deviceId: this.$route.query.deviceId}).then(res=>{
        this.tableData = res.data
      })
    }
  },
  created() {
    this.getRepairInfoLog()
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
      overflow: hidden;
      margin-bottom: 20px;
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
        padding-right: 50px;
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
.record{
  width: 96%;
  margin: auto;
  padding: 20px 0px;
}
</style>

