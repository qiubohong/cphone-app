<template>
  <yd-layout>
    <yd-navbar slot="navbar" title="订单详情">
      <yd-navbar-back-icon slot="left" @click.native="goBack"></yd-navbar-back-icon>
      <router-link v-if="phoneOrder.status < 4" :to="'/recycleOrderTrans/'+this.$route.params.id" slot="right">
        <yd-icon name="share2"></yd-icon>
      </router-link>
    </yd-navbar>
    <div class="order-result" v-if="phoneOrder.status == 4"  style="color:rgb(17, 195, 36)">
      <yd-icon name="checkoff" color="rgb(17, 195, 36)"></yd-icon>订单已完成
    </div>
    <div class="order-result" v-if="phoneOrder.status == 5"  style="color:#f00">
      <yd-icon name="error" color="#f00"></yd-icon>订单已取消
    </div>
    <yd-cell-group>
      <yd-cell-item>
        <span slot="left">订单号：{{phoneOrder.serialNumber}}</span>
      </yd-cell-item>
      <yd-cell-item>
        <span slot="left">手机型号：{{phone.name}}</span>
      </yd-cell-item>
      <yd-cell-item>
        <span slot="left">回收价格：￥{{phoneOrder.amount}}</span>
      </yd-cell-item>
    </yd-cell-group>
    <!-- 问题处理阶段 statu=1 -->
    <template v-if="phoneOrder.status == 1">
      <div style="color: #888;font-size:.3rem;padding:0 .2rem .1rem;">回收问题</div>
      <yd-accordion>
        <yd-accordion-item :title="(index+1)+'. '+item.problemName" v-for="(item,index) in problems">
          <yd-cell-group>
            <yd-cell-item :type="item.problemType == 0 ? 'radio' : 'checkbox'" v-for="item2 in item.selects">
              <span slot="left">{{item2.problemItem}}</span>
              <input slot="right" :type="item.problemType == 0 ? 'radio' : 'checkbox'" :value="item2.id" v-model="item.checked" />
            </yd-cell-item>
          </yd-cell-group>
        </yd-accordion-item>
      </yd-accordion>
    </template>
    <!-- 不可修改问题阶段 status> 1 -->
    <template v-if="phoneOrder.status > 1">
      <yd-accordion style="margin-top:.2rem">
        <yd-accordion-item title="回收问题" open>
          <yd-cell-group>
            <yd-cell-item v-for="(item,index) in problems">
              <span slot="left">{{(index+1)+'. '+item.problemName}}
              <template v-if="item2.problemId == item.id" v-for="item2 in phoneOrder.problemSelects">
                <yd-badge type="hollow">{{item2.problemItem}}</yd-badge>
              </template>
            </span>
            </yd-cell-item>
          </yd-cell-group>
        </yd-accordion-item>
      </yd-accordion>
    </template>

    <yd-accordion style="margin-top:.2rem">
      <yd-accordion-item title="用户信息" open>
        <yd-cell-group>
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
            <yd-cell-item>
              <span slot="left">快递单号：{{phoneOrder.expressNumber}}</span>
              <span slot="right">{{phoneOrder.userInfo.expressCompany}}</span>
            </yd-cell-item>
          </template>
          <template v-if="phoneOrder.serviceType === 2">
            <yd-cell-item>
              <span slot="left">预约门店：{{store.name}}</span>
            </yd-cell-item>
            <yd-cell-item>
              <span slot="left">门店地址：{{store.address}}</span>
            </yd-cell-item>
          </template>
          <template v-if="phoneOrder.serviceType === 1">
            <yd-cell-item>
              <span slot="left">上门地址：{{phoneOrder.address}}</span>
            </yd-cell-item>
            <yd-cell-item>
              <span slot="left">预约时间：{{phoneOrder.period}}</span>
            </yd-cell-item>
          </template>
        </yd-cell-group>
      </yd-accordion-item>
    </yd-accordion>
    <yd-cell-group title="备注">
      <yd-cell-item>
        <yd-textarea v-model="phoneOrder.remark" slot="right" placeholder="请输入您与客户沟通的备注信息" :readonly="phoneOrder.status >= 2" maxlength="200"></yd-textarea>
      </yd-cell-item>
    </yd-cell-group>
    <yd-button size="large" type="primary" slot="bottom" @click.native="goNext" v-if="phoneOrder.status == 1">
      <span>问题确认</span>
    </yd-button>
    <yd-button size="large" type="primary" slot="bottom" @click.native="goNext" v-if="phoneOrder.status == 2">
      <span>完成服务</span>
    </yd-button>
    <yd-button size="large" type="primary" slot="bottom" @click.native="wait" v-if="phoneOrder.status == 3">
      <span>等待用户确认</span>
    </yd-button>
    <div class="order-cancle" v-if="phoneOrder.status == 5">
      <div class="order-cancle-txt">订单已取消</div>
    </div>
  </yd-layout>
