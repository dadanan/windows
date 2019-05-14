<template>
  <div class="demo-container">
    <!-- <button @click='buy(0.01)'>支付0.01元</button>
    <button @click='buy(0.02)'>支付0.02元</button>
    <button @click='buy(0.1)'>支付0.1元</button> -->
    <div class="pay">
        <div class="yuan">
            <ul>
                <li>支付</li>
                <li style="font-size:70px">{{pays}}</li>
                <li>金额(元)</li>
            </ul>
        </div>
        <div class="choose">
            <p>选择支付</p>
            <ul>
                <li>￥余额支付</li>
            </ul>
            <ul>
                <li @click="buy">微信支付</li>
            </ul>
        </div>
    </div>
  </div>
</template>

<script>
import { getPayParams } from "../wenkong/api";
import { appid } from "../wenkong/api";
import Store from "../wenkong/store";
import { getQueryString } from "utils";
import { wxPay } from "@/utils/wx.js";
import img1 from "./assets/ss.png"; // 图
export default {
    data(){
        return {
        pays:Store.fetch("price"),
        img:img1
        }  
    },
  methods: {
    buy() {
      const attach = JSON.stringify({
        test: "可以在这里带上任何附加信息"
      });
      getPayParams({
        openId: Store.fetch("Ticket"), // openId
        price: Store.fetch("price"), // 钱
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
body{
    background: #ffff
}
.pay{
    width: 100%;
    padding: 100px 0px 0px 0px;
}
.yuan{
    width: 200px;
    height: 200px;
    margin: auto;
    border-radius: 50%;
    background: #f1973f;
    ul{
        text-align: center;
        padding: 20px 0px 0px 0px;
        li{
            font-size: 16px;
            color: #fff;
            font-weight: 600;
            line-height: 50px
        }
    }
}
.choose{
    margin-top: 50px;
    font-size: 18px;
    p{
     text-align: center;
     margin-bottom: 30px;
    }
    ul{
        float: left;
        width: 50%;
        text-align: center;
    }
}
</style>

