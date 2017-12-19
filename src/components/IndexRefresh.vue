<template>
  <div class="index-tabs">
    <yd-layout>
      <yd-tab :callback="tabsChange">
        <template v-for="(item,index) in tabs">
          <yd-tab-panel v-if="index == 0" :label="item.name" :tabkey="item.status"></yd-tab-panel>
          <yd-tab-panel v-if="index > 0 && index < 4" :label="item.name+'('+item.size+')'" :tabkey="item.status" :active="item.active"></yd-tab-panel>
        </template>
      </yd-tab>
      <div v-if="recycles.length == 0" style="text-align:center;padding:1rem 0;color:#ccc;font-size:.28rem;">
        暂无数据
      </div>
      <yd-pullrefresh :callback="loadList" ref="pullrefreshDemo" v-if="recycles.length > 0">
        <yd-cell-group>
          <yd-cell-item arrow type="link" :href="'/refreshOrder/'+item.serialNumber" v-for="item in recycles">
            <yd-icon slot="icon" name="warn" v-if="item.status == 1"></yd-icon>
            <yd-icon slot="icon" name="footmark" v-if="item.status == 2"></yd-icon>
            <img slot="icon" src="static/img/money.png" class="order-img" v-if="item.status == 3" />
            <yd-icon slot="icon" name="checkoff" color="#57b83b" v-if="item.status == 4"></yd-icon>
            <yd-icon slot="icon" name="error" color="#f00" v-if="item.status == 5"></yd-icon>
            <div slot="left">
              <div class="order-box">
                <div class="order-title">预约时间：{{item.period}}</div>
                <div class="order-status" v-if="item.status == 1">待接单</div>
                <div class="order-status" v-if="item.status == 2">已接单</div>
                <div class="order-status money" v-if="item.status == 3">服务完成</div>
                <div class="order-status ok" v-if="item.status == 4">已完成</div>
                <div class="order-status error" v-if="item.status == 5">取消</div>
              </div>
            </div>
            <div slot="right">回收：￥{{item.amount}}</div>
          </yd-cell-item>
        </yd-cell-group>
      </yd-pullrefresh>
    </yd-layout>
  </div>
</template>
<script>
export default {
  name: 'IndexRefresh',
  created() {
    this.getRecycle();
  },
  data() {
    return {
      selectKey: 1,
      recycles: [],
      tabs: [{
        status: "0",
        name: "全部",
        size: 0
      }, {
        status: "1",
        name: "待接单",
        size: 0,
        active: true,
      }, {
        status: "2",
        name: "已接单",
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
      }]
    }
  },
  computed: {},
  watch: {
    selectKey() {
      this.getRecycle();
    }
  },
  methods: {
    loadList() {
      this.getRecycle(() => {
        this.$dialog.toast({
          mes: '刷新成功！'
        });
        this.$refs.pullrefreshDemo.$emit('ydui.pullrefresh.finishLoad');
      })
    },
    tabsChange(label, tabkey) {
      this.selectKey = tabkey;
    },
    getRecycle(callback) {
      callback || this.$dialog.loading.open();
      this.$store.dispatch('FETCH_RECYCLE_ORDER').then(() => {
        callback || this.$dialog.loading.close();
        callback && callback();
        this.fiterOrder();
      });
    },
    fiterOrder() {
      this.tabs.forEach((item2) => {
        item2.size = 0;
        this.$store.state.recycleList.forEach((item) => {
          if (item.status == item2.status) {
            item2.size++;
          }
        });
      });
      if (this.selectKey == 0) {
        this.recycles = this.$store.state.recycleList;
        return;
      }
      this.recycles = [];
      this.$store.state.recycleList.forEach((item, index) => {
        if (item.status == this.selectKey) {
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
