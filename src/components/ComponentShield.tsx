import React from 'react'

import {
  ComponentShieldAuthProps,
  ComponentShieldBaseProps,
  ComponentShieldRBACProps,
  ComponentShieldProps,
} from '../types/Component'


export function ComponentShield(props: ComponentShieldBaseProps): JSX.Element
export function ComponentShield(props: ComponentShieldAuthProps): JSX.Element
export function ComponentShield(props: ComponentShieldRBACProps): JSX.Element

export function ComponentShield(props: ComponentShieldProps) {
  const { showForRole, showIf, fallback = null, RBAC, userRole, children } = props

  if (RBAC) return <>{showForRole === userRole ? children : null}</>
  if (showIf) return <>{children}</>

  return <>{fallback}</>
}