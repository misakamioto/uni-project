<template>
  <view>
    <view class="goods_list">
      <my-goods :goodsList="goodsList" @click="gotoDetail"></my-goods>
    </view>
  </view>
</template>

<script>
  export default {
    
    data() {
      return {
        queryObj:{
          // 查询关键词
        query:'',
        // 分类id
        cid:'',
        // 页码
        pagenum:1,
        // 页容量
        pagesize:10,
        },
        // 商品列表
        goodsList:[],
        // 总数量，实现分页
        total:0,
        // 节流阀
        isloading:false
      };
    },
    onLoad(options) {
      this.queryObj.query = options.query || ""
      this.queryObj.cid = options.cat_id || ""
      // 获取商品列表
      this.getGoodsList()
    },
    onReachBottom() {
      this.queryObj.pagenum += 1
      if(!this.isloading)this.getGoodsList()
      if(this.queryObj.pagenum*this.queryObj.pagesize >= this.total){uni.$showMsg("数据已全部加载")}
    },
    onPullDownRefresh() {
      this.goodsList = []
      this.total = 0
      this.queryObj.pagenum = 1
      this.getGoodsList()
    },
    methods:{
      async getGoodsList(){
        this.isloading = true
        const {data:res} = await uni.$http.get(`https://api-ugo-web.itheima.net/api/public/v1/goods/search`,this.queryObj)
        this.isloading = false
        if(res.meta.status !== 200) uni.$showMsg()
        else{
           this.goodsList = [...this.goodsList,...res.message.goods]
           this.total = res.message.total
           uni.stopPullDownRefresh()
        }
      },
      gotoDetail(){
        this.$emit("gotoDetail")
      }
    }
  }
</script>

<style lang="scss">

</style>
