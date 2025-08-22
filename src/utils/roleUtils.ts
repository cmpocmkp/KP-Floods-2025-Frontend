export type UserRole = 'super_admin' | 'admin' | 'admin_staff';

export interface Permission {
  module: string;
  actions: string[];
}

// Define role permissions
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    { module: 'dashboard', actions: ['view'] },
    { module: 'twitter', actions: ['view'] },
    { module: 'facebook', actions: ['view'] },
    { module: 'news', actions: ['view'] },
    { module: 'sentiment', actions: ['view'] },
    { module: 'ekhtyar', actions: ['view', 'edit', 'delete'] },
    { module: 'user-management', actions: ['view', 'create', 'edit', 'delete'] },
    { module: 'settings', actions: ['view', 'edit'] },
  ],
  admin: [
    { module: 'dashboard', actions: ['view'] },
    { module: 'twitter', actions: ['view'] },
    { module: 'facebook', actions: ['view'] },
    { module: 'news', actions: ['view'] },
    { module: 'sentiment', actions: ['view'] },
    { module: 'ekhtyar', actions: ['view', 'edit'] },
    { module: 'user-management', actions: ['view'] },
  ],
  admin_staff: [
    { module: 'dashboard', actions: ['view'] },
    { module: 'twitter', actions: ['view'] },
    { module: 'facebook', actions: ['view'] },
    { module: 'news', actions: ['view'] },
    { module: 'sentiment', actions: ['view'] },
    { module: 'ekhtyar', actions: ['view'] },
  ],
};

export const hasPermission = (
  userRole: UserRole,
  module: string,
  action: string = 'view'
): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  if (!rolePermissions) return false;

  const modulePermission = rolePermissions.find(p => p.module === module);
  if (!modulePermission) return false;

  return modulePermission.actions.includes(action);
};

export const canAccessRoute = (userRole: UserRole, route: string): boolean => {
  // Map routes to modules
  const routeModuleMap: Record<string, string> = {
    '/': 'dashboard',
    '/dashboard': 'dashboard',
    '/crux': 'dashboard',
    '/platforms': 'twitter',
    '/twitter': 'twitter',
    '/facebook': 'facebook',
    '/news-ai-insights': 'news',
    '/news': 'news',
    '/sentiment-crux': 'sentiment',
    '/sentiment': 'sentiment',
    '/ekhtyar': 'ekhtyar',
    '/user-management': 'user-management',
    '/users': 'user-management',
    '/settings': 'settings',
  };

  const module = routeModuleMap[route];
  if (!module) return false;

  return hasPermission(userRole, module, 'view');
};

export const getAccessibleRoutes = (userRole: UserRole): string[] => {
  const allRoutes = [
    '/',
    '/crux',
    '/platforms',
    '/facebook',
    '/news-ai-insights',
    '/sentiment-crux',
    '/ekhtyar',
    '/user-management',
    '/settings',
  ];

  return allRoutes.filter(route => canAccessRoute(userRole, route));
};

export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case 'super_admin':
      return 'Super Admin';
    case 'admin':
      return 'Admin';
    case 'admin_staff':
      return 'Admin Staff';
    default:
      return role;
  }
};

export const getRoleBadgeColor = (role: UserRole): string => {
  switch (role) {
    case 'super_admin':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'admin':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'admin_staff':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}; 