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

    navigator.geolocation.getCurrentPosition((position) =>{
      console.log("position:"+position.coords.longitude)
        let longitude = position.coords.longitude;
        let latitude = position.coords.latitude;
        sessionStorage.setItem(this.$store.state.key.position.longitude, longitude);
        sessionStorage.setItem(this.$store.state.key.position.latitude, latitude);
        this.$store.dispatch('FETCH_POSITION');
    });

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
	color:#999;
}
.order-status.ok{
	color:#57b83b;
}
.order-status.money{
	color:#e2d92a;
}
.order-status.error{
  color:#f00;
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
</style>
