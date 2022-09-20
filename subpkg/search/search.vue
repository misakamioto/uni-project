<template>
  <view>
    <view class="search">
      <uni-search-bar @input="search" placeholder="请输入商品的名称" radius="15" 
      clearButton="none" cancelButton="none" focus="ture" ref="search"></uni-search-bar>
    </view>
    <view class="history" v-if="searchResults.length === 0">
      <view class="history_top">
        <text>搜索历史</text>
        <uni-icons type="trash-filled" size="17" @click="clearHistory"></uni-icons>
      </view>
        <view class="history_list">
          <uni-tag :text="item" v-for="(item,index) in historyList" :key="index" @click="pushSearch(item)"></uni-tag>
        </view>
    </view>
    <view class="search_item" v-for="(item,index) in searchResults" :key="index" @click="gotoDetail(item.goods_id)"
    v-else>  
      <text>{{item.goods_name}}</text>
      <uni-icons type="arrowright" size="16"></uni-icons>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 防抖
        timer:null,
        // 搜索的结果列表
        searchResults:[],
        // 搜索历史
        historyList:["a","b","iphone"]
      };
    },
    // 页面加载时，加载本地存储的搜索历史记录
    onLoad() {
      this.historyList = JSON.parse(uni.getStorageSync("historyList"))
    }, 
    methods:{
      // 防抖
      search(e){
        clearTimeout(this.timer)
        this.timer = setTimeout(()=>{
          this.getSearchResults(e)
        },1000)
      },
      // 关键词搜索
      async getSearchResults(e){
        if(e.trim() === ""){ this.searchResults = []}
        else{
          const {data:res} = await uni.$http.get(`https://api-ugo-web.itheima.net/api/public/v1/goods/search?query=${e}`)
          if(res.meta.status !== 200) uni.$showMsg()
          else{
            this.searchResults = res.message.goods
            this.saveSearchHistory(e)
          }
        }
      },
      // 跳转商品页面
      gotoDetail(goods_id){
        uni.navigateTo({
          url:"/subpkg/goods_detail/goods_detail?goods_id=" + goods_id
        })
      },
      // 清除历史
      clearHistory(){
        this.historyList = []
        uni.setStorageSync("historyList",JSON.stringify(this.historyList))
      },
      // 历史去重
      saveSearchHistory(e){
        // 将 Array 数组转化为 Set 对象
        const set = new Set(this.historyList)
        set.add(e)
        // 将 Set 对象转化为 Array 数组
        this.historyList = Array.from(set)
        uni.setStorageSync("historyList",JSON.stringify(this.historyList))
      },
      // 历史项插入搜索框
      pushSearch(history){
        this.$refs.search.value = history
      }
    }
  }
</script>

<style lang="scss">
.search{
  background-color: red;
  position: sticky;
  top: 0;
  zin: 999;
}
.search_item{
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #e8e8e8;
  padding: 13px 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  text{
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.history{
  padding: 0 5px;
  .history_top{
    height: 40px;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text{
      font-size: 13px;
    }
  }
  .history_list{
    display: block;
    flex-wrap: wrap;
    .uni-tag{
      margin-top: 5px;
      margin-right: 5px;
    }
  }
}
</style>
