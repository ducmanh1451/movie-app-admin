export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  // children?: INavigationRoute[]
  children?: (INavigationRoute & { isNotDisplayed?: boolean })[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'dashboard',
      displayName: 'menu.dashboard',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    {
      name: 'movies',
      displayName: 'menu.movies',
      meta: {
        icon: 'movie',
      },
    },
    {
      name: 'cinemas',
      displayName: 'menu.cinemas',
      meta: {
        icon: 'theaters',
      },
    },
    {
      name: 'movie-rooms',
      displayName: 'menu.movie-rooms',
      meta: {
        icon: 'meeting_room',
      },
    },
    {
      name: 'create-movie-rooms',
      displayName: 'menu.create-movie-room',
      meta: {
        icon: 'meeting_room',
      },
    },
    {
      name: 'showtimes',
      displayName: 'menu.showtimes',
      meta: {
        icon: 'calendar_month',
      },
    },
    {
      name: 'booking',
      displayName: 'menu.booking',
      meta: {
        icon: 'confirmation_number',
      },
    },
    {
      name: 'media',
      displayName: 'menu.media',
      meta: {
        icon: 'image',
      },
    },
    {
      name: 'staffs',
      displayName: 'menu.staffs',
      meta: {
        icon: 'group',
      },
    },
    // {
    //   name: 'auth',
    //   displayName: 'menu.auth',
    //   meta: {
    //     icon: 'login',
    //   },
    //   children: [
    //     {
    //       name: 'login',
    //       displayName: 'menu.login',
    //       isNotDisplayed: false,
    //     },
    //     {
    //       name: 'signup',
    //       displayName: 'menu.signup',
    //       isNotDisplayed: false,
    //     },
    //     {
    //       name: 'recover-password',
    //       displayName: 'menu.recover-password',
    //       isNotDisplayed: false,
    //     },
    //   ],
    // },
  ] as INavigationRoute[],
}
