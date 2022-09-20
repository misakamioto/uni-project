<template>
  <view>
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular>
      <swiper-item v-for="(item,index) in goods_info.pics" :key="index" @click="preview(index)">
        <image :src="item.pics_big" mode="widthFix"></image>
      </swiper-item>
    </swiper>
    <text class="jiage">￥{{toFixed}}</text>
    <view class="sh_name">
      <view class="sh_name_text">{{goods_info.goods_name}}</view>
      <view class="sh_name_sc">
        <uni-icons type="star" size="18" color="gray"></uni-icons>
        <text>收藏</text>
      </view>
    </view>
    <text class="yunf">快递，免运费</text>
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>
    <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
      @buttonClick="buttonClick" />
  </view>
</template>

<script>
  import {
    mapState
  } from "vuex"
  export default {
    data() {
      return {
        goods_id: "",
        // 商品对象
        goods_info: {},
        options: [{
          icon: 'shop',
          text: '店铺',
          info: 0,
          infoBackgroundColor: '#007aff',
          infoColor: "red"
        }, {
          icon: 'cart',
          text: '购物车',
          info: 0
        }],
        buttonGroup: [{
            text: '加入购物车',
            backgroundColor: '#ff0000',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: '#ffa200',
            color: '#fff'
          }
        ]
      };
    },
    onLoad(options) {
      this.goods_id = options.goods_id
      this.getDetail()
    },
    computed: {
      toFixed() {
        return this.goods_info.goods_price.toFixed(2)
      },
      ...mapState('m_cart', ['cartCount'])
    },
    watch:{
      cartCount:{
        handler(){
          this.options[1].info = this.cartCount
        },
        immediate:true
      }
    },
    methods: {
      async getDetail() {
        const {
          data: res
        } = await uni.$http.get(
          `https://api-ugo-web.itheima.net/api/public/v1/goods/detail?goods_id=${this.goods_id}`)
        if (res.meta.status !== 200) uni.$shouMsg()
        else {
          res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, "<img style='display:block;'")
            .replace(/webp/g, "jpg")
          this.goods_info = res.message
        }
      },
      preview(index) {
        console.log(index);
        uni.previewImage({
          current: index,
          urls: this.goods_info.pics.map(item => item.pics_big)
        })
      },
      onClick(e) {
        if (e.content.text === "购物车") {
          uni.switchTab({
            url: "/pages/cart/cart"
          })
        }
      },
      buttonClick(e) {
        if (e.content.text === "加入购物车") {
          this.$store.commit("m_cart/addToCart", {
            goods_id: this.goods_info.goods_id, // 商品的Id
            goods_name: this.goods_info.goods_name, // 商品的名称
            goods_price: this.goods_info.goods_price, // 商品的价格
            goods_count: 1, // 商品的数量
            goods_small_logo: this.goods_info.goods_small_logo, // 商品的图片
            goods_state: true
          }) // 商品的勾选状态
        }
        else{
          
        }
      }
    }
  }
</script>

<style lang="scss">
  swiper {
    height: 750rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .jiage {
    color: red;
    font-size: 18px;
    margin: 10px 0;
  }

  .sh_name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 5px;

    .sh_name_text {
      font-size: 13px;
      padding-right: 5px;
      border-right: 1px solid #e8e8e8;
    }

    .sh_name_sc {
      display: flex;
      width: 120px;
      font-size: 12px;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      color: gray;
    }
  }

  .yunf {
    margin: 10px 0;
    font-size: 12px;
    color: gray;
  }

  .rich-text {
    padding-bottom: 50px;
  }

  uni-goods-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
</style>