</template>
<script>
import { recyclePhoneInfo, updateOrder, finishOrder, getStoreInfo } from '../store/fetch';

export default {
  name: 'RefreshOrder',
  created() {
    this.initOrder();
  },
  data() {
    return {
      customer: {},
      phone: {},
      store: {},
      problems: [],
      serviceType: {
        "1": "上门",
        "2": "门店",
        "3": "邮寄"
      },
      phoneOrder: {}
    }
  },
  methods: {
    goNext() {
      if (this.phoneOrder.status == 1) {
        this.$dialog.confirm({
          title: '创手机-提醒您',
          mes: '确认与用户协商回收问题选项(后续不可修改)？',
          opts: () => {
            this.updateOrder();
          }
        })
      } else if (this.phoneOrder.status == 2) {
        this.$dialog.loading.open('请求中...');
        finishOrder(this.phoneOrder.serialNumber).then((data) => {
          this.$dialog.loading.close();
          if (data.data && data.errorCode === this.$store.state.code['success']) {
            this.$dialog.alert({
              mes: "服务完成，等待用户确认！",
              callback: () => {
                this.initOrder();
              }
            });
          } else {
            this.toastError(data.errorInfo);
          }
        }).catch((e) => {
          console.log(e)
          this.toastError('网络异常，请稍后重试！')
        });
      }
    },
    wait() {
      this.$dialog.alert({
        mes: "等待用户确认,点击确认刷新",
        callback: () => {
          this.initOrder();
        }
      })
    },
    updateOrder() {
      let temp = { ...this.phoneOrder };
      temp.problemSelects = [];
      this.problems.forEach((item) => {
        item.selects.forEach((item2) => {
          if (item.problemType == 0) {
            if (item2.id == item.checked) {
              temp.problemSelects.push(item2);
            }
          } else {
            if (item.checked.indexOf(item2.id) >= 0) {
              temp.problemSelects.push(item2);
            }
          }
        })
      });
      if (temp.problemSelects.length < this.problems.length) {
        this.toastError('有问题没选择！')
        return;
      }

      delete temp.problems;
      delete temp.status;

      this.$dialog.loading.open('请求中...');
      updateOrder(temp).then((data) => {
        this.$dialog.loading.close();
        if (data.data && data.errorCode === this.$store.state.code['success']) {
          this.$dialog.toast({
            mes: "确认成功！",
            icon: "success"
          });
          this.initOrder();
        } else {
          this.toastError(data.errorInfo);
        }
      }).catch((e) => {
        console.log(e)
        this.toastError('网络异常，请稍后重试！')
      });
    },
    initOrder() {
      this.$dialog.loading.open();
      let { dispatch } = this.$store;
      dispatch('FETCH_RECYCLE_ORDER_ID', { serialNumber: this.$route.params.id })
        .then((data) => {
          this.$dialog.loading.close();
          if (data.data && data.errorCode === this.$store.state.code['success']) {
            this.phoneOrder = data.data;
            //用户信息
            dispatch('FETCH_COSTOMER', { customerId: data.data.customerId })
              .then((res) => {
                this.customer = { ...res.data };
                console.log(this.customer)
              });
            //手机信息
            recyclePhoneInfo(data.data.recyclePhoneId).then((res) => {
              this.phone = { ...res.data };
            })

            //门店
            if(this.phoneOrder.storeId){
              getStoreInfo(this.phoneOrder.storeId).then((res) => {
                this.store = { ...res.data };
              })
            }

            //问题集合
            let problems = [];
            data.data.problems.forEach((item, index) => {
              item.selects.forEach((item2) => {
                data.data.problemSelects.forEach((item3) => {
                  if (item3.problemId == item2.problemId) {
                    if (item.problemType == 0) {
                      item.checked = item3.id;
                    } else {
                      if (!item.checked) {
                        item.checked = [item3.id];
                      } else {
                        item.checked.push(item3.id);
                      }
                    }
                  }
                });
              })
              problems.push({ ...item });
            })
            console.log(problems)
            this.problems = [...problems];
          } else {
            this.toastError(data.errorInfo);
          }
        }).catch((e) => {
          console.log(e)
          this.toastError('网络异常，请稍后重试！')
        })
    }
  }
}

</script>
<style scoped>


</style>
