// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './store/index'

import YDUI from 'vue-ydui';
import 'vue-ydui/dist/ydui.rem.css';


Vue.use(YDUI);

Vue.config.productionTip = false

let flag = false;

Vue.mixin({
  mounted(){
    if(flag) return;
    flag = true;
    var options = { maximumAge: 3000, timeout: 10000,enableHighAccuracy: true };
    navigator.geolocation.getCurrentPosition((position) =>{
        let longitude = position.coords.longitude;
        let latitude = position.coords.latitude;
        localStorage.setItem(this.$store.state.key.position.longitude, longitude);
        localStorage.setItem(this.$store.state.key.position.latitude, latitude);
        this.$store.dispatch('FETCH_POSITION');
        setTimeout(function() {
          flag = false;
        }, 1000);
        if(this.$store.state.producer.id){
          this.$store.dispatch('FETCH_UPLOAD', { serviceStatus: 1 });
        }
    },(e)=>{
      console.log(e)
      this.$dialog.alert({
        mes:"定位失败，请开启GPS定位！"
      });
    },options);

  },
  methods: {
    toastError(mes) {
      this.$dialog.toast({
        mes,
        timeout: 1500,
        icon: 'error',
      });
    },
    goBack(){
      window.history.go(-1);
    }
  }
});

if (window.cordova) {
  function onBackKeyDown(vm) {
    if (vm.$route.path.indexOf('login') < 0 && vm.$route.path.indexOf('index') < 0) {
      history.go(-1);
      return;
    }
    vm.$dialog.toast({
      mes: '再点击一次退出!'
    });
    document.removeEventListener("backbutton", onBackKeyDown, false); // 注销返回键  
    document.addEventListener("backbutton", exitApp, false); //绑定退出事件  
    // 3秒后重新注册  
    var intervalID = window.setInterval(function() {
      window.clearInterval(intervalID);
      document.removeEventListener("backbutton", exitApp, false); // 注销返回键  
      document.addEventListener("backbutton", onBackKeyDown, false); // 返回键  
    }, 3000);
  }

  function exitApp() {
    navigator.app.exitApp();
    return;
    navigator.Backbutton.goHome(function() {
      console.log('go home success');
    }, function(e) {
      console.log(e);
      navigator.app.exitApp();
    });
  }
  document.addEventListener('deviceready', function() {
    var vm = new Vue({
      el: '#app',
      router,
      store,
      template: '<App/>',
      components: { App }
    })
    document.addEventListener("backbutton", function() {
      onBackKeyDown(vm)
    }, false);
    //window.navigator.splashscreen.hide();
  }, false);
} else {
  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
  })
}
