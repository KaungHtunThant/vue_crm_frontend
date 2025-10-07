import { usePermissionStore } from "@/stores/PermissionStore";

export function requirePermission(permission) {
  return (to, from, next) => {
    const permissionStore = usePermissionStore();

    if (permissionStore.hasPermission(permission)) {
      next();
    } else {
      next(from.fullPath);
    }
  };
}

export function requireGuest() {
  return (to, from, next) => {
    const permissionStore = usePermissionStore();

    if (!permissionStore.isAuthenticated) {
      next();
    } else {
      next({ path: "/dashboard", replace: true });
    }
  };
}
