import { Car, FileWarning, Home, ShieldCheck, type LucideIcon } from "lucide-react"

import { paths, PORTAL_PREFIX } from "./paths"

export type NavItem = { to: string; label: string; icon: LucideIcon; match?: RegExp }

export const NAV_ITEMS: NavItem[] = [
  { to: paths.portal.home, label: "Home", icon: Home },
  {
    to: paths.portal.lookup,
    label: "Vehicle lookup",
    icon: Car,
    match: new RegExp(`^${PORTAL_PREFIX}/(lookup|vehicle)`),
  },
  { to: paths.portal.requests, label: "Authorization requests", icon: ShieldCheck },
  { to: paths.portal.cases, label: "Cases", icon: FileWarning },
]

export function isActive(item: NavItem, pathname: string): boolean {
  return item.match ? item.match.test(pathname) : pathname === item.to
}
