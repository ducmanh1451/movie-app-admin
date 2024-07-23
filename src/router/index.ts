import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'

// import RouteViewComponent from '../layouts/RouterBypass.vue'
import { isAuthenticated, hasPermission } from '../middlewares/auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'dashboard' },
  },
  // {
  //   name: 'admin',
  //   path: '/',
  //   component: AppLayout,
  //   redirect: { name: 'dashboard' },
  //   children: [
  //     {
  //       name: 'dashboard',
  //       path: 'dashboard',
  //       component: () => import('../pages/admin/dashboard/Dashboard.vue'),
  //     },
  //     {
  //       name: 'movies',
  //       path: 'movies',
  //       component: () => import('../pages/movies/MoviesPage.vue'),
  //     },
  //     {
  //       name: 'cinemas',
  //       path: 'cinemas',
  //       component: () => import('../pages/cinemas/CinemasPage.vue'),
  //     },
  //     {
  //       name: 'movie-rooms',
  //       path: '/movie-rooms',
  //       component: RouteViewComponent,
  //       children: [
  //         {
  //           name: 'list-movie-rooms',
  //           path: 'list-movie-rooms',
  //           component: () => import('../pages/movie-rooms/MovieRoomsPage.vue'),
  //         },
  //         {
  //           name: 'create-movie-room',
  //           path: 'create-movie-room',
  //           component: () => import('../pages/movie-rooms/CreateMovieRoomPage.vue'),
  //         },
  //         {
  //           name: 'update-movie-room',
  //           path: 'update-movie-room/:_id',
  //           component: () => import('../pages/movie-rooms/UpdateMovieRoomPage.vue'),
  //         },
  //       ],
  //     },

  //     {
  //       name: 'showtimes',
  //       path: 'showtimes',
  //       component: () => import('../pages/showtimes/ShowtimesPage.vue'),
  //     },
  //     {
  //       name: 'booking',
  //       path: 'booking',
  //       component: () => import('../pages/booking/BookingPage.vue'),
  //     },
  //     {
  //       name: 'media',
  //       path: 'media',
  //       component: () => import('../pages/media/MediaPage.vue'),
  //     },
  //   ],
  // },
  {
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
        // meta: { requiresAuth: true },
      },
      {
        name: 'cinemas',
        path: 'cinemas',
        component: () => import('../pages/cinemas/CinemasPage.vue'),
      },
      // test
      {
        name: 'movie-rooms',
        path: 'movie-rooms',
        component: () => import('../pages/movie-rooms/MovieRoomsPage.vue'),
      },
      {
        name: 'create-movie-rooms',
        path: 'movie-rooms/create',
        component: () => import('../pages/movie-rooms/CreateMovieRoomPage.vue'),
      },
      {
        name: 'update-movie-room',
        path: 'movie-rooms/update/:_id',
        component: () => import('../pages/movie-rooms/UpdateMovieRoomPage.vue'),
      },
      // test
      // {
      //   name: 'movie-rooms',
      //   path: '/movie-rooms',
      //   // component: RouteViewComponent,
      //   children: [
      //     {
      //       name: 'list-movie-rooms',
      //       path: 'list-movie-rooms',
      //       component: () => import('../pages/movie-rooms/MovieRoomsPage.vue'),
      //     },
      //     {
      //       name: 'create-movie-room',
      //       path: 'create-movie-room',
      //       component: () => import('../pages/movie-rooms/CreateMovieRoomPage.vue'),
      //     },
      //     {
      //       name: 'update-movie-room',
      //       path: 'update-movie-room/:_id',
      //       component: () => import('../pages/movie-rooms/UpdateMovieRoomPage.vue'),
      //     },
      //   ],
      // },
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
      {
        name: 'media',
        path: 'media',
        component: () => import('../pages/media/MediaPage.vue'),
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
        component: () => import('../pages/auth/LoginPage.vue'),
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

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
    next({ name: 'login' })
  } else if (to.meta.permissions && !hasPermission(to)) {
    // Chuyển hướng đến trang không có quyền truy cập nếu không có quyền
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
