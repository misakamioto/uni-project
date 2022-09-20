<template>
  <view>
    <view class="add_address" v-if="address.userName === undefined">
      <button type="primary" size="mini" @click="addAddress">请选择收货地址+</button>
    </view>
    <view class="address" v-else @click="addAddress">
      <view class="top">
        <view class="top_left">收货人：{{address.userName}}</view>
        <view class="top_right">
          <view class="top_right_text">电话：{{address.telNumber}}</view>
          <uni-icons type="forward"></uni-icons>
        </view>
      </view>
      <view class="bottom">收货地址：{{addRess}}</view>
    </view>
    <!-- 底部边框线 -->
    <image src="/static/cart_border@2x.png" ></image>
  </view>
</template>

<script>
  import {mapState} from "vuex"
  export default {
    name:"my-address",
    data() {
      return {
        
      };
    },
    onLoad() {
      console.log("this.address");
    },
    computed:{
      ...mapState("m_address",["address"]),
      addRess(){
        // 拼接 省，市，区，详细地址 的字符串并返回给用户
        return this.address.provinceName + this.address.cityName + this.address.countyName + this.address.detailInfo
      }
    },
    methods:{
      // 选择收货地址
        async addAddress() {
          // 1. 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能
          //    返回值是一个数组：第 1 项为错误对象；第 2 项为成功之后的收货地址对象
          const [err, success] = await uni.chooseAddress().catch(err => err)
      
          // 2. 用户成功的选择了收货地址
          if (err === null && success.errMsg === 'chooseAddress:ok') {
            // 为 data 里面的收货地址对象赋值
            this.$store.commit("m_address/addAddress",success)
          }
        }
    }
  }
</script>

<style lang="scss" scoped>
.add_address{
  width: 100%;
  height: 90px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
image{
  width: 100%;
  height: 5px;
}
.address{
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-size: 12px;
  box-sizing: border-box;
  height: 90px;
  padding: 0 5px;
  .top{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .top_right{
      display: flex;
      align-items: center;
      justify-content: center;
      .top_right_text{
        margin-right: 5px;
      }
    }
  }
}
</style>