export default{
  namespaced: true,
  mutations:{
    addAddress(state,value){
      state.address = value
      this.commit("m_address/change")
    },
    change(state){
      uni.setStorageSync("address",JSON.stringify(state.address))
    },
    addUserInfo(state,value){
      state.userInfo = value
      uni.setStorageSync("userInfo",JSON.stringify(state.userInfo))
    },
    addToken(state,value){
      state.token = value
      uni.setStorageSync("token",JSON.stringify(state.token))
    },
    remove(state){
      state.address = ""
      state.token = ""
      state.userInfo = ""
      uni.setStorageSync("address",JSON.stringify(state.address))
      uni.setStorageSync("token",JSON.stringify(state.token))
      uni.setStorageSync("userInfo",JSON.stringify(state.userInfo))
    },
    addHistoryPage(state,value){
      state.historypage = value
    },
    removeHistoryPage(state){
      state.historypage = null
    }
  },
  state:{
    address:JSON.parse(uni.getStorageSync("address") || ""),
    token:JSON.parse(uni.getStorageSync("token") || ""),
    userInfo:JSON.parse(uni.getStorageSync("userInfo") || "") ,
    historypage:null
  }
}