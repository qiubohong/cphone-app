<template>
  <yd-layout>
    <router-view></router-view>
    <yd-tabbar slot="tabbar">
        <yd-tabbar-item title="回收" link="refresh" :active="activeName === 'refresh'">
            <yd-icon name="refresh" slot="icon" size="0.54rem"></yd-icon>
        </yd-tabbar-item>
        <yd-tabbar-item title="维修" link="repair" :active="activeName === 'repair'">
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
    }
  }
}
</script>
<style scoped>
</style>
