import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('./views/LibraryPage.vue') },
    { path: '/search', component: () => import('./views/SearchPage.vue') },
  ],
})
