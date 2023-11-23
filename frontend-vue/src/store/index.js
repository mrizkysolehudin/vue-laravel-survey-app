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
  getters: {
    hasToken: (state) => {
      return state.user.token !== null;
    },
  },
  actions: {
    registerAction({ commit }, user) {
      return axiosClient.post('/users/signup', user).then(({ data }) => {
        commit('setUser', data.user);
        commit('setToken', data.token);
        return data;
      });
    },
    loginAction({ commit }, user) {
      return axiosClient.post('/users/login', user).then(({ data }) => {
        commit('setUser', data.user);
        commit('setToken', data.token);
        return data;
      });
    },
    logoutAction({ commit }) {
      return axiosClient.post('/users/logout').then((response) => {
        commit('setLogout');
        return response;
      });
    },
    getHomeDataAction({ commit }) {
      commit('setHomeLoading', true);
      return axiosClient.get('/dashboard')
        .then((res) => {
          commit('setHomeLoading', false);
          commit('setHomeData', res.data);
          return res;
        }).catch((error) => {
          commit('setHomeLoading', false);
          return error;
        });
    },
    getSurveysAction({ commit }, { url = null } = {}) {
      commit('setSurveysLoading', true);
      url = url || '/survey';
      return axiosClient.get(url).then((res) => {
        commit('setSurveysLoading', false);
        commit('setSurveys', res.data);
        return res;
      });
    },
    deleteSurveyAction({ dispatch }, id) {
      return axiosClient.delete(`/survey/${id}`).then((res) => {
        dispatch('getSurveysAction');
        return res;
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
    },
    setLogout: (state) => {
      state.user.token = null;
      state.user.data = {};
      localStorage.removeItem('token');
    },
    setHomeLoading: (state, loading) => {
      state.home.loading = loading;
    },
    setHomeData: (state, data) => {
      state.home.data = data;
    },
    setSurveysLoading: (state, loading) => {
      state.surveys.loading = loading;
    },
    setSurveys: (state, surveys) => {
      state.surveys.data = surveys.data;
      state.surveys.links = surveys.meta.links;
    }
  },
  modules: {}
});

export default store;
