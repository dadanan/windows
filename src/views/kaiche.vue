<template>
  <div class="kaiche">
    <yd-layout>
      <yd-navbar slot="navbar" title="智能线上泊车">
        <router-link to="#" slot="left">
          <yd-navbar-back-icon></yd-navbar-back-icon>
        </router-link>
      </yd-navbar>
      <div class="kaiche-content">
        <img src="./car.png" alt="car" class="car">
        <yd-button size="large" type="primary" shape="circle" @click.native="kaiche">替我开车</yd-button>
      </div>
      <yd-tabbar slot="tabbar">
        <yd-tabbar-item title="招手" link="#" @click.native="hi">
          <yd-icon name="good" slot="icon" size="0.54rem"></yd-icon>
        </yd-tabbar-item>
        <yd-tabbar-item title="左满转" link="#" @click.native="left">
          <yd-icon name="prev" slot="icon" size="0.54rem"></yd-icon>
        </yd-tabbar-item>
        <yd-tabbar-item title="右满转" link="#" @click.native="right">
          <yd-icon name="next" slot="icon" size="0.54rem"></yd-icon>
        </yd-tabbar-item>
      </yd-tabbar>
    </yd-layout>
  </div>
</template>

<style lang="scss" scoped>
  .kaiche {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("../assets/bak1.jpg");
    background-size: cover;
  }

  .kaiche-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80%;
    padding: .5rem;
  }

  .car {
    width: 50%;
  }
</style>

<script>
  import { Loading, Toast } from 'vue-ydui/dist/lib.rem/dialog'
  import { Button } from 'vue-ydui/dist/lib.rem/button'
  import API from 'common/js/api'
  import {TabBar, TabBarItem} from 'vue-ydui/dist/lib.rem/tabbar'
  import {Icons} from 'vue-ydui/dist/lib.rem/icons'
  import {Layout} from 'vue-ydui/dist/lib.rem/layout'
  import {NavBar, NavBarBackIcon, NavBarNextIcon} from 'vue-ydui/dist/lib.rem/navbar';

  export default {
    components: {
      'yd-button': Button,
      'yd-tabbar': TabBar,
      'yd-tabbar-item': TabBarItem,
      'yd-icon': Icons,
      'yd-layout': Layout,
      'yd-navbar': NavBar,
      'yd-navbar-back-icon': NavBarBackIcon,
      'yd-navbar-next-icon': NavBarNextIcon
    },
    methods: {
      kaiche () {
        console.log('kaiche')
        let data = {
          deviceId: 'gh_db8607de9a99_41854abad30d591f',
          funcId: '010',
          value: '0101'
        }
        // 发送指令
        Loading.open('发送中...')
        this.$http.post(API.sendFunc, data).then(res => {
          Loading.close()
          if (res.code === 200) {
            Toast({
              mes: '发送成功',
              timeout: 1500,
              icon: 'success'
            })
          }
        })
        .catch(() => {
          Loading.close()
          console.log('发送失败')
        })
      },
      hi () {
        let data = {
          deviceId: 'gh_db8607de9a99_41854abad30d591f',
          funcId: '011',
          value: '0'
        }
        // 发送指令
        Loading.open('发送中...')
        this.$http.post(API.sendFunc, data).then(res => {
          Loading.close()
          if (res.code === 200) {
            Toast({
              mes: '发送成功',
              timeout: 1500,
              icon: 'success'
            })
          }
        })
        .catch(() => {
          Loading.close()
          console.log('发送失败')
        })
      },
      left () {
        let data = {
          deviceId: 'gh_db8607de9a99_41854abad30d591f',
          funcId: '011',
          value: '1'
        }
        // 发送指令
        Loading.open('发送中...')
        this.$http.post(API.sendFunc, data).then(res => {
          Loading.close()
          if (res.code === 200) {
            Toast({
              mes: '发送成功',
              timeout: 1500,
              icon: 'success'
            })
          }
        })
        .catch(() => {
          Loading.close()
          console.log('发送失败')
        })
      },
      right () {
        let data = {
          deviceId: 'gh_db8607de9a99_41854abad30d591f',
          funcId: '011',
          value: '2'
        }
        // 发送指令
        Loading.open('发送中...')
        this.$http.post(API.sendFunc, data).then(res => {
          Loading.close()
          if (res.code === 200) {
            Toast({
              mes: '发送成功',
              timeout: 1500,
              icon: 'success'
            })
          }
        })
        .catch(() => {
          Loading.close()
          console.log('发送失败')
        })
      }
    }
  }
</script>
