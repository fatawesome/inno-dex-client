export enum OrderSide {
  Bid, Ask
}

export enum OrderFlags {
  ImmediateOrCancel,
  TimeInForce,
  GoodTillCancel
}

export interface Order {
  uid: number
  side: OrderSide
  price: number
  quantity: number
  owner: string
}
