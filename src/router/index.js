import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/ListVagas"),
  },
  {
    path: "/candidatos",
    name: "candidatos",
    component: () => import("../views/ListCandidatos"),
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
