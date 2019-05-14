<template>
  <div class="demo-container">
    <!-- <button @click='buy(0.01)'>支付0.01元</button>
    <button @click='buy(0.02)'>支付0.02元</button>
    <button @click='buy(0.1)'>支付0.1元</button> -->
    <div class="cs">
        <p>体验一下</p>
        <div class="cs1">
            <ul>
                <li style="font-size:50px">10</li>
                <li>金额(元)</li>
            </ul>
            <ul>
                <li style="font-size:50px">2</li>
                <li>时间(H)</li>
            </ul>
            <ul>
                <li style="line-height: 6.6em;" @click="chuan(10)">点击进去 ></li>
            </ul>
            <div></div>
        </div>
    </div>
    <div class="cs">
        <p>逗留片刻</p>
        <div class="cs1" style="background:#5ca9ef">
            <ul>
                <li style="font-size:50px">20</li>
                <li>金额(元)</li>
            </ul>
            <ul>
                <li style="font-size:50px">3</li>
                <li>时间(H)</li>
            </ul>
            <ul>
                <li style="line-height: 6.6em;" @click="chuan(20)">点击进去 ></li>
            </ul>
            <div></div>
        </div>
    </div>
    <div class="cs">
        <p>健康整天</p>
        <div class="cs1" style="background:#f1973f">
            <ul>
                <li style="font-size:50px">30</li>
                <li>金额(元)</li>
            </ul>
            <ul>
                <li style="font-size:50px">12</li>
                <li>时间(H)</li>
            </ul>
            <ul>
                <li style="line-height: 6.6em;" @click="chuan(30)">点击进去 ></li>
            </ul>
            <div></div>
        </div>
    </div>
    <div class="" style="width:94%;margin:auto;margin-top:20px">
        <img :src="img" style="width:100%;">
    </div>
  </div>
</template>

<script>
import { getPayParams } from "../wenkong/api";
import Store from "../wenkong/store";
import { wxPay } from "@/utils/wx.js";
import { appid } from "../wenkong/api";
import { getQueryString } from "utils";
import img1 from "./assets/as.png"; // 图
export default {
     data(){
        return {
            img:img1
        }  
    },
 created() {
    const customerId = getQueryString("customerId");
    if (customerId) {
      Store.save("customerId", customerId);
      this.getAppId(customerId);
    }
  },
  methods: {
    chuan(val) {
      Store.save("price", val);
      this.$router.push({
        path: "/pay2",
        query: {
          deviceId: this.deviceId
        }
      });
    },
    
    buy(price) {
      const attach = JSON.stringify({
        test: "可以在这里带上任何附加信息"
      });
      getPayParams({
        openId: Store.fetch("Ticket"), // openId
        price: price, // 钱
        orderBodyDesc: "订单主体描述test",
        orderDetail: "订单详细描述test",
        attach: attach
      }).then(res => {
        res = res.data;
        wxPay(
          res.appId,
          res.timeStamp,
          res.nonceStr,
          res.package1,
          res.signType,
          res.paySign,
          res.signature
        );
      });
    }
  }
};
</script>
<style  lang="scss" scoped>
// .demo-container {
//   margin: 30% auto;
// }
.cs{
    padding: 10px 4% 10px 4%;
    p{
        padding: 10px 0px;
        font-size: 16px;
        color:14px;
        font-weight: 600;
    }
    .cs1{
        width: 100%;
        // height: 150px;
        background:#8dc658;
        border-radius: 10px;
        ul{
            width: 33%;
            padding: 10px 0px;
            text-align: center;
            float: left;
            li{
                font-size: 14px;
                color: #fff;
                font-weight: 700;
            }
        }
        div{
            clear: both;
        }
    }
}
</style>

