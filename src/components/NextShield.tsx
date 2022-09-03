import React, { ReactNode, useEffect } from 'react'

import { NextShieldProps } from '../types/props'
import { verifyPath, getAccessRoute, getGrantedRoutes } from '../libs/routes'

/**
 * 😉 The shield that every Next.js app needs
 *
 * @typeParam NextShieldProps - {@link NextShieldProps | see here}
 * @returns NextShield Component
 *
 * @example
 * ```tsx
 * import { Loading } from '@/components/routes/Loading'
 * import { useAuth } from '@/hooks/auth'
 *
 * export default function MyApp({ Component, pageProps }: AppProps) {
 *  const { isAuth, isLoading } = useAuth()
 *  const router = useRouter()
 *
 *  return (
 *    <NextShield
 *      isAuth={isAuth}
 *      isLoading={isLoading}
 *      router={router}
 *      privateRoutes={['/protected']}
 *      publicRoutes={['/']}
 *      hybridRoutes={['/products/[slug]']}
 *      LoadingComponent={<Loading />}
 *    >
 *      <Component {...pageProps} />
 *    </NextShield>
 *   )
 * }
 *
 * ```
 * @packageDocumentation
 */

export function NextShield<
  PrivateRoutesList extends string[],
  PublicRoutesList extends string[]
>({
  isAuth,
  isLoading,
  router: { pathname, replace },
  loginRoute,
  accessRoute,
  defaultRoute,
  privateRoutes,
  publicRoutes,
  hybridRoutes,
  LoadingComponent,
  RBAC,
  userRole,
  children,
}: NextShieldProps<PrivateRoutesList, PublicRoutesList> & { children: ReactNode }) {

  debugger
  
  let view = (<>{children}</>);

  const pathIsPrivate = verifyPath(privateRoutes, pathname)
  const pathIsPublic = verifyPath(publicRoutes, pathname)
  const pathIsHybrid = verifyPath(hybridRoutes, pathname)

  const access = getAccessRoute(RBAC, userRole, accessRoute, defaultRoute)
  const grantedRoutes= getGrantedRoutes(RBAC, userRole, access)
  const pathIsAuthorized = RBAC && userRole && verifyPath(grantedRoutes, pathname)
  
  useEffect(() => {
    if (!isAuth && !isLoading && pathIsPrivate) replace(loginRoute)
    if (isAuth && !isLoading && pathIsPublic) replace(access || defaultRoute)
    if (isAuth && userRole && !isLoading && !pathIsHybrid && !pathIsAuthorized) replace(access || '/')
  }, [
    replace,
    userRole,
    access,
    isAuth,
    isLoading,
    loginRoute,
    pathIsPrivate,
    pathIsPublic,
    pathIsHybrid,
    pathIsAuthorized,
  ])

  const loadingPathPrivate = ((isLoading || !isAuth) && pathIsPrivate);
  const loadingPathPublic = ((isLoading || isAuth) && pathIsPublic);
  const loadingPathAuthHybrid = ((isLoading || userRole) && !pathIsAuthorized && !pathIsHybrid);
  const loadingPathHybrid = (isLoading && pathIsHybrid);

  if (
    loadingPathPrivate ||
    loadingPathPublic ||
    loadingPathAuthHybrid ||
    loadingPathHybrid
  ) {
    view = (<>{LoadingComponent}</>);
  }

  return view;
}
