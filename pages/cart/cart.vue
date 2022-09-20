<template>
  <view>
    <view class="kong" v-if="cart.length === 0">
      <image src="/static/cart_empty@2x.png" mode=""></image>
      <text>空空如也~</text>
    </view>
    <view class="feikong" v-else>
      <my-address></my-address>
    <view class="title">
      <uni-icons type="shop" size="18"></uni-icons>
      <text>购物车</text>
    </view>
    <view class="shop">
      <uni-swipe-action>
        <uni-swipe-action-item :right-options="options" 
        @click="swipeAction(item.goods_id)" v-for="item in cart" :key="item.goods_id">
            <view class="shop_item">
              <radio color="red" :checked="item.goods_state" @click="changeRadio(item.goods_id)" />
              <image :src="item.goods_small_logo"></image>
              <view class="jianjie">
                <text>{{item.goods_name}}</text>
                <view class="count">
                  <view class="jiage">￥{{xiaoshu(item.goods_price)}}</view>
                  <view class="btn">
                    <button @click="jian(item.goods_id)">-</button>
                    <view>{{item.goods_count}}</view>
                    <button @click="jia(item.goods_id)">+</button>
                  </view>
                </view>
              </view>
            </view>
        </uni-swipe-action-item>
      </uni-swipe-action>
    </view>
    <view class="jiesuan_box">
      <view class="jiesuan">
        <view class="jiesuan_left">
          <radio :checked="isCheckAll" color="red" value="" @click="quanxuan" /><text>全选</text>
          <view class="heji">合计:<text style="color: red;">￥{{money}}</text></view>
        </view>
        <view class="jiesuan_right">
          <view class="jiesuan_right_text" @click="zhifu">结算({{jiesuan}})</view>
        </view>
      </view>
    </view>
    </view>
  </view>
</template>

<script>
  import badgeMix from "@/mixins/tabbar-badge.js"
  import {mapState} from "vuex"
  export default {
    mixins: [badgeMix],
    data() {
      return {
          options:[
            {
              text:"删除",
              style:{
                backgroundColor:"#C00000"
              }
            }
          ]
      };
    },
    computed: {
      ...mapState("m_address",["address","token"]),
      money() {
        let {
          a
        } = this.jiageJiesuan()
        a = a.toFixed(2)
        return a
      },
      jiesuan() {
        let {
          b
        } = this.jiageJiesuan()
        return b
      }
    },
    methods: {
      xiaoshu(value){
        return value.toFixed(2)
      },
      jiageJiesuan() {
        let a = 0
        let b = 0
        this.cart.forEach(item => {
          if (item.goods_state === true) {
            b += item.goods_count
            a += item.goods_price * item.goods_count
          }
        })
        return {
          a,
          b
        }
      },
      changeRadio(goods_id) {
        this.$store.commit("m_cart/changeRadio", goods_id)
      },
      jia(goods_id) {
        this.$store.commit("m_cart/JIA", goods_id)
      },
      jian(goods_id) {
        this.$store.commit("m_cart/JIAN", goods_id)
      },
      quanxuan() {
        this.$store.commit("m_cart/checkAll")
      },
      swipeAction(goods_id){
        this.$store.commit("m_cart/removeShop",goods_id)
      },
      zhifu(){
        // 判断是否勾选了要结算的商品、是否选择了收货地址、是否登录。
        if(!this.address) return uni.$showMsg("请选择收货地址！")
        if(this.jiesuan === 0) uni.$showMsg("请选择要结算的商品！")
        if(!this.token){
          let a = 3
          this.showtost(a)
          let b = setInterval(()=>{
            a--
            if(a <= 0){
              clearInterval(b)
              uni.switchTab({
                url:"/pages/my/my",
                success:() => {
                  this.$store.commit("m_address/addHistoryPage",{
                    url:"/pages/cart/cart",
                    opentype:"switchTab"
                  })
                }
              })
              return
            }
            this.showtost(a)
          },1000)
        }
        uni.showModal({
          content:"非常抱歉！使用的是第三方后端接口，所以不支持支付功能！"
        })
        // 创建订单
        // this.pay()
      },
      showtost(a){
        uni.showToast({
          mask:true,
          icon:"none",
          title:"请登录后再结算！" + a + "秒后自动跳转到登录页。",
          duration:1200
        })
      },
      // async pay(){
      //   let order = this.cart.filter(item => item.goods_state === true).map(x => ({ goods_id: x.goods_id, goods_number: x.goods_count, goods_price: x.goods_price }))
      //   let payOrder = {
      //     order_price:this.money,
      //     consignee_addr:this.address.provinceName + this.address.cityName + this.address.countyName + this.address.detailInfo,
      //     goods:order
      //   }
      //   const {data:res} = await uni.$http.post("https://api-ugo-web.itheima.net/api/public/v1/my/orders/create",payOrder)
      //   if(res.meta.status !== 200) return uni.$showMsg("创建订单失败！")
      //    // 2. 订单预支付
      //     // 2.1 发起请求获取订单的支付信息
      //     const {data:res2} = await uni.$http.post("https://api-ugo-web.itheima.net/api/public/v1/my/orders/req_unifiedorder",{order_number:res.message.order_number})
      //     if(res2.meta.status !== 200) return uni.$showMsg("预订单生成失败！")
      //     // 3. 发起微信支付
      //     // 3.1 调用 uni.requestPayment() 发起微信支付
      //     const [err,succ] = uni.requestPayment(res2.pay)
      //     if (err) return uni.$showMsg('订单未支付！')
      //     const {data:res3} = await uni.$http.post('https://api-ugo-web.itheima.net/api/public/v1/my/orders/chkOrder',{order_number:res.message.order_number})
      //     // 3.4 检测到订单未支付
      //        if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
      //        // 3.5 检测到订单支付完成
      //        uni.showToast({
      //          title: '支付完成！',
      //          icon: 'success'
      //        })
      // }
    }
  }
</script>

<style lang="scss" scoped>
  .title {
    display: flex;
    height: 40px;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;
    border-bottom: 1px solid #e8e8e8;

    text {
      margin-left: 10px;
    }
  }

  .shop_item {
    border-bottom: 1px solid #e8e8e8;
    padding: 10px 5px;
    display: flex;
    align-items: center;
    justify-content: center;

    image {
      width: 100px;
      height: 100px;
      display: block;
    }

    .jianjie {
      height: 100px;
      display: flex;
      flex-direction: column;
      flex: 1;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
      padding-left: 10px;
      box-sizing: border-box;
      .count {
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: space-between;

        .jiage {
          font-size: 16px;
          color: #c00000;
        }

        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 150px;
          height: 50px;
        }
      }
    }
  }

  .jiesuan {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    left: 0;
    bottom: 0;
    padding-left: 5px;
    width: 100%;
    height: 60px;
    background-color: #e8e8e8;
    z-index: 888;
    .jiesuan_left {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .heji {
        margin-left: 50px;
      }
    }

    .jiesuan_right {
      width: 100px;
      height: 60px;
      background-color: red;
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }

  .shop {
    padding-bottom: 60px;
  }
  .kong{
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 150px;
    image{
      width: 90px;
      height: 90px;
    }
    text{
      font-size: 12px;
      color: gray;
      margin-top: 15px;
    }
  }
</style>
