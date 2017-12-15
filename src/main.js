// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import YDUI from 'vue-ydui';
import 'vue-ydui/dist/ydui.rem.css';


Vue.use(YDUI);

Vue.config.productionTip = false

let flag = false;

Vue.mixin({
  beforeCreate(){
    if(flag) return;
    flag = true;
    navigator.geolocation.getCurrentPosition((position) =>{
        console.log("position:"+position.coords.longitude)
        let longitude = position.coords.longitude;
        let latitude = position.coords.latitude;
        sessionStorage.setItem(this.$store.state.key.position.longitude, longitude);
        sessionStorage.setItem(this.$store.state.key.position.latitude, latitude);
        this.$store.dispatch('FETCH_POSITION');
        setTimeout(function() {
          flag = false;
        }, 1000);
    });

  },
  methods: {
    toastError(mes) {
      this.$dialog.toast({
        mes,
        timeout: 1500,
        icon: 'error',
      });
    },
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
