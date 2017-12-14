<template>
  <div class="index-tabs">
    <yd-layout>
      <yd-tab :callback="tabsChange">
          <yd-tab-panel label="全部"></yd-tab-panel>
          <yd-tab-panel label="待出发"></yd-tab-panel>
          <yd-tab-panel label="维修中"></yd-tab-panel>
          <yd-tab-panel label="待支付"></yd-tab-panel>
          <yd-tab-panel label="已完成"></yd-tab-panel>
      </yd-tab>
    <div v-if="list.length == 0" style="text-align:center;padding:1rem 0;color:#ccc;font-size:.28rem;">
      暂无数据
    </div>
    <yd-pullrefresh :callback="loadList" ref="pullrefreshDemo" v-if="list.length > 0">
        <yd-cell-group>
            <yd-cell-item arrow type="link" href="/repairOrder" v-for="item in list">
              <yd-icon slot="icon" name="footmark" v-if="item.status == 0"></yd-icon>
                <img slot="icon" src="static/img/money.png" class="order-img"  v-if="item.status == 1"/>
                <yd-icon slot="icon" name="checkoff" color="#57b83b" v-if="item.status == 2"></yd-icon>
                <span slot="left">
                        <div class="order-box">
                          <div class="order-title">{{item.serialNumber}}</div>
                          <div class="order-status" v-if="item.status == 0">出发中</div>
                          <div class="order-status money" v-if="item.status == 1">支付</div>
                          <div class="order-status ok" v-if="item.status == 2">完成</div>
                        </div>
                </span>
              <span slot="right">￥{{item.price}}</span>
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
  data () {
    return {
      list:getData(20)
    }
  },
  computed:{
    
  },
  methods: {
    loadList() {
      setTimeout(()=> {
        var m = Math.floor(Math.random()*10);
        var temp = getData(m);
        this.$dialog.toast({
          mes: '为您更新了'+m+'条内容'
        });
        this.list.push(...temp);
        this.$refs.pullrefreshDemo.$emit('ydui.pullrefresh.finishLoad');
      }, 2000);
    },
    tabsChange(label,tabkey){
      this.$dialog.loading.open('');
      setTimeout(()=> {
        this.list = getData(20,tabkey);
        this.$dialog.loading.close();
      }, 2000);
    }
  }
}
</script>
<style scoped>
</style>
