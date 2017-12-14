<template>
  <div class="index">
    <yd-flexbox align='center' direction='vertical' style='margin-top:1rem'>
        <yd-flexbox-item align='center'><img src="static/img/logo.png" alt=""></yd-flexbox-item>
        <yd-flexbox-item align='center'><h1 style="margin:.4rem 0;font-size:.6rem">创手机-服务</h1></yd-flexbox-item>
    </yd-flexbox>
    <yd-cell-group>
      <yd-cell-item>
        <yd-icon slot="icon" name="phone3" size=".45rem"></yd-icon>
        <input v-model="number" slot="right" type="number" placeholder="请输入手机号">
      </yd-cell-item>
      <yd-cell-item>
        <img slot="icon" src="static/img/lock.png" style="height:.5rem" />
        <yd-input slot="right" type="password" v-model="password" placeholder="请输入密码"></yd-input>
      </yd-cell-item>
    </yd-cell-group>
    <div style='margin:.2rem'>
      <yd-button size="large" type="primary" @click.native="login">
        登录
      </yd-button>
    </div>
    <div @click="openForget" style="display:none;margin:.4rem .3rem;font-size:.28rem;line-height:.5rem; text-align:right;color:#777;">
      <img src="static/img/forget.png" style="height:.38rem;display:inline-block;vertical-align:middle;" />
      <span style="display:inline-block;vertical-align:middle;">忘记密码</span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'login',
  computed: {
    
  },
  data () {
    return {
      passwordShow: false,
      number:"",
      password:""
    }
  },
  created () {
  },
  methods:{
    login(){
      this.$dialog.loading.open('正在登录...');
      let submitData = {
        number: this.number,
        password : this.password
      }
      this.$store.dispatch('FETCH_LOGIN',submitData).
          then((data)=>{
            this.$dialog.loading.close();
            if (this.$store.state.code["success"] == data.errorCode) {
              sessionStorage.setItem(this.$store.state.key['login'],JSON.stringify(data));
              this.$store.dispatch('FETCH_LOGIN_CACHE')
              this.$router.replace({name:'index'});
            } else {
              this.toastError(data.errorInfo);
            }
          }).catch((e) => {
            console.log(e)
            this.toastError('网络错误请稍后重试！');
          });
    },
    openForget() {
      this.$router.push({ name: 'forget' })
    }
  }

}
</script>
<style scoped>

</style>
