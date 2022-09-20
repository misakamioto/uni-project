import {
  mapState
} from "vuex"
export default {

  onShow(){
    this.setBadge()
  },
  computed: {
    ...mapState("m_cart", ["cart", "cartCount","isCheckAll"])
  },
  watch:{
    cartCount:{
      handler(){
        this.setBadge()
      },
      immediate:true
    }
  },
  methods: {
    setBadge() {
      if (this.cartCount !== 0) {
        uni.setTabBarBadge({
          index: 2,
          text: String(this.cartCount)
        })
      }
      else{
        uni.removeTabBarBadge({
          index:2
        })
      }
    }
  }
}
