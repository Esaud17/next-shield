import { RoleAccess } from '../types/props'

export function verifyPath(routes: string[] | undefined, uri: string) {
  if (routes === undefined || routes?.length == 0) return false;
  return routes?.some(route => route === uri)
}

export function getAccessRoute(
  RBAC: RoleAccess<string[]> | undefined,
  userRole: string[] | undefined,
  accessRoute?: string | undefined,
  defaultAccessRoute?: string | undefined
) {
  if (typeof accessRoute !== 'undefined') return accessRoute

  if (RBAC && userRole) {
    for (const role of userRole) {
      if (RBAC[role] && RBAC[role].hasOwnProperty('accessRoute')) {
        return RBAC[role].accessRoute
      }
    }
  }
  return defaultAccessRoute
}

export function getGrantedRoutes(
  RBAC: RoleAccess<string[]> | undefined,
  userRole: string[] | undefined,
  accessRoute?: string | undefined
) {
  let grantedRoutes: string[] = []
  if (RBAC && userRole) {
    for (const role of userRole) {
      if (RBAC.hasOwnProperty(role) && RBAC[role].hasOwnProperty('grantedRoutes')) {
        grantedRoutes = grantedRoutes.concat(RBAC[role].grantedRoutes)
      }
    }
  }

  if (accessRoute) {
    if (!grantedRoutes.includes(accessRoute)) {
      grantedRoutes.push(accessRoute)
    }
  }
  return grantedRoutes
}
