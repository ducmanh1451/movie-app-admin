export function isAuthenticated() {
  // Kiểm tra xem người dùng đã đăng nhập hay chưa
  // Ví dụ: kiểm tra token trong localStorage hoặc Vuex store
  return !!localStorage.getItem('token')
}

export function hasPermission(to) {
  // Kiểm tra quyền truy cập vào route
  // Bạn có thể thêm logic để kiểm tra quyền dựa trên route và quyền của người dùng
  const userPermissions = JSON.parse(localStorage.getItem('permissions') || '[]')
  return to.meta.permissions ? to.meta.permissions.every((permission) => userPermissions.includes(permission)) : true
}
