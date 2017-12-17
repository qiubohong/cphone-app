<template>
  <yd-layout>
    <router-view></router-view>
    <yd-tabbar slot="tabbar">
        <yd-tabbar-item title="回收" link="refresh" :active="activeName === 'refresh'" v-if="producer!= 0 || producer.bussiness != 2">
            <yd-icon name="refresh" slot="icon" size="0.54rem"></yd-icon>
        </yd-tabbar-item>
        <yd-tabbar-item title="维修" link="repair" :active="activeName === 'repair'" v-if="producer!= 0 || producer.bussiness != 1">
            <yd-icon name="setting" slot="icon" size="0.54rem"></yd-icon>
        </yd-tabbar-item>
        <yd-tabbar-item title="个人中心" link="user" :active="activeName === 'user'">
            <yd-icon name="ucenter-outline" slot="icon" size="0.54rem"></yd-icon>
        </yd-tabbar-item>
    </yd-tabbar>
  </yd-layout>
</template>
<script>
export default {
  name: 'Index',
  data () {
    return {
    }
  },
  computed: {
    activeName(){
      return this.$route.name;
    },
    producer(){
       //role; 角色：0所有，1上门，2门店
       //bussiness; 业务：0所有，1维修， 2回收
      return this.$store.state.producer;
    }
  }
}
</script>
<style scoped>
</style>
