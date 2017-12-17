<template>
<yd-layout>
	<yd-navbar slot="navbar" title="百度地图">
        <router-link to="/shop" slot="left">
            <yd-navbar-back-icon></yd-navbar-back-icon>
        </router-link>
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
</template>
<script>
export default{
	name:"map",
	created(){
		this.cityName = localStorage.getItem("cityName").replace(/\s/g,"");
	},
	data(){
		return {
			map : null,
			cityName: "",
			address:"",
			position:"",
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
		var ac = new BMap.Autocomplete({
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
		}
	},
	backShop(){
		console.log(this.address)
	}
}
</script>