<template>
  <view class="my-search">
    <view class="search">
      <uni-icons type="search" size="17" color="blank"></uni-icons>
      <text>搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-search",
    data() {
      return {
        
      };
    }
  }
</script>

<style lang="scss">
  .my-search{
    background-color: red;
    height: 50px;
    padding: 0 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
.search{
  display: flex;
  height: 36px;
  background-color: #FFFFFF;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
  text{
    font-size: 15px;
    margin-left: 5px;
  }
}
</style>