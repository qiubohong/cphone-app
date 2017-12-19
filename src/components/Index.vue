<template>
  <yd-layout>
    <router-view></router-view>
    <yd-tabbar slot="tabbar">
        <yd-tabbar-item title="回收" link="refresh" :active="activeName === 'refresh'" v-if="producer!= 0 || producer.bussiness != 2" :dot="recycleDot">
            <yd-icon name="refresh" slot="icon" size="0.54rem"></yd-icon>
        </yd-tabbar-item>
        <yd-tabbar-item title="维修" link="repair" :active="activeName === 'repair'" v-if="producer!= 0 || producer.bussiness != 1" :dot="repairDot">
            <yd-icon name="setting" slot="icon" size="0.54rem"></yd-icon>
        </yd-tabbar-item>
        <yd-tabbar-item title="个人中心" link="user" :active="activeName === 'user'" :dot="userDot">
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
    },
    repairDot(){
      return this.$store.state.repairDot;
    },
    recycleDot(){
      return this.$store.state.recycleDot;
    },
    userDot(){
      return this.$store.state.userDot;
    }
  }
}
</script>
<style scoped>
</style>
