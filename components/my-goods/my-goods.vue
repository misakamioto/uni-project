<template>
  <view>
    <view class="goods_item" v-for="(item,index) in goodsList" :key="index" @click="gotoDetail(item.goods_id)">
      <view class="goods_image">
        <image :src="item.goods_small_logo" mode="widthFix"></image>
      </view>
      <view class="goods_right">
        <view class="goods_right_jianjie">{{item.goods_name}}</view>
        <view class="goods_right_jiage">￥{{toFixed(item.goods_price)}}</view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-goods",
    props:{
      goodsList:{
        type:Array,
        default:[]
      }
    },
    data() {
      return {
        
      };
    },
    methods:{
      toFixed(num){
        return Number(num).toFixed(2)
      },
      gotoDetail(goods_id){
        uni.navigateTo({
          url:"/subpkg/goods_detail/goods_detail?goods_id=" + goods_id
        })
      }
    }
  }
</script>

<style lang="scss">
.goods_item{
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 5px;
  border-bottom: 1px solid #f0f0f0;
  .goods_image{
    margin-right: 5px;
    image{
    width: 100px;
    height: 100px;
    display: block;
  }
  }
  
  .goods_right{
    display: flex;
    height: 100px;
    flex-direction: column;
    justify-content: space-between;
    font-size: 13px;
    .goods_right_jiage{
      font-size: 16px;
      color: #ff0000;
  }
  }
  
}
</style>