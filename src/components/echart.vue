<template>
	<div class="chart" :id="id"></div>
</template>
<script>
import echarts from 'echarts'
import { Loading } from 'vue-ydui/dist/lib.rem/dialog'
import Vue from 'vue'
export default {
  props: {
    id: {
      type: String,
      default: 'chart'
    },
    xdata: {
      type: Array
    },
    ydata: {
      type: Array
    }
  },
  data() {
    return {
      chart: null
    }
  },
  created() {},
  mounted() {
    let that = this
    that.initChart()
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))

      this.chart.setOption({
				color: ['#3398DB'],
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xdata,
          splitLine:{  
            show:true,
             lineStyle:{
              color:'#969696',
              width: 1
              }
           }
        },
        calculable: true,
        yAxis:{
            type: 'value',
            
        },
        grid: {
          x: 40,
          y: 5,
          y2: 20
        },
        series: [
          {
            data: this.ydata,
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                color: '#409cf1'
              }
            }
          }
        ]
      })
    },
    getTime(array) {
      let newarr = []
      array.forEach(v => {
        console.log(v)
        newarr.push(this.filterTime(v))
      })
      return newarr
    },
    filterTime(nS) {
      let getString = function(m) {
        return m < 10 ? '0' + m : m
      }
      let time = new Date(nS),
        y = time.getFullYear(),
        m = time.getMonth() + 1,
        d = time.getDate(),
        h = time.getHours(),
        mm = time.getMinutes(),
        s = time.getSeconds()
      console.log(y + '-' + getString(m) + '-' + getString(d))
      return y + '-' + getString(m) + '-' + getString(d)
      // return y+'-'+getString(m)+'-'+getString(d)+' '+getString(h)+':'+getString(mm)+':'+getString(s);
    }
  }
}
</script>