<template>
  <div>
    <yd-layout>
        <yd-navbar slot="navbar" title="店铺信息">
            <router-link to="/index/user" slot="left">
                <yd-navbar-back-icon></yd-navbar-back-icon>
            </router-link>
            <yd-icon name="compose" slot="right" @click.native="goEdit" v-if="!isUpdate"></yd-icon>
        </yd-navbar>
        <yd-cell-group>
          <yd-cell-item>
            <span slot="left">店铺名称：</span>
            <span slot="left" v-if="!isUpdate">{{shopInfo.name}}</span>
            <yd-input type="text" max="20" slot="right" :value="shopInfo.name"  ref="name" required  v-if="isUpdate" :show-required-icon="false"></yd-input>
          </yd-cell-item>
          <yd-cell-item>
            <span slot="left">店铺电话：</span>
            <span slot="left" v-if="!isUpdate">{{shopInfo.tel}}</span>
            <yd-input type="tel" slot="right"  regex="" :value="shopInfo.tel"  ref="tel" required  v-if="isUpdate" :show-required-icon="false"></yd-input>
          </yd-cell-item>
          <yd-cell-item v-if="!isUpdate">
            <span slot="left">省市地址：</span>
            <span slot="left">{{shopInfo.address}}</span>
          </yd-cell-item>
          <yd-cell-item arrow v-if="isUpdate">
            <span slot="left">省市地址：</span>
            <input slot="right" type="text" @click.stop="show1 = true" v-model="shopInfo.address" readonly placeholder="请选择收货地址">
          </yd-cell-item>
          <yd-cell-item>
            <span slot="left">详细地址：</span>
            <span slot="left" v-if="!isUpdate">{{shopInfo.detailAddress}}</span>
            <yd-input type="text" slot="right"  max="20" :value="shopInfo.detailAddress" ref="detailAddress" required  v-if="isUpdate" :show-required-icon="false"></yd-input>
          </yd-cell-item>
          <yd-cell-item>
            <span slot="left">预约时间：</span>
            <span slot="left" v-if="!isUpdate">{{shopInfo.workTime}}</span>
            <yd-input type="text" slot="right"  max="20" :value="shopInfo.workTime" ref="workTime" required  v-if="isUpdate" :show-required-icon="false"></yd-input>
          </yd-cell-item>
        </yd-cell-group>
    </yd-cell-group>
    <div style="margin:.2rem">
      <yd-button size="large" type="primary" @click.native="save" v-if="isUpdate">
        保存
      </yd-button>
    </div>
    </yd-layout>
    <yd-cityselect v-model="show1" :callback="result1" :items="district" 
      :provance="addressInfo.provance"
      :city="addressInfo.city"
      :area="addressInfo.area"></yd-cityselect>
  </div>
</template>
<script>
import District from 'ydui-district/dist/gov_province_city_area_id';

export default {
  name: 'Shop',
  data () {
    return {
      show1: false,
      model1: '天津市 市辖区 河东区',
      district: District,
      shopInfo:{
        address:"天津市 市辖区 河东区",
        detailAddress: "xxx路xxx号",
        tel:"123123123123",
        name:"ttttt",
        workTime:"tttt"
      },
      isUpdate: false
    }
  },
  computed:{
    addressInfo(){
      let obj = this.shopInfo.address.split(' ');
      return {
        provance: obj[0],
        city: obj[1],
        area: obj[2]
      }
    }
  },
  methods: {
    result1(ret) {
      this.shopInfo.address = ret.itemName1 + ' ' + ret.itemName2 + ' ' + ret.itemName3;
    },
    goEdit(){
      this.isUpdate = true;
    },
    save(){
      const name = this.$refs.name;
      const tel = this.$refs.tel;
      const address = this.$refs.detailAddress;
      const workTime = this.$refs.workTime;

      if(!name.valid){
        this.$dialog.toast({
          mes: "店铺地址"+name.errorMsg,
          icon:"error",
          timeout:1200,
          callback(){
            name.setFocus();
          }
        })

        return;
      }

      if(!tel.valid){
        this.$dialog.toast({
          mes: "店铺电话"+tel.errorMsg,
          icon:"error",
          timeout:1200,
          callback(){
            tel.setFocus();
          }
        })

        return;
      }

      this.isUpdate = false;
    }
  }
}
</script>
<style scoped>
</style>
