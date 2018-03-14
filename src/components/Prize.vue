<template>
  <div>
    <yd-layout>
      <yd-navbar slot="navbar" title="抽奖兑换码">
        <yd-navbar-back-icon slot="left" @click.native="goBack"></yd-navbar-back-icon>
      </yd-navbar>
      <yd-cell-group>
        <yd-cell-item>
          <span slot="left">用户电话：</span>
          <input v-model="customerPhone" type="tel" max="11" slot="right" required >
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">兑换码数：</span>
          <yd-input v-model="raffleNum" type="number" max="3" slot="right" required ></yd-input>
        </yd-cell-item>
      </yd-cell-group>
      <div style="margin:.2rem">
        <yd-button size="large" type="primary" @click.native="sendRaffle">
          立即发放
        </yd-button>
      </div>
    </yd-layout>
  </div>
</template>
<script>
import {dispatchRaffle} from '../store/fetch'

export default {
  name: 'Shop',
  created() {
    this.init();
  },
  data() {
    return {
      customerPhone:"",
      raffleNum:""
    }
  },
  computed: {
    
  },
  methods: {
  	init(){
  		this.customerPhone = "";
  		this.raffleNum = "";
  	},
  	sendRaffle(){
  		if(this.customerPhone == ""){
  			this.toastError('手机号不能为空')
  			return;
  		}
      if(!/1[3|5|7|8][0-9]{9}/.test(this.customerPhone)){
        this.toastError('手机号格式错误')
        return;
      }
  		if(this.raffleNum == ""){
  			this.toastError('兑换码不能为空')
  			return;
  		}
  		dispatchRaffle({
  			customerPhone:this.customerPhone,
      		raffleNum:this.raffleNum
  		}).then((res) => {
          if (res.data && res.status == 1) {
            this.$dialog.toast({
              "mes": "发放兑换码成功！",
              timeout: 1500,
              icon: 'success'
            })
            this.init();
          } else {
            this.toastError(data.errorInfo);
          }
        }).catch(() => this.toastError('网络异常，请稍后重试！'))
  	}
    
  },
  mounted() {},
}

</script>
<style scoped>


</style>
