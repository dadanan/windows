<template>
  <div></div>
</template>

<script>
import { auth, trusteeTeam } from "../wenkong/api";
import { getQueryString } from "utils";
import Store from "../wenkong/store";

export default {
  created() {
    this.authMethod();
  },
  methods: {

    authMethod() {
      // 因为如果用户来自扫描托管二维码，那么customerId就在路径参数里而不是Init.vue页面存储的
      if(Store.fetch("Ticket")){
        if (getQueryString("teamId")) {
            this.trusteeTeam(getQueryString("teamId"), res.data);
          }
          //如果参数中有pay参数，说明是引导用户进入付款页面的
          if (getQueryString("pay")) {
            this.$router.push({
              path: "/pay1"
            });
            return;
          }
          this.$router.push({
            path: "/list",
            query: {
              customerId: Store.fetch("customerId")
            },
          });
      }else{
        auth(
        Store.fetch("customerId") || getQueryString("customerId"),
        getQueryString("code")
      )
        .then(res => {
          // 拿到微信openid
          Store.save("Ticket", res.data);
          // 如果参数中有teamId，说明用户是扫设备组的托管二维码进来的，那么调用托管组接口
          if (getQueryString("teamId")) {
            this.trusteeTeam(getQueryString("teamId"), res.data);
          }

          //如果参数中有pay参数，说明是引导用户进入付款页面的
          if (getQueryString("pay")) {
            this.$router.push({
              path: "/pay1"
            });
            return;
          }
          this.$router.push({
            path: "/list",
            query: {
              customerId: Store.fetch("customerId")
            },
          });
        })
        .catch(err => {
          console.error("auth-error-->", err);
        });
      }
      
    },
    /**
     * teamId: 设备组id
     * openId: 用户关注公众号后产生的openId
     */
    trusteeTeam(teamId, openId) {
      trusteeTeam({
        teamId,
        openId
      }).then(res => {
        console.log("设备组托管成功！");
      });
    }
  },
  
};
</script>

