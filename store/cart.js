export default {
  namespaced: true,
  state: {
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync("cart") || "[]"),
    // 购物车商品总数
    cartCount: JSON.parse(uni.getStorageSync("cartCount") || "0"),
    isCheckAll:JSON.parse(uni.getStorageSync("isCheckAll") || "false"),
  },
  mutations: {
    addToCart(state, value) {
      let a = state.cart.find(item => item.goods_id === value.goods_id)
      if (a === undefined) state.cart.push(value)
      else {
        a.goods_count++
      }
      this.commit("m_cart/onloadcart")
      this.commit("m_cart/cartcount")
    },
    cartcount(state) {
      state.cartCount = 0
      let a = state.cart.filter(item => item.goods_state === true)
      a.forEach(item => {
        state.cartCount += item.goods_count
      })
      uni.setStorageSync("cart", JSON.stringify(state.cart))
      uni.setStorageSync("cartCount", JSON.stringify(state.cartCount))
      uni.setStorageSync("isCheckAll", JSON.stringify(state.isCheckAll))
    },
    changeRadio(state, value) {
      let a = state.cart.find(item => item.goods_id === value)
      a.goods_state = !a.goods_state
      this.commit("m_cart/onloadcart")
      this.commit("m_cart/cartcount")
    },
    JIA(state, value) {
      let a = state.cart.find(item => item.goods_id === value)
      a.goods_count++
      this.commit("m_cart/cartcount")
    },
    JIAN(state, value) {
      let a = state.cart.find(item => item.goods_id === value)
      let b
      for (let i = 0; i < state.cart.length; i++) {
        if (state.cart[i].goods_id === value) {
          b = i
          break
        }
      }
      a.goods_count--
      if (a.goods_count === 0) {
        state.cart.splice(b, 1)
      }
      this.commit("m_cart/cartcount")
    },
    checkAll(state) {
      const a = state.cart.find(item => item.goods_state === false)
      if (a !== undefined) {
        for (let i = 0; i < state.cart.length; i++) {
          state.cart[i].goods_state = true
        }
        state.isCheckAll = true
      } else {
        for (let i = 0; i < state.cart.length; i++) {
          state.cart[i].goods_state = false
        }
        state.isCheckAll = false
      }
      this.commit("m_cart/cartcount")
    },
    removeShop(state,value){
      for(let i = 0;i < state.cart.length;i++){
        if(state.cart[i].goods_id === value){
          state.cart.splice(i,1)
          break
        }
      }
      if(state.cart.length === 0) state.isCheckAll = false
      this.commit("m_cart/cartcount")
    },
    onloadcart(state){
      let a = 0
      for(let i = 0;i < state.cart.length;i++){
        if(state.cart[i].goods_state === true) a++
        else break
      }
      if(a === state.cart.length && a !== 0) state.isCheckAll = true
      else state.isCheckAll = false
    }
  },
  getters: {}
}
