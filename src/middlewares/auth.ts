// export function isAuthenticated() {
//   // Kiểm tra xem người dùng đã đăng nhập hay chưa
//   // Ví dụ: kiểm tra token trong localStorage hoặc Vuex store
//   return !!localStorage.getItem('token')
// }

// export function hasPermission(to) {
//   // Kiểm tra quyền truy cập vào route
//   // Bạn có thể thêm logic để kiểm tra quyền dựa trên route và quyền của người dùng
//   const userPermissions = JSON.parse(localStorage.getItem('permissions') || '[]')
//   return to.meta.permissions ? to.meta.permissions.every((permission) => userPermissions.includes(permission)) : true
// }

import type { NavigationGuardNext, RouteLocationNormalized, RouteLocationNormalizedLoaded } from 'vue-router'
import { useAuthStore } from '../stores/auth-store'

export async function Authentication(
  to: RouteLocationNormalized,
  from: RouteLocationNormalizedLoaded,
  next: NavigationGuardNext,
): Promise<void> {
  // vars
  const authStore = useAuthStore()

  // check condition
  if (authStore.accessToken == '') {
    // Nếu chưa đăng nhập, chuyển hướng sang trang đăng nhập
    next({
      name: 'login',
    })
  } else {
    // check permission
    next()
  }
}

// authorization
const adminPermisson = [
  {
    screen: 'dashboard',
    permission: ['view'],
  },
  {
    screen: 'movies',
    permission: ['view', 'edit'],
  },
  {
    screen: 'cinemas',
    permission: ['view', 'edit'],
  },
  {
    screen: 'movie-rooms',
    permission: ['view', 'edit'],
  },
  {
    screen: 'create-movie-rooms',
    permission: ['view', 'edit'],
  },
  {
    screen: 'showtimes',
    permission: ['view', 'edit'],
  },
  {
    screen: 'booking',
    permission: ['view'],
  },
  {
    screen: 'media',
    permission: ['view', 'edit'],
  },
  {
    screen: 'staffs',
    permission: ['view', 'create', 'edit', 'remove'],
  },
]
const managerPermisson = [
  {
    screen: 'dashboard',
    permission: ['view'],
  },
  {
    screen: 'movies',
    permission: ['view'],
  },
  {
    screen: 'cinemas',
    permission: ['view'],
  },
  {
    screen: 'movie-rooms',
    permission: ['view'],
  },
  {
    screen: 'showtimes',
    permission: ['view', 'edit'],
  },
  {
    screen: 'booking',
    permission: ['view'],
  },
  {
    screen: 'staffs',
    permission: ['view', 'create', 'edit', 'remove'],
  },
]
const staffPermisson = [
  {
    screen: 'dashboard',
    permission: ['view'],
  },
  {
    screen: 'movies',
    permission: ['view'],
  },
  {
    screen: 'cinemas',
    permission: ['view'],
  },
  {
    screen: 'movie-rooms',
    permission: ['view'],
  },
  {
    screen: 'showtimes',
    permission: ['view'],
  },
  {
    screen: 'booking',
    permission: ['view'],
  },
  {
    screen: 'staffs',
    permission: ['view', 'edit'],
  },
]
export function Authorization(authority: number) {
  //
  if (authority == 1) {
    return adminPermisson
  } else if (authority == 2) {
    return managerPermisson
  } else if (authority == 3) {
    return staffPermisson
  }
}

export function getDetailAuthorization(screen: string, authority: number) {
  if (authority == 1) {
    return adminPermisson.find((item) => item.screen == screen)?.permission
  } else if (authority == 2) {
    return managerPermisson.find((item) => item.screen == screen)?.permission
  } else if (authority == 3) {
    return staffPermisson.find((item) => item.screen == screen)?.permission
  }
}
