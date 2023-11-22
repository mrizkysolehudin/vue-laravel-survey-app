import { createStore } from 'vuex';
import axiosClient from '../helpers/axiosClient';

const store = createStore({
  state: {
    user: {
      data: {},
      token: localStorage.getItem('token')
    },
    home: {
      loading: false,
      data: {}
    },
    surveys: {
      loading: false,
      data: [],
      links: []
    },
    surveyDetails: {
      loading: false,
      data: {}
    },
    questionTypes: ['text', 'select', 'radio', 'checkbox', 'textarea'],
    notification: {
      show: false,
      type: 'success',
      message: ''
    }
  },
  getters: {},
  actions: {
    registerAction({ commit }, user) {
      return axiosClient.post('/users/signup', user).then(({ data }) => {
        commit('setUser', data.user);
        commit('setToken', data.token);
        return data;
      });
    }
  },
  mutations: {
    setUser: (state, user) => {
      state.user.data = user;
    },
    setToken: (state, token) => {
      state.user.token = token;
      localStorage.setItem('token', token);
    }
  },
  modules: {}
});

export default store;
