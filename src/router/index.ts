import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'

import RouteViewComponent from '../layouts/RouterBypass.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'dashboard' },
  },
  {
    name: 'admin',
    path: '/',
    component: AppLayout,
    redirect: { name: 'dashboard' },
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('../pages/admin/dashboard/Dashboard.vue'),
      },
      {
        name: 'movies',
        path: 'movies',
        component: () => import('../pages/movies/MoviesPage.vue'),
      },
      {
        name: 'cinemas',
        path: 'cinemas',
        component: () => import('../pages/cinemas/CinemasPage.vue'),
      },
      {
        name: 'movie-rooms',
        path: '/movie-rooms',
        component: RouteViewComponent,
        children: [
          {
            name: 'list-movie-rooms',
            path: 'list-movie-rooms',
            component: () => import('../pages/movie-rooms/MovieRoomsPage.vue'),
          },
          {
            name: 'create-movie-room',
            path: 'create-movie-room',
            component: () => import('../pages/movie-rooms/CreateMovieRoomPage.vue'),
          },
          {
            name: 'update-movie-room',
            path: 'update-movie-room/:_id',
            component: () => import('../pages/movie-rooms/UpdateMovieRoomPage.vue'),
          },
        ],
      },

      {
        name: 'showtimes',
        path: 'showtimes',
        component: () => import('../pages/showtimes/ShowtimesPage.vue'),
      },
      {
        name: 'booking',
        path: 'booking',
        component: () => import('../pages/booking/BookingPage.vue'),
      },
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/Login.vue'),
      },
      {
        name: 'signup',
        path: 'signup',
        component: () => import('../pages/auth/Signup.vue'),
      },
      {
        name: 'recover-password',
        path: 'recover-password',
        component: () => import('../pages/auth/RecoverPassword.vue'),
      },
      {
        name: 'recover-password-email',
        path: 'recover-password-email',
        component: () => import('../pages/auth/CheckTheEmail.vue'),
      },
      {
        path: '',
        redirect: { name: 'login' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // For some reason using documentation example doesn't scroll on page navigation.
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      window.scrollTo(0, 0)
    }
  },
  routes,
})

export default router
