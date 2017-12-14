<template>
  <yd-layout>
    <yd-navbar slot="navbar" title="订单详情">
            <router-link to="index/refresh" slot="left">
                <yd-navbar-back-icon></yd-navbar-back-icon>
            </router-link>
    </yd-navbar>
    <yd-cell-group>
        <yd-cell-item>
            <span slot="left">订单号：{{phoneOrder.id}}</span>
        </yd-cell-item>
        <yd-cell-item>
            <span slot="left">手机型号：{{phoneOrder.phoneType}}</span>
        </yd-cell-item>
        <yd-cell-item>
            <span slot="left">回收价格：￥{{phoneOrder.offerPrice}}</span>
        </yd-cell-item>
    </yd-cell-group>
    <yd-cell-group title="手机信息">
        <yd-cell-item type="checkbox" v-for="item in phoneOrder.problems">
            <span slot="left">{{item.problemName}}：{{item.select}}</span>
            <input slot="right" type="checkbox" :value="item.select" v-model="checkedNames" v-if="phoneOrder.status == 2"/>
            <yd-icon name="shield-outline" slot="right" v-if="phoneOrder.status > 2 && checkedNames.indexOf(item.select)>=0"></yd-icon>
            <yd-icon name="error-outline" slot="right" v-if="phoneOrder.status > 2 && checkedNames.indexOf(item.select)<0"></yd-icon>
        </yd-cell-item>
     </yd-cell-group>
    <yd-cell-group title="用户信息">
        <yd-cell-item>
            <span slot="left">用户姓名：{{phoneOrder.userInfo.userName}}</span>
        </yd-cell-item>
        <yd-cell-item>
            <span slot="left">服务类型：{{phoneOrder.userInfo.serviceType}}</span>
        </yd-cell-item>
        <yd-cell-item arrow type="a" :href="'tel:'+phoneOrder.userInfo.tel">
            <span slot="left">电话：{{phoneOrder.userInfo.tel}}</span>
        </yd-cell-item>
        <template v-if="phoneOrder.serviceType === 3">
          <yd-cell-item arrow >
              <span slot="left">快递单号：{{phoneOrder.userInfo.courierId}}</span>
              <span slot="right">{{phoneOrder.userInfo.expressCompany}}</span>
          </yd-cell-item>
        </template>
        <template v-if="phoneOrder.serviceType === 2">
          <yd-cell-item arrow>
              <span slot="left">预约时间：{{phoneOrder.userInfo.serviceTime}}</span>
          </yd-cell-item>
        </template>
        <template v-if="phoneOrder.serviceType === 1">
          <yd-cell-item arrow>
            <span slot="left">上门地址：{{phoneOrder.userInfo.serviceAddr}}</span>
          </yd-cell-item>
          <yd-cell-item arrow>
              <span slot="left">预约时间：{{phoneOrder.userInfo.serviceTime}}</span>
          </yd-cell-item>
        </template>
    </yd-cell-group>
    <yd-cell-group title="备注">
        <yd-cell-item>
          <yd-textarea slot="right" placeholder="请输入您与客户沟通的备注信息" maxlength="200"></yd-textarea>
        </yd-cell-item>
     </yd-cell-group>
     <yd-button size="large" type="primary" slot="bottom" @click.native="goNext">
       <span v-if="phoneOrder.status == 1">马上出发</span>
       <span v-if="phoneOrder.status == 2">确认回收</span>
       <span v-if="phoneOrder.status == 3">等待用户确认</span>
       <span v-if="phoneOrder.status == 4">已完成</span>
     </yd-button>
  </yd-layout>
</template>
<script>
export default {
  name: 'RefreshOrder',
  data () {
    return {
      checkedNames: [],
    }
  },
  computed: {
    phoneOrder(){
      return {
        id:"12123213213123",
        phoneType:"iphone 6s",
        price:2800,
        offerPrice: 400,
        problems:[{
          problemName: "容量",
          select: "16G",
          discount: 0.02
        },{
          problemName: "屏幕外观",
          select: "明显划痕",
          discount: 0.02
        },{
          problemName: "维修记录",
          select: "拆修过",
          discount: 0.12
        }],
        status: 1,//0 未填写完成， 1 用户下单 ，2服务方确认，3服务方完成，4 用户确认完成 ，5 取消 
        serviceType: 1,  //服务类型：1请求上门 2 门店地址 3邮寄地址
        userInfo:{
          userName:"用户昵称",
          expressCompany: "快递公司名称", //快递公司名称
          courierId: "xxxxxxxxx ",  //快递单号
          tel:"123123123123",
          serviceAddr: "广东省xxxxxxx",
          serviceTime: "2014-22-11 10:10:11"
        }
      };
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
