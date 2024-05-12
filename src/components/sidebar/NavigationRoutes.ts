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
      name: 'users',
      displayName: 'menu.users',
      meta: {
        icon: 'group',
      },
    },
    // custom
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
        icon: 'house',
      },
    },
    {
      name: 'movie-rooms',
      displayName: 'menu.movie-rooms',
      meta: {
        icon: 'class',
      },
      children: [
        {
          name: 'list-movie-rooms',
          displayName: 'menu.list-movie-rooms',
          isNotDisplayed: false,
        },
        {
          name: 'create-movie-room',
          displayName: 'menu.create-movie-room',
          isNotDisplayed: false,
        },
        {
          name: 'update-movie-room',
          displayName: 'menu.update-movie-room',
          isNotDisplayed: true,
        },
      ],
    },
    {
      name: 'showtimes',
      displayName: 'menu.showtimes',
      meta: {
        icon: 'mi-calendar_today',
      },
    },
    // end

    {
      name: 'projects',
      displayName: 'menu.projects',
      meta: {
        icon: 'folder_shared',
      },
    },
    {
      name: 'payments',
      displayName: 'menu.payments',
      meta: {
        icon: 'credit_card',
      },
      children: [
        {
          name: 'payment-methods',
          displayName: 'menu.payment-methods',
          isNotDisplayed: false,
        },
        {
          name: 'pricing-plans',
          displayName: 'menu.pricing-plans',
          isNotDisplayed: false,
        },
        {
          name: 'billing',
          displayName: 'menu.billing',
          isNotDisplayed: false,
        },
      ],
    },
    {
      name: 'auth',
      displayName: 'menu.auth',
      meta: {
        icon: 'login',
      },
      children: [
        {
          name: 'login',
          displayName: 'menu.login',
          isNotDisplayed: false,
        },
        {
          name: 'signup',
          displayName: 'menu.signup',
          isNotDisplayed: false,
        },
        {
          name: 'recover-password',
          displayName: 'menu.recover-password',
          isNotDisplayed: false,
        },
      ],
    },

    {
      name: 'faq',
      displayName: 'menu.faq',
      meta: {
        icon: 'quiz',
      },
    },
    {
      name: '404',
      displayName: 'menu.404',
      meta: {
        icon: 'vuestic-iconset-files',
      },
    },
    {
      name: 'preferences',
      displayName: 'menu.preferences',
      meta: {
        icon: 'manage_accounts',
      },
    },
    {
      name: 'settings',
      displayName: 'menu.settings',
      meta: {
        icon: 'settings',
      },
    },
  ] as INavigationRoute[],
}
