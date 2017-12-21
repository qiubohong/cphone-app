<template>
  <div>
    <yd-layout>
      <yd-navbar slot="navbar" title="店铺信息">
        <yd-navbar-back-icon slot="left" @click.native="goBack"></yd-navbar-back-icon>
        <yd-icon name="compose" slot="right" @click.native="goEdit" v-if="!isUpdate && store.name != undefined"></yd-icon>
      </yd-navbar>
      <div style="padding:1rem 0;text-align:center" v-if="store.name == undefined">
        暂时还没有门店信息，
        <yd-button type="primary" @click.native="add">马上添加</yd-button>
      </div>
      <yd-cell-group v-if="store.name != undefined">
        <yd-cell-item>
          <span slot="left">店铺名称：</span>
          <span slot="left" v-if="!isUpdate">{{store.name}}</span>
          <yd-input type="text" max="20" slot="right" v-model="store.name" ref="name" required v-if="isUpdate" :show-required-icon="false"></yd-input>
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">店铺电话：</span>
          <span slot="left" v-if="!isUpdate">{{store.number}}</span>
          <yd-input type="tel" slot="right" regex="" v-model="store.number" ref="tel" required v-if="isUpdate" :show-required-icon="false"></yd-input>
        </yd-cell-item>
        <yd-cell-item v-if="!isUpdate">
          <span slot="left">省市地址：</span>
          <span slot="left">{{cityName}}</span>
        </yd-cell-item>
        <yd-cell-item arrow v-if="isUpdate">
          <span slot="left">省市地址：</span>
          <input v-model="cityName" slot="right" type="text" @click.stop="cityShow = true" readonly placeholder="请选择省市">
        </yd-cell-item>
        <yd-cell-item v-if="!isUpdate">
          <span slot="left">详细地址：</span>
          <span slot="left">{{detailAddress}}</span>
        </yd-cell-item>
        <yd-cell-item v-if="isUpdate">
          <span slot="left">详细地址：</span>
          <yd-input v-model="detailAddress" type="text" slot="right" max="40" :value="detailAddress" ref="detailAddress" placeholder="请选择地址"></yd-input>
        </yd-cell-item>
        <!--
          <yd-cell-item>
            <span slot="left">预约时间：</span>
            <span slot="left" v-if="!isUpdate">{{shopInfo.workTime}}</span>
            <yd-input type="text" slot="right"  max="20" :value="shopInfo.workTime" ref="workTime" required  v-if="isUpdate" :show-required-icon="false"></yd-input>
          </yd-cell-item> -->
      </yd-cell-group>
      </yd-cell-group>
      <div style="margin:.2rem">
        <yd-button size="large" type="primary" @click.native="save" v-if="isUpdate">
          保存
        </yd-button>
        <yd-button size="large" type="danger" @click.native="cancle" v-if="isUpdate">
          取消
        </yd-button>
      </div>
    </yd-layout>
    <yd-cityselect v-model="cityShow" :callback="cityResult" :items="district" :provance="addressInfo.provance" :city="addressInfo.city" :area="addressInfo.area"></yd-cityselect>
  </div>
</template>
<script>
import District from 'ydui-district/dist/gov_province_city_area_id';

export default {
  name: 'Shop',
  created() {
    this.init();
  },
  data() {
    return {
      store: {},
      cityShow: false,
      mapShow: false,
      cityName: '',
      detailAddress: "",
      district: District,
      isUpdate: false
    }
  },
  computed: {
    addressInfo() {
      let obj = this.cityName.split(' ');
      if (obj.length < 3) {
        return {
          provance: "",
          city: "",
          area: ""
        };
      }
      return {
        provance: obj[0],
        city: obj[1],
        area: obj[2]
      }
    }
  },
  methods: {
    init() {
      this.$dialog.loading.open();
      let { dispatch } = this.$store;
      dispatch('FETCH_STORE')
        .then((data) => {
          this.$dialog.loading.close();
          if (data.data && data.errorCode === this.$store.state.code['success']) {
            this.store = data.data;
            let { address } = this.store;
            let addressArray = address.split('::');
            this.cityName = addressArray[0];
            this.detailAddress = addressArray[1] || "";
          } else {
            data.errorCode != this.$store.state.code['success'] && this.toastError(data.errorInfo);
          }
        }).catch(() => this.toastError('网络异常，请稍后重试！'))
    },
    cityResult(ret) {
      this.cityName = ret.itemName1 + ' ' + ret.itemName2 + ' ' + ret.itemName3;
    },
    goEdit() {
      this.isUpdate = true;
    },
    add() {
      this.store = {
        "producerId": this.$store.state.producer.id,
        "name": "",
        "number": "",
        "address": "",
        "lng": 0,
        "lat": 0
      };
      this.isUpdate = true;
    },
    save() {
      const name = this.$refs.name;
      const tel = this.$refs.tel;
      const address = this.$refs.detailAddress;
      const { longitude, latitude } = this.$store.state.position;
      if (!name.valid) {
        this.toastError("店铺地址" + name.errorMsg)
        return;
      }

      if (!tel.valid) {
        this.toastError("店铺电话" + tel.errorMsg)
        return;
      }

      if (this.cityName === "") {
        this.toastError("请选择省市");
        return;
      }

      if (!address.valid) {
        this.toastError("店铺地址" + address.errorMsg)
        return;
      }

      this.store.address = this.cityName + '::' + this.detailAddress;
      this.store.lng = longitude;
      this.store.lat = latitude;
      console.log(this.store)
      if (this.store.id) {
        this.$store.dispatch('FETCH_STORE_UPDATE', { data: this.store }).
        then((data) => {
          if (data.data && data.errorCode === this.$store.state.code['success']) {
            this.isUpdate = false;
            this.$dialog.toast({
              "mes": "保存成功！",
              timeout: 1500,
              icon: 'success'
            })
          } else {
            this.toastError(data.errorInfo);
          }
        }).catch(() => this.toastError('网络异常，请稍后重试！'))
      } else {
        this.$store.dispatch('FETCH_STORE_ADD', { data: this.store }).
        then((data) => {
          if (data.data && data.errorCode === this.$store.state.code['success']) {
            this.isUpdate = false;
            this.$dialog.toast({
              "mes": "保存成功！",
              timeout: 1500,
              icon: 'success'
            })
            this.init();
          } else {
            this.toastError(data.errorInfo);
          }
        }).catch(() => this.toastError('网络异常，请稍后重试！'))
      }


    },
    cancle() {
      this.isUpdate = false;
      if (!this.store.id) {
        this.store = {};
      }
    },
    goMap() {
      if (this.cityName == "") {
        this.toastError('请选择省市')
        return;
      }
      this.mapShow = true;
    }
  },
  mounted() {},
}

</script>
<style scoped>


</style>
