<template>
  <yd-layout class="userIndex">
    <yd-navbar :title="title"></yd-navbar>
    <div class="userTop">
      <img src="static/img/logo.png" alt="" class="userImg">
      <div class="userName">
        <span>{{username}}</span>
      </div>
    </div>
    <yd-cell-group>
        <yd-cell-item type="label">
            <div slot="left">是否自动接单</div>
            <yd-switch slot="right" v-model="ydswitch"></yd-switch>
        </yd-cell-item>
    </yd-cell-group>
    <yd-cell-group style="margin-top:.2rem;">
        <yd-cell-item arrow type="link" href="/shop">
            <yd-icon slot="icon" name="location"></yd-icon>
            <span slot="left">店铺信息</span>
        </yd-cell-item>
    </yd-cell-group>
    <div style="margin:.2rem">
      <yd-button size="large" type="danger" @click.native="logout">
        退出登录
      </yd-button>
    </div>
  </yd-layout>
</template>

<script>
export default {
  name: 'user',
  data () {
    return {
      title:"用户中心",
      username:"用户昵称",
      ydswitch: true
    }
  },
  computed:{
  },
  methods:{
    logout(){
      localStorage.removeItem('login');
      this.$router.replace({name:'login'})
    }
  }
}
</script>
<style scoped>
.userTop{
  height:4rem;
  background-color: #4cd864;
  text-align: center;
  color:#fff;
  padding-top: .8rem;
}
.userImg{
  width:2rem;
  height:2rem;
  border-radius: 50%;
  border:.2rem solid #fff;
}
.userName{
  margin:.2rem auto;
  font-size: .3rem;
}
</style>
