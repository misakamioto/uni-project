import Vue from "vue"
import Vuex from "vuex"
import moduleCart from "@/store/cart.js"
import moduleaddress from "@/store/address.js"

Vue.use(Vuex)

export default new Vuex.Store({
  modules:{
    m_cart:moduleCart,
    m_address:moduleaddress
  }
})