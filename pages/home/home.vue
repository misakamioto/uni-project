<template>
  <view>
    <!-- 轮播图 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item,index) in swiperList" :key="index">
        <navigator :url='`/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`'>
          <image :src="item.image_src" mode="widthFix"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 导航区 -->
    <view class="nav">
      <view class="nav_item" v-for="(item,index) in navList" :key="index" @click="navClickHandler(item)">
        <image :src="item.image_src" mode="widthFix"></image>
      </view>
    </view>
    <!-- 楼层区 -->
    <view class="floot" v-for="(item,index) in flootList" :key="index">
      <!-- 标题 -->
      <image :src="item.floor_title.image_src" mode="widthFix" class="floor_title"></image>
      <!-- 左侧图片 -->
      <navigator class="floot_left_img" :url="item.product_list[0].url">
        <image :src="item.product_list[0].image_src" mode="widthFix"
        :style="{width: item.product_list[0].image_width + 'rpx'}"></image>
      </navigator>
      <!-- 右侧图片 -->
      <view class="floot_right_img">
        <navigator :url="item2.url" v-for="(item2,index2) in item.product_list" :key="index2" v-if="index2 !== 0">
          <image :src="item2.image_src"   mode="widthFix" :style="{width: item2.image_width + 'rpx'}"></image>
        </navigator>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 轮播图列表
        swiperList:[],
        // 导航列表
        navList:[],
        // 楼层列表
        flootList:[]
      };
    },
    onLoad() {
      // 调用获取轮播图的方法
        this.getSwiperList()
      // 调用获取导航图的方法
        this.getNavList()
      // 调用获取楼层图的方法
        this.getFlootList()
    },
    
    methods:{
      // 获取轮播图的方法
      async getSwiperList(){
        const {data:res} = await uni.$http.get("https://api-ugo-web.itheima.net/api/public/v1/home/swiperdata")
        // 请求失败的情况
        if(res.meta.status !== 200) uni.$showMsg()
        // 请求成功的情况
        else this.swiperList = res.message
      },
      // 获取导航区的方法
      async getNavList(){
        const {data:res} = await uni.$http.get("https://api-ugo-web.itheima.net/api/public/v1/home/catitems")
        // 请求失败的情况
        if(res.meta.status !== 200) uni.$showMsg()
        // 请求成功的情况
        else this.navList = res.message
      },
      // 跳转导航相应页面
      navClickHandler(item){
        if(item.name === "分类"){
          uni.switchTab({
            url:"/pages/cate/cate"
          })
        }
      },
      // 获取楼层图的方法
      async getFlootList(){
        const {data:res} = await uni.$http.get("https://api-ugo-web.itheima.net/api/public/v1/home/floordata")
        // 请求失败的情况
        if(res.meta.status !== 200) uni.$showMsg()
        // 请求成功的情况
        else{
          res.message.forEach(floor =>{
            floor.product_list.forEach(prod =>{
              prod.url = "/subpkg/goods_list/goods_list?" + prod.navigator_url.split("?")[1]
            })
          })
          this.flootList = res.message
        }
      }
    },
  }
</script>

<style lang="scss">
  swiper {
   height: 330rpx;
   swiper-item,
   image {
     width: 100%;
     height: 100%;
   }
  }
  .nav{
    display: flex;
    justify-content: space-around;
    margin: 15px 0;
    image {
      width: 128rpx;
      height: 140rpx;
    }
  }
  .floot{
    margin-top: 15px;
    .floor_title{
      width: 100%;
      height: 100%;
    }
    .floot_left_img{
      float: left;
      padding-left: 5px;
      box-sizing: border-box;
    }
    .floot_right_img{
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      padding-right: 5px;
    }
  }
</style>
