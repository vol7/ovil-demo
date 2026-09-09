import { Car, FileWarning, Home, ShieldCheck, type LucideIcon } from "lucide-react"

export type NavItem = { to: string; label: string; icon: LucideIcon; match?: RegExp }

export const NAV_ITEMS: NavItem[] = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/lookup", label: "Vehicle lookup", icon: Car, match: /^\/(lookup|vehicle)/ },
  { to: "/requests", label: "Authorization requests", icon: ShieldCheck },
  { to: "/cases", label: "Cases", icon: FileWarning },
]

export function isActive(item: NavItem, pathname: string): boolean {
  return item.match ? item.match.test(pathname) : pathname === item.to
}
