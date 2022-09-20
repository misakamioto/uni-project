<template>
  <view>
    <my-search @click.native="gotoSearch"></my-search>
    <!-- 左侧分类 -->
    <view class="scroll">
      <scroll-view class="left_scroll" scroll-y="true" :style="'height:' + windowHeight + 'px'">
        <view :class="'left_scroll_item' + (index === active ? ' active' : '')" v-for="(item,index) in cateList"
          :key="index" @click="isActive(index)">{{item.cat_name}}</view>
      </scroll-view>
      <!-- 右侧分类 -->
      <scroll-view class="right_scroll" scroll-y="true" :style="'height:' + windowHeight + 'px'" :scroll-top="scrollTop">
        <view class="right_scroll_item" v-for="(item,index) in cateList[active].children" :key="index">
          <!-- 标题 -->
          <view class="right_scroll_text">/{{item.cat_name}}/</view>
          <!-- 图片与文本 -->
          <view class="right_scroll_txtimg">
            <view class="right_scroll_image" v-for="(item2,index2) in item.children" :key="index2" 
            @click="toGoogdList(item2.cat_id)">
              <image :src="item2.cat_icon.replace('dev','web')" mode="heightFix"></image>
              <text>{{item2.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

  </view>
</template>

<script>
  import badgeMix from "@/mixins/tabbar-badge.js"
  export default {
    mixins:[badgeMix],
    data() {
      return {
        // 窗口可用大小
        windowHeight: 0,
        // 分类列表
        cateList: [],
        // 是否激活
        active: 0,
        // 滚动条距离顶部的距离
        scrollTop: 0
      };
    },
    onLoad() {
      // 获取窗口可用大小
      const sysInfo = uni.getSystemInfoSync()
      this.windowHeight = sysInfo.windowHeight - 50
      // 获取分类列表
      this.getCateList()
    },
    methods: {
      // 获取分类列表
      async getCateList() {
        const {
          data: res
        } = await uni.$http.get("https://api-ugo-web.itheima.net/api/public/v1/categories")
        if (res.meta.status !== 200) uni.$showMsg()
        else this.cateList = res.message
      },
      // 激活项样式
      isActive(index) {
        this.active = index
        this.scrollTop = (this.scrollTop === 0?1:0)
      },
      // 点击跳转商品列表页
      toGoogdList(cat_id){
        uni.navigateTo({
          url:`/subpkg/goods_list/goods_list?cat_id=${cat_id}`
        })
      },
      // 点击搜索框跳转搜索页面
      gotoSearch(){
        uni.navigateTo({
          url:"/subpkg/search/search"
        })
      }
    },
  }
</script>

<style lang="scss">
  .scroll {
    display: flex;

    .left_scroll {
      width: 120px;

      .left_scroll_item {
        text-align: center;
        line-height: 60px;
        background-color: #efefef;
        font-size: 12px;

        &.active {
          background-color: white;
          position: relative;

          &::before {
            content: "";
            display: block;
            width: 3px;
            height: 30px;
            background-color: red;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }

    .right_scroll {
      background-color: white;

      .right_scroll_text {
        text-align: center;
        line-height: 50px;
        font-weight: bold;
      }

      .right_scroll_txtimg {
        display: flex;
        flex-wrap: wrap;

        .right_scroll_image {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          text-align: center;
          align-items: center;
          width: 33.33%;
          margin-bottom: 10px;
          float: left;

          image {
            height: 60px;
            width: 60px;
          }

          font-size: 12px;
        }
      }
    }
  }
</style>
