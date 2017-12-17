<template>
  <yd-layout>
    <yd-navbar slot="navbar" title="订单详情">
            <router-link to="/index/refresh" slot="left">
                <yd-navbar-back-icon></yd-navbar-back-icon>
            </router-link>
    </yd-navbar>
    <yd-cell-group>
        <yd-cell-item>
            <span slot="left">订单号：{{phoneOrder.serialNumber}}</span>
        </yd-cell-item>
        <yd-cell-item>
            <span slot="left">手机型号：{{phoneOrder.recyclePhoneId}}</span>
        </yd-cell-item>
        <yd-cell-item>
            <span slot="left">回收价格：￥{{phoneOrder.amount}}</span>
        </yd-cell-item>
    </yd-cell-group>
    <yd-cell-group title="手机信息">
        <yd-cell-item type="checkbox" v-for="item in phoneOrder.problemSelects">
            <span slot="left">{{item.problemItem}}</span>
            <template v-if="item.problemItem = '1'">
              <input slot="right" type="checkbox" :value="item.select" v-model="checkedNames"/>
              <yd-icon name="shield-outline" slot="right"></yd-icon>
              <yd-icon name="error-outline" slot="right"></yd-icon>
            </template>
        </yd-cell-item>
     </yd-cell-group>
    <yd-cell-group title="用户信息">
        <yd-cell-item>
            <span slot="left">用户姓名：{{customer.name}}</span>
        </yd-cell-item>
        <yd-cell-item>
            <span slot="left">服务类型：{{serviceType[phoneOrder.serviceType]}}</span>
        </yd-cell-item>
        <yd-cell-item arrow type="a" :href="'tel:'+customer.number">
            <span slot="left">电话：{{customer.number}}</span>
        </yd-cell-item>
        <template v-if="phoneOrder.serviceType === 3">
          <yd-cell-item >
              <span slot="left">快递单号：{{phoneOrder.expressNumber}}</span>
              <span slot="right">{{phoneOrder.userInfo.expressCompany}}</span>
          </yd-cell-item>
        </template>
        <template v-if="phoneOrder.serviceType === 2">
          <yd-cell-item>
              <span slot="left">预约时间：{{phoneOrder.period}}</span>
          </yd-cell-item>
        </template>
        <template v-if="phoneOrder.serviceType === 1">
          <yd-cell-item >
            <span slot="left">上门地址：{{phoneOrder.address}}</span>
          </yd-cell-item>
          <yd-cell-item >
              <span slot="left">预约时间：{{phoneOrder.period}}</span>
          </yd-cell-item>
        </template>
    </yd-cell-group>
    <yd-cell-group title="备注">
        <yd-cell-item>
          <yd-textarea v-model="phoneOrder.remark" slot="right" placeholder="请输入您与客户沟通的备注信息" maxlength="200"></yd-textarea>
        </yd-cell-item>
     </yd-cell-group>
     <yd-button size="large" type="primary" slot="bottom" @click.native="goNext" v-if="phoneOrder.status == 2">
       <span>确认回收</span>
     </yd-button>
     <yd-button size="large" slot="bottom" v-if="phoneOrder.status == 3">
       <span>等待用户确认</span>
     </yd-button>
     <div class="order-cancle" v-if="phoneOrder.status == 4" >
       <div class="order-cancle-txt" style="color:rgb(0, 134, 14)">订单已完成</div>
     </div>
     <div class="order-cancle" v-if="phoneOrder.status == 5" >
       <div class="order-cancle-txt">订单已取消</div>
     </div>
  </yd-layout>
</template>
<script>
export default {
  name: 'RefreshOrder',
  created(){
    this.$dialog.loading.open();
    let {dispatch} = this.$store;
    dispatch('FETCH_RECYCLE_ORDER_ID',{serialNumber:this.$route.params.id})
      .then((data)=>{
        this.$dialog.loading.close();
        if(data.data && data.errorCode === this.$store.state.code['success']){
           dispatch('FETCH_COSTOMER',{customerId:data.data.customerId})
            .then((data)=>{
              this.customer = data.data;
            });
        }else{
          toastError(data.errorInfo);
        }
      }).catch(()=>toastError('网络异常，请稍后重试！'))
  },
  data () {
    return {
      checkedNames: [],
      customer:{},
      serviceType: {
        "1": "上门",
        "2": "门店",
        "3": "邮寄"
      }
    }
  },
  computed: {
    phoneOrder(){
      return this.$store.state.recycle;
    }
  },
  methods:{
    goNext(){
      if(this.phoneOrder.status < 4){
        this.$dialog.loading.open('请求中...');
        setTimeout(()=> {
            this.phoneOrder.status += 1;
            this.$mount();
            this.$dialog.loading.close();
        }, 500);
      }
    }
  }
}
</script>
<style scoped>
</style>
