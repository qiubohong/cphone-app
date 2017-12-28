<template>
	<yd-layout>
	    <yd-navbar slot="navbar" title="转派订单">
	      <yd-navbar-back-icon slot="left" @click.native="goBack"></yd-navbar-back-icon>
	    </yd-navbar>
	    <div>
	    	<yd-search v-model="number" :result="list" placeholder="请输入电话" :on-submit="submitHandler"></yd-search>
	    	yd
	    </div>
    </yd-layout>
</template>
<script>
export default {
  name: 'refreshTrans',
  created() {
    
  },
  data(){
  	return {
  		number:"",
  		list:[]
  	}
  },
  watch: {
    number(val) {
        this.result = this.getResult(val);
    }
  },
  methods:{
  	getResult(val){
  		if(val.length != 11){
  			return;
  		}
  		console.log(val)
  	},
  	submitHandler(){

  	}
  }
}
</script>