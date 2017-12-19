<template>
  <div id="app">
  		<router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  beforeCreate(){
  	this.$store.dispatch('FETCH_LOGIN_CACHE');
    if(!this.$store.state.producer.id){
      this.$router.replace({name:'login'});
    }

  },
}
</script>

<style>
#app{
	height:100%;
}
.order-box{
	margin:0 .2rem;
}
.order-title{
	font-size: .38rem;
	margin: .2rem 0;
}
.order-status{
	font-size: .28rem;
	margin-bottom: .2rem;
	color:rgb(255, 94, 83);
}
.order-status.ok{
	color:#57b83b;
}
.order-status.money{
	color:#968f04;
}
.order-status.error{
  color:#999;
}
.order-img{
	width: .6rem !important;
	height: .5rem !important;
}
.index-tabs {
	padding-top: .85rem;
}
.index-tabs .yd-tab{
	position: fixed;
	top:0;
	left:0;
    z-index: 7;
    width: 100%;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
  opacity: 0
}
.order-result{
  padding:.5rem;
  text-align: center;
  background: #fff;
  margin-bottom: .2rem;
  font-size: .5rem;
}
</style>
