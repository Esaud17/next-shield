import { RoleAccess } from '../types/props'

export function verifyPath(routes: string[] | undefined, uri: string) {
  console.log("verifyPath", routes, uri)
  return routes?.some(route => route === uri)
}

export function getAccessRoute(
  RBAC: RoleAccess<string[]> | undefined,
  userRole: string[] | undefined,
  accessRoute?: string | undefined
) {
  if (typeof accessRoute !== 'undefined') return accessRoute

  if (RBAC && userRole) {
    for (const role of userRole) {
      if (RBAC[role] && RBAC[role].hasOwnProperty('accessRoute')) {
        console.log('accessRoute', RBAC[role].accessRoute)
        return RBAC[role].accessRoute
      }
    }
  }
  return '/'
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
  console.log('grantedRoutes', grantedRoutes)
  return grantedRoutes
}
