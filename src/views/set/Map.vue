<template>
  <div class="amap-page-container">
    <div class="header">
      <div class="return" @click="returnMethod"></div>
      <span>授权管理</span>
    </div>
    <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
    <div class="toolbar">
      经纬度: [{{ center[0] }}, {{ center[1] }}] 地址: {{ address }}
    </div>
    <el-amap vid="amapDemo" :zoom="zoom" :center="center" :events="events" class="amap-demo" :plugin="plugin">
      <el-amap-marker :position="marker.position" :events="events" :visible="marker.visible" :draggable="marker.draggable"></el-amap-marker>
    </el-amap>
    
  </div>
</template>

<script>
import { updateDeviceLocation } from '../wenkong/api'
import Store from '../wenkong/store'
import { Toast } from 'vue-ydui/dist/lib.rem/dialog'

export default {
  data() {
    const self = this
    return {
      searchOption: {
        city: '',
        citylimit: true
      },
      zoom: 12,
      center: [121.59996, 31.197646],
      address: '',
      events: {
        click(e) {
          let { lng, lat } = e.lnglat
          const position = [lng, lat]
          self.center = position
          self.marker.position = position

          self.getDetailLocation(lng, lat, addr => {
            const component = addr.addressComponent
            updateDeviceLocation({
              deviceId: self.$route.query.deviceId,
              location: `${component.province},${component.city},${
                component.district
              },${addr.formattedAddress}`, // 去除可能存在的多个逗号,
              mapGps: position.join(',')
            }).then(() => {
              Store.save('mapGps', position.join(','))
              Toast({
                mes: '位置设置成功！',
                timeout: 1500,
                icon: 'success'
              })
            })
          })
        }
      },
      marker: {
        position: [121.59996, 31.197646],
        visible: true,
        draggable: false
      },
      markers: [], // 多个标记
      plugin: {
        pName: 'Scale',
        events: {
          init(instance) {}
        }
      }
    }
  },
  methods: {
    /**
     * @param cb 回调函数，将高德地图接口结果当成参数
     */
    getDetailLocation(lng, lat, cb) {
      const self = this
      // // 这里通过高德 SDK 完成。
      const geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: 'all'
      })
      geocoder.getAddress([lng, lat], function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
          const regeocode = result.regeocode
          if (result && regeocode) {
            self.address = regeocode.formattedAddress
            // 将位置信息传出去
            if (cb) {
              cb(regeocode)
            }
            self.$nextTick()
          }
        }
      })
    },
    queryDevicePosition(id) {
      queryDevicePosition(id).then(res => {
        const data = res.data
        if (!data.pointX || !data.pointY) {
          return
        }
        const position = [data.pointX, data.pointY]
        this.center = position
        this.marker.position = position
      })
    },
    onSearchResult(pois) {
      let latSum = 0
      let lngSum = 0
      if (pois.length > 0) {
        pois.forEach(poi => {
          let { lng, lat } = poi
          lngSum += lng
          latSum += lat
          this.markers.push([poi.lng, poi.lat])
        })
        let center = [lngSum / pois.length, latSum / pois.length]
        this.center = center
        this.marker.position = center
      }
    },
    returnMethod() {
      this.$router.back(-1)
    }
  },
  created() {
    const mapGps = Store.fetch('mapGps')
    if (mapGps) {
      const position = mapGps.split(',')
      this.center = position
      this.marker.position = position
      this.getDetailLocation(position[0], position[1])
    }
    // this.queryDevicePosition(this.id)
  }
}
</script>

<style lang='scss' scoped>
@import 'src/common/scss/variable.scss';
@import 'src/common/scss/mixins.scss';
.amap-page-container {
  height: 500px;
  position: relative;
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
  .search-box {
    margin: auto;
    margin-bottom: 10px;
  }
  .amap-demo {
    height: calc(100% - 40px);
    margin: 10px;
  }
  .toolbar {
    height: 40px;
    margin: 10px;
  }
}
</style>
