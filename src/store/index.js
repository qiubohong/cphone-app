import Vue from 'vue'
import Vuex from 'vuex'
import * as fetch from './fetch'

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
    recycleList:[],


    timeId: -1,
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
      if (data.data) {
        //3分钟上报位置
        dispatch('FETCH_UPLOAD', { serviceStatus: 1 });
      }
    },
    FETCH_UPLOAD: ({ commit, dispatch, state }, { serviceStatus }) => {
      if (serviceStatus != 1 && state.timeId != -1) {
        window.clearInterval(state.timeId);
        state.timeId = -1;
      } else if (state.timeId == -1 && serviceStatus == 1) {
        state.timeId = window.setInterval(() => {
          dispatch('FETCH_UPLOAD', { serviceStatus: 1 })
        }, 6000 * 3);
      }
      return new Promise((resolve, reject) => {
        fetch.upload(state.producer.number, state.position.latitude, state.position.longitude, serviceStatus)
          .then((data) => {
            resolve(data);
          }).catch(reject);
      })
    },

    FETCH_RECYCLE_ORDER: ({ commit, dispatch, state }) => {
      return new Promise((resolve, reject) => {
        fetch.getWaitingOrder(state.producer.id)
          .then((data) => {
            resolve(data);
            commit('SET_RECYCLE_ORDER', { data })
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
    SET_POSITION: (state, { longitude, latitude }) => {
      if (!longitude || !latitude) {
        longitude = 113;
        latitude = 22;
      }
      state.position.longitude = longitude;
      state.position.latitude = latitude;
    },
  }
});
