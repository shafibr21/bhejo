export const ROLES = {
  ADMIN: "admin",
  AGENT: "agent",
  CUSTOMER: "customer",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]
