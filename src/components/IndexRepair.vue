<template>
  <div class="index-tabs">
    <yd-layout>
      <yd-tab :callback="tabsChange">
        <template v-for="(item,index) in tabs">
          <yd-tab-panel v-if="index == 0" :label="item.name" :tabkey="item.status"></yd-tab-panel>
          <yd-tab-panel v-if="index > 0 && index < 4" :label="item.name+'('+item.size+')'" :tabkey="item.status" :active="item.active"></yd-tab-panel>
        </template>
      </yd-tab>
      <div v-if="list.length == 0" style="text-align:center;padding:1rem 0;color:#ccc;font-size:.28rem;">
        暂无数据
      </div>
      <yd-pullrefresh :callback="loadList" ref="pullrefreshDemo" v-if="list.length > 0">
        <yd-cell-group>
          <yd-cell-item arrow type="link" :href="'/repairOrder/'+item.serialNumber" v-for="item in list">
            <yd-icon slot="icon" name="warn" v-if="item.status == 1"></yd-icon>
            <yd-icon slot="icon" name="footmark" v-if="item.status == 2"></yd-icon>
            <img slot="icon" src="static/img/money.png" class="order-img" v-if="item.status == 3" />
            <yd-icon slot="icon" name="checkoff" color="#57b83b" v-if="item.status == 4"></yd-icon>
            <yd-icon slot="icon" name="error" color="#f00" v-if="item.status == 5"></yd-icon>
            <div slot="left">
              <div class="order-box">
                <div class="order-title" v-if="item.serviceType == 1">预约时间：{{item.period}}</div>
                <div style="">类型：{{serviceType[item.serviceType]}}</div>
                <div class="order-status" v-if="item.status == 1">未确认</div>
                <div class="order-status" v-if="item.status == 2">已确认</div>
                <div class="order-status money" v-if="item.status == 3">服务完成</div>
                <div class="order-status ok" v-if="item.status == 4">已完成</div>
                <div class="order-status error" v-if="item.status == 5">取消</div>
              </div>
            </div>
            <span slot="right">维修：￥{{item.amount}}</span>
          </yd-cell-item>
        </yd-cell-group>
      </yd-pullrefresh>
    </yd-layout>
  </div>
</template>
<script>
export default {
  name: 'IndexRepair',
  created() {
    this.getRepairs();
  },
  data() {
    return {
      selectKey: 1,
      list: [],
      tabs: [{
        status: "0",
        name: "全部",
        size: 0
      }, {
        status: "1",
        name: "未确认",
        size: 0,
        active:true,
      }, {
        status: "2",
        name: "已确认",
        size: 0
      }, {
        status: "3",
        name: "服务完成",
        size: 0
      }, {
        status: "4",
        name: "确认",
        size: 0
      }, {
        status: "5",
        name: "取消",
        size: 0
      }],
      serviceType: {
        "1": "上门",
        "2": "门店",
        "3": "邮寄"
      },
    }
  },
  computed: {
    repairDot(){
      return this.$store.state.repairDot;
    },
  },
  watch: {
    selectKey() {
      this.getRepairs();
    },
    repairDot(val){
      if(val){
        
        this.$dialog.confirm({
          mes: "你有新的维修订单",
          opts: [{
            txt: '确定',
            color: true,
            callback: () => {
              this.getRepairs();
            }
          }]
        });
      }
    }
  },
  methods: {
    loadList() {
      this.getRepairs(() => {
        this.$dialog.toast({
          mes: '刷新成功！'
        });
        this.$refs.pullrefreshDemo.$emit('ydui.pullrefresh.finishLoad');
      })
    },
    tabsChange(label, tabkey) {
      this.selectKey = tabkey;
    },
    getRepairs(callback) {
      callback || this.$dialog.loading.open();
      this.$store.dispatch('FETCH_REPAIR_ORDER').then(() => {
        callback || this.$dialog.loading.close();
        this.fiterOrder();
        callback && callback();
      });
    },
    fiterOrder() {
      this.tabs.forEach((item2) => {
        item2.size = 0;
        this.$store.state.repairList.forEach((item) => {
          if (item.status == item2.status) {
            item2.size++;
          }
        });
      });
      if (this.selectKey == 0) {
        this.list = this.$store.state.repairList;
        return;
      }
      this.list = [];
      this.$store.state.repairList.forEach((item, index) => {
        if (item.status == this.selectKey) {
          this.list.push(item);
        }
      })
    }
  }
}

</script>
<style scoped>


</style>
