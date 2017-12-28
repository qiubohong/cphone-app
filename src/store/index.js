import Vue from 'vue'
import Vuex from 'vuex'
import * as fetch from './fetch'
import {notisfy, getUUID} from '../utils/index'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
const SUCCESS = "101002";
export default new Vuex.Store({
  state: {
    producer: {},
    position: {
      longitude: 113,
      latitude: 22,
    },
    userDot: false,

    recycleDot: true,
    recycleList:[],
    recycle:{},

    repairList:[],
    repair:{},
    repairDot: true,

    timeId: -1,
    uploadTime : -1, //默认-1， 需要请求服务器
    key: {
      login: "LOGIN",
      position: {
        longitude: "LONGITUDE",
        latitude: "LATITUDE",
      },
    },
    code: {
      success: SUCCESS
    }
  },
  actions: {
    FETCH_LOGIN: ({ commit, dispatch, state }, { number, password }) => {
      return new Promise((resolve, reject) => {
        fetch.login(number, password)
          .then((data) => {
            resolve(data);
            commit('SET_LOGIN', { data })
          }).catch(reject);
      })
    },
    FETCH_LOGIN_CACHE: ({ commit, dispatch, state }) => {
      let data = {};
      try {
        data = JSON.parse(sessionStorage.getItem(state.key['login'])) || {};
      } catch (e) {}
      commit('SET_LOGIN', { data });
    },
    FETCH_UPLOAD: ({ commit, dispatch, state }, { serviceStatus }) => {
      if (serviceStatus != 1 && state.timeId != -1) {
        window.clearInterval(state.timeId);
        state.timeId = -1;
      } else if (state.timeId == -1 && serviceStatus == 1) {
        if(state.uploadTime == -1){
          dispatch('FETCH_UPLOAD_TIME').then(()=>{
            state.timeId = window.setInterval(() => {
              dispatch('FETCH_UPLOAD', { serviceStatus: 1 })
            }, state.uploadTime);
            console.log("上报平率："+state.uploadTime/1000/60+"分钟")
          })
        }else{
          state.timeId = window.setInterval(() => {
            dispatch('FETCH_UPLOAD', { serviceStatus: 1 })
          }, state.uploadTime);
          console.log("上报平率："+state.uploadTime/1000/60+"分钟")
        }
        
      }
      return new Promise((resolve, reject) => {
        fetch.upload(state.producer.number, state.position.latitude, state.position.longitude, serviceStatus)
          .then((data) => {
            resolve(data);
            if(data && data.errorCode == SUCCESS ){
              let array = data.data;
              if(array && array.length > 0){
                let notisfys = [];
                array.forEach((item)=>{
                  if(item.orderType == '2'){
                    commit('SET_RECYCLE_DOT',{flag:true})
                    notisfys.push({
                      id: getUUID()(),
                      title:"创手机-提醒您",
                      text:"您有一条新的回收订单，快来查看吧！"
                    })
                  }else if(item.orderType == '1'){
                    commit('SET_REPAIR_DOT',{flag:true})
                    notisfys.push({
                      id: getUUID()(),
                      title:"创手机-提醒您",
                      text:"您有一条新的维修订单，快来查看吧！"
                    });
                  }
                })

                notisfy(notisfys);
              }
            }
          }).catch(reject);
      })
    },
    FETCH_UPLOAD_TIME: ({ commit, dispatch, state }) => {
      return new Promise((resolve)=>{
        fetch.uploadFrequency().then((data)=>{
          resolve();
          commit("SET_UPLOAD_TIME",{data});
        })
      })
    },
    FETCH_COSTOMER: ({ commit, dispatch, state }, {customerId}) => {
      return new Promise((resolve, reject) => {
        fetch.getCustomer(customerId)
          .then((data) => {
            resolve(data);
          }).catch(reject);
      })
    },
    FETCH_STORE:({ commit, dispatch, state }) => {
      return new Promise((resolve, reject) => {
        fetch.getStoreByProducerId(state.producer.id)
          .then((data) => {
            resolve(data);
          }).catch(reject);
      })
    },
    FETCH_STORE_UPDATE:({ commit, dispatch, state },{data}) => {
      return new Promise((resolve, reject) => {
        fetch.updateByProducerId(data)
          .then((data) => {
            resolve(data);
          }).catch(reject);
      })
    },
    FETCH_STORE_ADD:({ commit, dispatch, state },{data}) => {
      return new Promise((resolve, reject) => {
        fetch.addStoreByProducerId(data)
          .then((data) => {
            resolve(data);
          }).catch(reject);
      })
    },
    //回收
    FETCH_RECYCLE_ORDER: ({ commit, dispatch, state }) => {
      return new Promise((resolve, reject) => {
        fetch.getWaitingOrder(state.producer.number)
          .then((data) => {
            resolve(data);
            commit('SET_RECYCLE_ORDER', { data })
            commit('SET_RECYCLE_DOT',{flag:false})
          }).catch(reject);
      })
    },
    FETCH_RECYCLE_ORDER_ID: ({ commit, dispatch, state },{serialNumber}) => {
      return new Promise((resolve, reject) => {
        fetch.recycleOrderById(serialNumber)
          .then((data) => {
            resolve(data);
            commit('SET_RECYCLE', { data })
          }).catch(reject);
      })
    },
    //维修
    FETCH_REPAIR_ORDER: ({ commit, dispatch, state }) => {
      return new Promise((resolve, reject) => {
        fetch.getRepairOrder(state.producer.number)
          .then((data) => {
            resolve(data);
            commit('SET_REPAIR_ORDER', { data })
            commit('SET_REPAIR_DOT', { flag:false })
          }).catch(reject);
      })
    },
    FETCH_REPAIR_ORDER_ID: ({ commit, dispatch, state },{serialNumber}) => {
      return new Promise((resolve, reject) => {
        fetch.repairOrderById(serialNumber)
          .then((data) => {
            resolve(data);
            commit('SET_REPAIR', { data })
          }).catch(reject);
      })
    },
    FETCH_POSITION: ({ commit, dispatch, state }) => {
      let longitude = localStorage.getItem(state.key.position.longitude);
      let latitude = localStorage.getItem(state.key.position.latitude);
      commit('SET_POSITION', { longitude, latitude });
    },
  },
  mutations: {
    SET_LOGIN: (state, { data }) => {
      if (data.errorCode == SUCCESS) {
        state.producer = data.data
      } else {
        state.producer = {};
      }
    },
    SET_RECYCLE_ORDER: (state, { data }) => {
      if (data.errorCode == SUCCESS) {
        state.recycleList = [...data.data];
      } else {
        state.recycleList =[];
      }
    },
    SET_RECYCLE: (state, { data }) => {
      if (data.errorCode == SUCCESS) {
        state.recycle = data.data;
      } else {
        state.recycle ={};
      }
    },
    SET_REPAIR_ORDER: (state, { data }) => {
      if (data.errorCode == SUCCESS) {
        state.repairList = [...data.data];
      } else {
        state.repairList =[];
      }
    },
    SET_REPAIR: (state, { data }) => {
      if (data.errorCode == SUCCESS) {
        state.repair = data.data;
      } else {
        state.repair ={};
      }
    },
    SET_POSITION: (state, { longitude, latitude }) => {
      if (!longitude || !latitude) {
        longitude = 113;
        latitude = 22;
      }
      state.position.longitude = longitude;
      state.position.latitude = latitude;
    },
    SET_RECYCLE_DOT: (state, { flag }) => {
      state.recycleDot = flag;
    },
    SET_REPAIR_DOT: (state, { flag }) => {
      state.repairDot = flag;
    },
    SET_USER_DOT: (state, { flag }) => {
      state.userDot = flag;
    },
    SET_UPLOAD_TIME: (state, { data }) => {
      if (data.errorCode == SUCCESS) {
        state.uploadTime = data.data * 1000 * 60;
      } else {
        state.uploadTime = 3 * 1000 * 60;
      }
    },
  }
});
