export type Customer = {
  id: string
  name: string
  phone: string
}

export type Product = {
  id: string
  name: string
  price: number
  stock: number
}

export type CartItem = Product & {
  quantity: number
}