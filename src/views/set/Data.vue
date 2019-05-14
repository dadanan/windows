<template>
  <div class="set-wrapper">
    <div class="header">
      <div class="return" @click="returnMethod"></div>
      <span>数据曲线图</span>
    </div>
    <div class="data-cell" v-for="(item,index) in dataList" :key="index">
      <div class="cell-header">
        <div class="title"><span>{{ item.name }}({{ item.unit }})</span></div>
      </div>
      <div class="cell-data">
        <my-echarts :id="'echart'+(index)" :xdata="item.xdata" :ydata="item.ydata"></my-echarts>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import MyEcharts from '../../components/echart'
import { Radio, RadioGroup } from 'vue-ydui/dist/lib.rem/radio'
import myUrl from 'common/js/api'
import { Loading, Toast } from 'vue-ydui/dist/lib.rem/dialog'
import { getHistoryData } from '../wenkong/api'

export default {
  data() {
    return {
      dataList: [],
      value: '',
      radio1: '日',
      radio2: '时',
      radio3: '时',
      chart: null,
      id: {
        type: String,
        default: 'chart'
      }
    }
  },
  created() {
    // this.getData()
    this.getHistoryData()
  },
  components: {
    'yd-radio-group': RadioGroup,
    'yd-radio': Radio,
    'my-echarts': MyEcharts
  },
  computed: {},
  watch: {
    dataList: {
      handler: function(val, oldval) {},
      deep: true
    }
  },
  mounted() {},
  methods: {
    returnMethod() {
      this.$router.back(-1)
    },
    getHistoryData() {
      Loading.open('很快加载好了')
      getHistoryData({
        deviceId: this.$route.query.deviceId,
        type: 1
      })
        .then(res => {
          this.dataList = res.data
          Loading.close()
        })
        .catch(error => {
          Loading.close()
          console.log(error)
          this.$toast(error.msg, 'bottom')
        })
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: []
        },
        toolbox: {
          show: false,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['2', '4', '5', '8', '10', '12', '16', '18', '20', '22', '24']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210, 210, 22, 33, 88],
            itemStyle: {
              normal: {
                color: '#999999',
                lineStyle: {
                  color: '#3fa9f5'
                }
              }
            }
          }
        ],
        grid: {
          x: 5,
          y: 20,
          y2: 20
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/common/scss/variable.scss';
@import 'src/common/scss/mixins.scss';
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
  .data-cell {
    padding: 10px 10px;
    background: #ffffff;
    margin-bottom: 10px;
    .cell-header {
      position: relative;
      display: flex;
      .title {
        display: flex;
        font-size: 14px;
      }
      .cell-right {
        flex: 1;
        text-align: right;
      }
    }
    .chart {
      width: 100%;
      height: 220px;
    }
    &:last-child {
      margin-bottom: 0px;
    }
  }
}
</style>

