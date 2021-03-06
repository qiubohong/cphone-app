import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import ForgetPwd from '@/components/ForgetPwd'

import Index from '@/components/Index'
import IndexRefresh from '@/components/IndexRefresh'
import IndexRepair from '@/components/IndexRepair'
import IndexUser from '@/components/IndexUser'

import RefreshOrder from '@/components/RefreshOrder'
import RepairOrder from '@/components/RepairOrder'
import RefreshOrderTrans from '@/components/RefreshOrderTrans'
import RepairOrderTrans from '@/components/RepairOrderTrans'


import Shop from '@/components/Shop'
import Prize from '@/components/Prize'


Vue.use(Router)

export default new Router({
  routes: [{
    path: '/login',
    name: 'login',
    component: Login,
  },{
    path: '/forget',
    name: 'forget',
    component: ForgetPwd,
  },{
    path: '/',
    name: 'index',
    component: Index,
    redirect: { name: 'refresh' },
    children: [{
      name: 'refresh',
      path: 'index/refresh',
      component: IndexRefresh
    },{
      name: 'repair',
      path: 'index/repair',
      component: IndexRepair
    },{
      name: 'user',
      path: 'index/user',
      component: IndexUser
    }]
  },{
    path: '/refreshOrder/:id',
    name: 'refreshOrder',
    component: RefreshOrder,
  },{
    path: '/recycleOrderTrans/:id',
    name: 'recycleOrderTrans',
    component: RefreshOrderTrans,
  },{
    path: '/repairOrder/:id',
    name: 'repairOrder',
    component: RepairOrder,
  },{
    path: '/repairOrderTrans/:id',
    name: 'repairOrderTrans',
    component: RepairOrderTrans,
  },{
    path: '/shop',
    name: 'shop',
    component: Shop,
  },{
    path: '/prize',
    name: 'prize',
    component: Prize,
  }]
})
