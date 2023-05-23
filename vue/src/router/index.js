import { createRouter, createWebHistory } from "vue-router";
import AuthLayout from "../components/AuthLayout.vue";
import DefaultLayout from "../components/DefaultLayout.vue";
import Dashboard from "../views/Dashboard.vue";
import Surveys from "../views/Surveys.vue";
import SurveyView from "../views/SurveyView.vue";
import SurveyPublicView from "../views/SurveyPublicView.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import store from "../store";

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
    name: "DefaultLayout",
    component: DefaultLayout,
    // roles to control who can access the route
    meta: { requiresAuth: true },
    // nested route
    children: [
      { path: "/dashboard", name: "Dashboard", component: Dashboard },
      { path: "/surveys", name: "Surveys", component: Surveys },
      { path: "/surveys/create", name: "SurveyCreate", component: SurveyView },
      // dynamic route start with colon
      { path: "/surveys/:id", name: "SurveyView", component: SurveyView },
    ],
  },
  {
    path: "/view/survey/:slug",
    name: 'SurveyPublicView',
    component: SurveyPublicView
  },
  {
    path: "/auth",
    redirect: "/login",
    name: "Auth",
    component: AuthLayout,
    meta: { isGuest: true },
    children: [
      {
        path: "/login",
        name: "Login",
        component: Login,
      },
      {
        path: "/register",
        name: "Register",
        component: Register,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// navigation guards
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.state.auth.user.token) {
    next({ name: "Login" });
  } else if (store.state.auth.user.token && to.meta.isGuest) {
    next({ name: "Dashboard" });
  } else {
    next();
  }
});

export default router;
