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
    <div v-if="list.length == 0" style="text-align:center;padding:1rem 0;color:#ccc;font-size:.28rem;">
      暂无数据
    </div>
    <yd-pullrefresh :callback="loadList" ref="pullrefreshDemo" v-if="list.length > 0">
        <yd-cell-group>
                <yd-cell-item arrow type="link" :href="'/repairOrder/'+item.serialNumber" v-for="item in recycles">
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
function getData(size,type){
  var m = Math.floor(Math.random()*size);
      var list = [];
      for(let i = 0;i<m;i++){
        list.push({
          id:i,
          name: 'iphone'+i,
          price: Math.floor(Math.random()*10000),
          status: type || Math.floor(Math.random()*3)
        })
      }

      return list;
}

export default {
  name: 'IndexRepair',
  created(){
    this.getRepairs();
  },
  data () {
    return {
      selectKey: 0,
    }
  },
  computed:{
    list(){
      return this.$store.state.repairList;
    }
  },
  methods: {
    loadList() {
      this.getRepairs(()=>{
        this.$dialog.toast({
          mes: '刷新成功！'
        });
        this.$refs.pullrefreshDemo.$emit('ydui.pullrefresh.finishLoad');
      })
    },
    tabsChange(label,tabkey){
      this.selectKey = tabkey;
    },
    getRepairs(callback){
      callback || this.$dialog.loading.open();
      this.$store.dispatch('FETCH_REPAIR_ORDER').then(()=>{
        callback || this.$dialog.loading.close();
        callback && callback();
        this.fiterOrder();
      });
    },
    fiterOrder(){
      //调试代码
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
      //end debug
      
      if(this.selectKey == 0){
        this.recycles = this.$store.state.recycleList;
        return;
      }
      this.recycles = [];
      this.$store.state.recycleList.forEach((item, index)=>{
        //debug
        if(index % 3 == 0){
          item.serviceType = 3;
        }
        if(index % 4 == 0){
          item.serviceType = 4;
        }
        if(index % 5 == 0){
          item.serviceType = 5;
        }
        //end debug
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
