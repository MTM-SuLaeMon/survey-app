import axiosClient from "../../axios";

export default {
  namespaced: true,
  state: {
    user: {
      data: {},
      token: sessionStorage.getItem("TOKEN"),
    },
  },
  actions: {
    login({ commit }, user) {
      console.log("auth");
      return axiosClient.post("/login", user).then(({ data }) => {
        commit("setUser", data);
        return data;
      });
    },
    logout({ commit }) {
      return axiosClient.post("/logout").then((response) => {
        commit("logout");
        return response;
      });
    },
    register({ commit }, user) {
      return axiosClient.post("/register", user).then(({ data }) => {
        commit("setUser", data);
        return data;
      });
    },
  },
  mutations: {
    setUser: (state, user) => {
      state.user.token = user.token;
      state.user.data = user.user;
      sessionStorage.setItem("TOKEN", user.token);
    },
    logout: (state) => {
      state.user.data = {};
      state.user.token = null;
      sessionStorage.removeItem("TOKEN");
    },
  },
};
