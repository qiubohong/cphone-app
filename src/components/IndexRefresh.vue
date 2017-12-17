<template>
  <div class="index-tabs">
    <yd-layout>
    <yd-tab :callback="tabsChange">
          <yd-tab-panel label="全部" tabkey="0"></yd-tab-panel>
          <yd-tab-panel label="已接单" tabkey="2"></yd-tab-panel>
          <yd-tab-panel label="服务完成" tabkey="3"></yd-tab-panel>
          <yd-tab-panel label="确认中" tabkey="4"></yd-tab-panel>
          <yd-tab-panel label="已取消" tabkey="5"></yd-tab-panel>
    </yd-tab> 
    <div v-if="recycles.length == 0" style="text-align:center;padding:1rem 0;color:#ccc;font-size:.28rem;">
      暂无数据
    </div>
    <yd-pullrefresh :callback="loadList" ref="pullrefreshDemo" v-if="recycles.length > 0">
            <yd-cell-group>
                <yd-cell-item arrow type="link" :href="'/refreshOrder/'+item.serialNumber" v-for="item in recycles">
                    <yd-icon slot="icon" name="warn" v-if="item.serviceType == 1"></yd-icon>
                    <yd-icon slot="icon" name="footmark" v-if="item.serviceType == 2"></yd-icon>
                    <yd-icon slot="icon" name="checkoff" color="#57b83b" v-if="item.serviceType == 3"></yd-icon>
                    <img slot="icon" src="static/img/money.png" class="order-img"  v-if="item.serviceType == 4"/>
                    <yd-icon slot="icon" name="error" color="#f00" v-if="item.serviceType == 5"></yd-icon>
                    <span slot="left">
                        <div class="order-box">
                          <div class="order-title">iphone6</div>
                          <div class="order-status" v-if="item.serviceType == 1">下单中</div>
                          <div class="order-status" v-if="item.serviceType == 2">已接单</div>
                          <div class="order-status ok" v-if="item.serviceType == 3">服务完成</div>
                          <div class="order-status money" v-if="item.serviceType == 4">确认中</div>
                          <div class="order-status error" v-if="item.serviceType == 5">取消</div>
                        </div>
                    </span>
                    <span slot="right">￥{{item.amount}}</span>
                </yd-cell-item>
            </yd-cell-group>
    </yd-pullrefresh>
    </yd-layout>
  </div>
</template>
<script>
export default {
  name: 'IndexRefresh',
  created(){
    this.getRecycle();
  },
  data () {
    return {
      selectKey: 0,
      recycles:[],
    }
  },
  computed:{
  },
  watch:{
    selectKey(){
      //this.fiterOrder();
    }
  },
  methods: {
    loadList() {
      this.getRecycle(()=>{
        this.$dialog.toast({
          mes: '刷新成功！'
        });
        this.$refs.pullrefreshDemo.$emit('ydui.pullrefresh.finishLoad');
      })
    },
    tabsChange(label,tabkey){
      this.selectKey = tabkey;
    },
    getRecycle(callback){
      callback || this.$dialog.loading.open();
      this.$store.dispatch('FETCH_RECYCLE_ORDER').then(()=>{
        callback || this.$dialog.loading.close();
        callback && callback();
        this.fiterOrder();
      });
    },
    fiterOrder(){
      this.$store.state.recycleList.forEach((item, index)=>{
        if(index % 3 == 0){
          item.serviceType = 3;
        }
        if(index % 4 == 0){
          item.serviceType = 4;
        }
        if(index % 5 == 0){
          item.serviceType = 5;
        }
      })
      if(this.selectKey == 0){
        this.recycles = this.$store.state.recycleList;
        return;
      }
      this.recycles = [];
      this.$store.state.recycleList.forEach((item, index)=>{
        if(index % 3 == 0){
          item.serviceType = 3;
        }
        if(index % 4 == 0){
          item.serviceType = 4;
        }
        if(index % 5 == 0){
          item.serviceType = 5;
        }
        if(item.serviceType == this.selectKey){
          this.recycles.push(item);
        }
      })
      console.log(this.recycles);
    }
  }
}
</script>
<style scoped>
</style>
