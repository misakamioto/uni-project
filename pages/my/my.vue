<template>
  <view>
    <view class="login" v-if="token === ''">
      <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
      <button type="warn" size="default" @click="getuserinfo">一键登录</button>
      <text>登陆后尽享更多权益</text>
    </view>
    <view class="user" v-else>
      <view class="top">
        <image :src="userInfo.avatarUrl" mode=""></image>
        <view class="username">{{userInfo.nickName}}</view>
      </view>
      <view class="zuji">
        <view class="zuji_my">
          <view class="number">1</view>
          <view class="text">收藏的店铺</view>
        </view><view class="zuji_my">
          <view class="number">1</view>
          <view class="text">收藏的商品</view>
        </view><view class="zuji_my">
          <view class="number">1</view>
          <view class="text">关注的商品</view>
        </view><view class="zuji_my">
          <view class="number">1</view>
          <view class="text">足迹</view>
        </view>
      </view>
      <view class="my_dingdan">
        <view class="text">我的订单</view>
        <view class="logo">
          <view class="logo_item">
            <image src="/static/my-icons/icon1.png" mode=""></image>
            <text>待付款</text>
          </view>
          <view class="logo_item">
            <image src="/static//my-icons/icon2.png" mode=""></image>
            <text>待收货</text>
          </view>
          <view class="logo_item">
            <image src="/static/my-icons/icon3.png" mode=""></image>
            <text>退款/退货</text>
          </view>
          <view class="logo_item">
            <image src="/static/my-icons/icon4.png" mode=""></image>
            <text>全部订单</text>
          </view>
        </view>
      </view>
      <view class="shouhuo">
        <view class="shouhuo_item">
          <text>收货地址</text>
          <uni-icons type="forward" size="15"></uni-icons>
        </view>
        <view class="shouhuo_item">
          <text>联系客服</text>
          <uni-icons type="forward" size="15"></uni-icons>
        </view>
        <view class="shouhuo_item" @click="logout">
          <text>退出登录</text>
          <uni-icons type="forward" size="15"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import badgeMix from "@/mixins/tabbar-badge.js"
  import {mapState} from "vuex"
  export default {
    data() {
      return {
        
      };
    },
    mixins:[badgeMix],
    computed:{
      ...mapState("m_address",["userInfo","token","historypage"])
    },
    methods:{
      async getuserinfo(){
        const res = await uni.getUserProfile({desc:"登录授权"}).catch(err => err)
        if(res.length === 1) return uni.$showMsg("您取消了登录授权！")
        this.getToken(res[1])
        this.$store.commit("m_address/addUserInfo",res[1].userInfo)
      },
      async getToken(userInfo){
        const[err,res] = await uni.login({
          onlyAuthorize:true
        }).catch(err => err)
        if(err || res.errMsg !== "login:ok") return uni.$showMsg("登录失败！")
        const query = {
            code: res.code,
            encryptedData: userInfo.encryptedData,
            iv: userInfo.iv,
            rawData: userInfo.rawData,
            signature: userInfo.signature
          }
        const {data:token} = await uni.$http.post("https://api-ugo-web.itheima.net/api/public/v1/users/wxlogin",query).catch(err => err)
        if(token.meta.status !== 400) return uni.$showMsg("登录失败！")
          const msg = token.msg || {}
          if(token.meta.status === 400){
            // 自定义token
            let n = ""
            for(let i = 0;i < 32;i++){
              n += Math.floor(Math.random()*16).toString(16)
            }
            // 黑马官方token
            // let n = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
            msg.token = n
            this.$store.commit("m_address/addToken",msg.token)
            if(this.historypage && this.historypage.opentype === "switchTab"){
              uni.switchTab({
                url:this.historypage.url,
                success:() => {
                  this.$store.commit("m_address/removeHistoryPage")
                }
              })
            }
          }
      },
      async logout(){
        const succ = await uni.showModal({
          title:"提示",
          content:"确认退出登录吗？"
        }).catch(err => err)
        if(succ[1].confirm === true) this.$store.commit("m_address/remove")
      }
    }
  }
</script>

<style lang="scss" scoped>
.login{
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 150px;
  button{
    width: 90%;
    border-radius: 100px;
    margin: 15px 0;
    background-color: #c00000;
  }
  text{
    font-size: 12px;
    color: gray;
  }
}
page{
  background-color: #e8e8e8;
}
.top{
  height: 400rpx;
  background-color: #c00000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  image{
    width: 90px;
    height: 90px;
    border-radius: 45px;
    border: 2px solid white;
    box-shadow: 0 1px 5px black;
  }
  .username{
    color: white;
    font-weight: bold;
    font-size: 16px;
    margin-top: 10px;   
  }
}
.zuji{
  width: 90%;
  margin-left: 5%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: relative;
  border-radius: 3px;
  transform: translateY(-20%);
  .zuji_my{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    padding: 10px 0;
  }
}
.my_dingdan{
  width: 90%;
  margin-left: 5%;
  padding: 10px 5px;
  display: flex;
  background-color: white;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 3px;
  font-size: 15px;
  .logo{
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .logo_item{
      font-size: 14px;
      display:flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      image{
        width: 35px;
        height: 35px;
      }
    }
  }
}
.shouhuo{
  width: 90%;
  margin-top: 10px;
  margin-left: 5%;
  padding: 0 10px;
  box-sizing: border-box;
  border-radius: 3px;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: white;
  justify-content: space-around;
  .shouhuo_item{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    font-size: 15px;
  }
}
</style>
