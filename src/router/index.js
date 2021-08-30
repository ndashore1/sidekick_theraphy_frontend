import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import Home from "../views/Home.vue";
import Register from "../views/Register";
import Login from "../views/Login";
import Goals from "../views/Goals";
import Plan from "../views/Plan";
import Showplan from "../views/Showplan";
import Updateplan from "../views/Updateplan";
import Showgoal from "../views/Showgoal";
import Updategoal from "../views/Updategoal";
import Switchtherapist from "../views/Switchtherapist";



Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { guest: true },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { guest: true },
  },
  {
    path: "/goals",
    name: "Goals",
    component: Goals,
    meta: { requiresAuth: true },
  },
  {
    path: "/plan-of-care",
    name: "Plan",
    component: Plan,
    meta: { requiresAuth: true },
  },
  {
    path: "/show-plan",
    name: "ShowPlan",
    component: Showplan,
    meta: { requiresAuth: true },
  },
  {
    path: "/update-plan",
    name: "Updateplan",
    component: Updateplan,
    meta: { requiresAuth: true },
  },
  {
    path: "/show-goal",
    name: "ShowGoal",
    component: Showgoal,
    meta: { requiresAuth: true },
  },
  {
    path: "/update-goal",
    name: "Updategoal",
    component: Updategoal,
    meta: { requiresAuth: true },
  },
  {
    path: "/switch-therapist",
    name: "Switchtherapist",
    component: Switchtherapist,
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.isAuthenticated) {
      next();
      return;
    }
    next("/login");
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.guest)) {
    if (store.getters.isAuthenticated) {
      next("/home");
      return;
    }
    next();
  } else {
    next();
  }
});

export default router;
