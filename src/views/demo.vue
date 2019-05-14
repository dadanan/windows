<template>
  <div class="demo-container">
    <button @click='buy(0.01)'>支付0.01元</button>
    <button @click='buy(0.02)'>支付0.02元</button>
    <button @click='buy(0.1)'>支付0.1元</button>
  </div>
</template>

<script>
import { getPayParams } from "./wenkong/api";
import Store from "./wenkong/store";
import { wxPay } from "../utils/wx.js";

export default {
  methods: {
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
.demo-container {
  margin: 30% auto;
}
</style>

