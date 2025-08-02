export interface User {
  _id: string
  name: string
  email: string
  role: "admin" | "agent" | "customer"
  phone?: string
  address?: string
  createdAt: Date
  updatedAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role: "customer" | "agent"
  phone?: string
  address?: string
}
