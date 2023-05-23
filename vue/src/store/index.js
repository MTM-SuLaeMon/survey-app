import { createStore } from "vuex";
import axiosClient from "../axios";
import auth from "./auth/auth";

const store = createStore({
  state: {
    dashboard: {
      loading: false,
      data: {},
    },
    surveys: {
      loading: false,
      data: [],
      links: [],
    },
    questionTypes: ["text", "select", "radio", "checkbox", "textarea"],
    currentSurvey: {
      data: {},
      loading: false,
    },
    notification: {
      show: false,
      type: "success",
      message: "",
    },
  },
  getters: {},
  actions: {
    getDashboardData({ commit }) {
      commit("dashboardLoading", true);
      return axiosClient
        .get(`/dashboard`)
        .then((res) => {
          commit("dashboardLoading", false);
          commit("setDashboardData", res.data);
          return res;
        })
        .catch((error) => {
          commit("dashboardLoading", false);
          return error;
        });
    },
    getSurveyBySlug({ commit }, slug) {
      commit("setCurrentSurveyLoading", true);
      return axiosClient
        .get(`/survey-by-slug/${slug}`)
        .then((res) => {
          commit("setCurrentSurvey", res.data);
          commit("setCurrentSurveyLoading", false);
          return res;
        })
        .catch((err) => {
          commit("setCurrentSurveyLoading", false);
          throw err;
        });
    },
    getSurveys({ commit }, { url = null } = {}) {
      commit("setSurveysLoading", true);
      url = url || "/survey";
      return axiosClient.get(url).then((res) => {
        commit("setSurveysLoading", false);
        commit("setSurveys", res.data);
        return res;
      });
    },
    getSurvey({ commit }, id) {
      commit("setCurrentSurveyLoading", true);
      return axiosClient
        .get(`/survey/${id}`)
        .then((res) => {
          commit("setCurrentSurvey", res.data);
          commit("setCurrentSurveyLoading", false);
          return res;
        })
        .catch((err) => {
          commit("setCurrentSurveyLoading", false);
          throw err;
        });
    },
    saveSurvey({ commit }, survey) {
      // delete survey.image_url
      let response;
      if (survey.id) {
        response = axiosClient
          .put(`/survey/${survey.id}`, survey)
          .then((res) => {
            commit("updateSurvey", res.data);
            return res;
          });
      } else {
        response = axiosClient.post("/survey", survey).then((res) => {
          commit("saveSurvey", res.data);
          return res;
        });
      }

      return response;
    },
    deleteSurvey({}, id) {
      return axiosClient.delete(`/survey/${id}`).then((res) => {
        return res;
      });
    },
    saveSurveyAnswer({ commit }, { surveyId, answers }) {
      return axiosClient.post(`/survey/${surveyId}/answer`, { answers });
    },
  },
  mutations: {
    dashboardLoading: (state, loading) => {
      state.dashboard.loading = loading;
    },
    setDashboardData: (state, data) => {
      state.dashboard.data = data;
    },
    setSurveysLoading: (state, loading) => {
      state.surveys.loading = loading;
    },
    setSurveys: (state, surveys) => {
      state.surveys.data = surveys.data;
      state.surveys.links = surveys.meta.links;
    },
    setCurrentSurveyLoading: (state, loading) => {
      state.currentSurvey.loading = loading;
    },
    setCurrentSurvey: (state, survey) => {
      state.currentSurvey.data = survey.data;
    },
    notify: (state, { message, type }) => {
      state.notification.show = true;
      state.notification.type = type;
      state.notification.message = message;
      setTimeout(() => {
        state.notification.show = false;
      }, 3000);
    },
  },
  modules: {
    auth: auth,
  },
});

export default store;
