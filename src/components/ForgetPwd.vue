<template>
  <yd-layout>
        <yd-navbar slot="navbar" title="忘记密码">
            <router-link to="/login" slot="left">
                <yd-navbar-back-icon></yd-navbar-back-icon>
            </router-link>
        </yd-navbar>
        
  <yd-cell-group v-if="!update">
          <yd-cell-item>
            <yd-icon slot="icon" name="phone3" size=".45rem"></yd-icon>
            <input  slot="right" type="number" placeholder="请输入手机号">
          </yd-cell-item>
          <yd-cell-item>
            <yd-icon slot="icon" name="shield-outline" size=".45rem"></yd-icon>
            <input type="text" slot="right" placeholder="请输入验证码">
            <!-- ↓↓关键代码是这里↓↓ -->
            <yd-sendcode slot="right" 
                         v-model="start1" 
                         @click.native="sendCode1" 
                         type="warning"
            ></yd-sendcode>
            <!-- ↑↑关键代码是这里↑↑ -->
          </yd-cell-item>
   </yd-cell-group>
  <transition name="fade">
  <yd-cell-group v-if="update">
        <yd-cell-item>
            <span slot="left">新密码：</span>
            <yd-input slot="right" type="password" v-model="pwd" placeholder="请输入新密码"></yd-input>
        </yd-cell-item>
          <yd-cell-item>
            <span slot="left">确认密码：</span>
            <yd-input slot="right" type="password" v-model="pwd2" placeholder="请确认新密码"></yd-input>
          </yd-cell-item>
        </yd-cell-group>
  </transition>
    <div style='margin:.2rem'>
      <yd-button size="large" type="primary" @click.native="certisfy" v-if="!update">
        下一步
      </yd-button>
      
  <transition name="fade">
      <yd-button size="large" type="danger" v-if="update">
        确认修改
      </yd-button>
  </transition>
    </div>
    </yd-layout>
</template>

<script>

export default {
  name: 'forget',
  computed: {
    
  },
  data () {
    return {
      update: false,
      start1: false,
      pwd:"",
      pwd2:""
    }
  },
  created () {
  },
  methods:{
    sendCode1() {
      this.$dialog.loading.open('发送中...');
                setTimeout(() => {

                    this.start1 = true;
                    this.$dialog.loading.close();

                    this.$dialog.toast({
                        mes: '已发送',
                        icon: 'success',
                        timeout: 1500
                    });

      }, 1000);
    },
    certisfy(){
      this.update = true;
    }
  }

}
</script>
<style scoped>

</style>
