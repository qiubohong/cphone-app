<template>
  <yd-layout>
    <yd-navbar slot="navbar" title="转派订单">
      <yd-navbar-back-icon slot="left" @click.native="goBack"></yd-navbar-back-icon>
    </yd-navbar>
    <div>
      <yd-flexbox style="background:#fff;padding:.2rem .1rem .2rem .3rem;border-bottom:1px solid #ccc">
        <yd-flexbox-item>
          <yd-input v-model="number" type="tel" max="11" placeholder="请输入手机号" :show-success-icon="false"></yd-input>
        </yd-flexbox-item>
        <div>
          <yd-button type="primary" shape="circle" @click.native="getResult">搜索</yd-button>
        </div>
      </yd-flexbox>
      <template v-if="list.length == 0 && number.length > 0">
        <div style="margin:2rem 0;text-align:center;color:#777">{{message}}</div>
      </template>
      <template v-if="list.length > 0">
        <yd-cell-group style="margin-top:.2rem">
          <yd-cell-item arrow v-for="item in list" @click.native="trans(item)">
            <span slot="left">{{item.name}}({{item.number}})</span>
          </yd-cell-item>
        </yd-cell-group>
      </template>
    </div>
  </yd-layout>
</template>
<script>
import { producerInfoByNumber, turnOrder } from '../store/fetch'

export default {
  name: 'refreshTrans',
  created() {

  },
  data() {
    return {
      number: "",
      list: [],
      message: "",
      throttle: false
    }
  },
  watch: {
    number(val) {
      this.result = this.getResult(null, val);
    }
  },
  methods: {
    getResult(e, val) {
      this.list = [];
      val = val || this.number;
      if (val == "") {
        this.message = "";
        return;
      }
      if (/[^0-9]/.test(val)) {
        this.message = "输入手机格式不正确"
        return;
      }
      this.message = "正在搜索中...";
      producerInfoByNumber(val).then(res => {
        if (res.data) {
          this.list = [res.data];
        } else {
          this.message = "号码暂时查不到，请检查是否有误！";
        }
      });
    },
    trans(item) {
      this.$dialog.loading.open('正在转派...');
      this.$dialog.confirm({
        mes: `确定将订单转派给<b style="color:#000">${item.name}</b>(${item.number})？`,
        opts: () => {
          turnOrder({ sn: this.$route.params.id, number: item.number }).then(res => {
            this.$dialog.loading.close();
            if (this.$store.state.code["success"] == res.errorCode) {
              this.$dialog.confirm({
                mes: "转派成功！",
                opts: [{
                  txt: '返回首页',
                  color: false,
                  callback: () => {
                    this.$router.replace({name:'index'});
                  }
                }]
              })
            } else {
              this.toastError(data.errorInfo);
            }
          }).catch(() => {
            this.$dialog.loading.close();
            this.toastError("网络异常，请稍后再试！")
          })
        }
      })
    }
  }
}

</script>
