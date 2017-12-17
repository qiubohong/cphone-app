<template>
  <div>
    <yd-layout>
        <yd-navbar slot="navbar" title="店铺信息">
            <router-link to="/index/user" slot="left">
                <yd-navbar-back-icon></yd-navbar-back-icon>
            </router-link>
            <yd-icon name="compose" slot="right" @click.native="goEdit" v-if="!isUpdate && store.name != undefined"></yd-icon>
        </yd-navbar>
        <div style="padding:1rem 0;text-align:center" v-if="store.name == undefined">
          暂时还没有门店信息，<yd-button type="primary" @click.native="add">马上添加</yd-button>
        </div>
        <yd-cell-group v-if="store.name != undefined">
          <yd-cell-item>
            <span slot="left">店铺名称：</span>
            <span slot="left" v-if="!isUpdate">{{store.name}}</span>
            <yd-input type="text" max="20" slot="right" :value="store.name"  ref="name" required  v-if="isUpdate" :show-required-icon="false"></yd-input>
          </yd-cell-item>
          <yd-cell-item>
            <span slot="left">店铺电话：</span>
            <span slot="left" v-if="!isUpdate">{{store.number}}</span>
            <yd-input type="tel" slot="right"  regex="" :value="store.number"  ref="tel" required  v-if="isUpdate" :show-required-icon="false"></yd-input>
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
            <yd-input v-model="detailAddress" type="text" slot="right"  max="40" :value="detailAddress" ref="detailAddress" placeholder="请选择地址"></yd-input>
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
      <yd-button size="large" type="danger" @click.native="cancle"  v-if="isUpdate">
        取消
      </yd-button>
    </div>
    </yd-layout>
    <yd-cityselect v-model="cityShow" :callback="cityResult" :items="district" 
      :provance="addressInfo.provance"
      :city="addressInfo.city"
      :area="addressInfo.area"></yd-cityselect>

    <yd-popup v-model="mapShow" position="bottom" width="100%" style="height:90%">
      <yd-layout>
          <yd-navbar slot="navbar" title="百度地图">
              <yd-navbar-back-icon slot="left" @click.native="mapShow=false"></yd-navbar-back-icon>
          </yd-navbar>
          <div style="width:100%;height:100%;position:relative;">
              <yd-flexbox style="padding:.2rem;background:#fff;">
                    <div>地址：</div>
                    <yd-flexbox-item>
                      <input v-model="address" type="text" id="suggestId" size="20" value="" style="width:100%;border:0;border-bottom:1px solid #ececec;" />
                    </yd-flexbox-item>
                </yd-flexbox>
            <div id="container" 
                style="position: absolute;top:1rem; width:100%;height:100%; overflow:hidden;">
            </div>
            <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>
          </div>
          <div slot="bottom" style="padding:.2rem">
            <yd-button type="primary" size="large" style="margin-top:0;" @click.native="backShop">确定</yd-button>
          </div>
      </yd-layout>
    </yd-popup>
  </div>
</template>
<script>
import District from 'ydui-district/dist/gov_province_city_area_id';

export default {
  name: 'Shop',
  created(){
    this.$dialog.loading.open();
    let {dispatch} = this.$store;
    dispatch('FETCH_STORE')
      .then((data)=>{
        this.$dialog.loading.close();
        if(data.data && data.errorCode === this.$store.state.code['success']){
           this.store = data.data;
           let {address} = this.store;
           let addressArray = address.split('::');
           this.cityName = addressArray[0];
           this.detailAddress = addressArray[1] || "";
        }else{
          toastError(data.errorInfo);
        }
      }).catch(()=>toastError('网络异常，请稍后重试！'))
  },
  data () {
    return {
      store:{},
      cityShow: false,
      mapShow:false,
      cityName: '',
      detailAddress: "",
      district: District,
      isUpdate: false
    }
  },
  computed:{
    addressInfo(){
      let obj = this.cityName.split(' ');
      if(obj.length < 3){
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
    cityResult(ret) {
      this.cityName = ret.itemName1 + ' ' + ret.itemName2 + ' ' + ret.itemName3;
    },
    goEdit(){
      this.isUpdate = true;
    },
    add(){
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
    save(){
      const name = this.$refs.name;
      const tel = this.$refs.tel;
      const address = this.$refs.detailAddress;

      if(!name.valid){
        this.toastError("店铺地址"+name.errorMsg)
        return;
      }

      if(!tel.valid){
        this.toastError("店铺电话"+tel.errorMsg)
        return;
      }

      if(this.cityName === ""){
        this.toastError("请选择省市");
        return;
      }

      if(!address.valid){
        this.toastError("店铺地址"+address.errorMsg)
        return;
      }

      this.store.address = this.cityName +'::'+ this.detailAddress;
      this.$store.dispatch('FETCH_STORE_UPDATE',{data:this.store}).
       then((data)=>{
        if(data.data && data.errorCode === this.$store.state.code['success']){
            this.isUpdate = false;
            this.$dialog.toast({
              "mes":"保存成功！",
              timeout: 1500,
              icon: 'success'
            })
        }else{
          toastError(data.errorInfo);
        }
      }).catch(()=>toastError('网络异常，请稍后重试！'))

    },
    cancle(){
      this.isUpdate = false;
      if(!this.store.id){
        this.store = {};
      }
    },
    goMap(){
      if(this.cityName == ""){
        this.toastError('请选择省市')
        return;
      }
      this.mapShow = true;
    }
  },
  mounted(){
    function G(id) {
      return document.getElementById(id);
    }

    this.map  = new BMap.Map("container");
    console.log(this.cityName)
    this.map.centerAndZoom(this.cityName, 12);
    
    //建立一个自动完成的对象
    /*var ac = new BMap.Autocomplete({
      "input" : "suggestId"
      ,"location" : this.map
    });

    let map = this.map;
    map.addEventListener("click",function(e){
      console.log(e.point.lng + "," + e.point.lat);
    });
    ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
      var str = "";
      var _value = e.fromitem.value;
      var value = "";
      if (e.fromitem.index > -1) {
        value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
      }    
      str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
      
      value = "";
      if (e.toitem.index > -1) {
        _value = e.toitem.value;
        value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
      }    
      str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
      G("searchResultPanel").innerHTML = str;
    });

    var myValue;
    ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
    var _value = e.item.value;
      myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
      G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
      
      setPlace();
    });

    function setPlace(){
      map.clearOverlays();    //清除地图上所有覆盖物
      function myFun(){
        var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
        map.centerAndZoom(pp, 18);
        map.addOverlay(new BMap.Marker(pp));    //添加标注
      }
      var local = new BMap.LocalSearch(map, { //智能搜索
        onSearchComplete: myFun
      });
      local.search(myValue);
    }*/
  },
}
</script>
<style scoped>
</style>
