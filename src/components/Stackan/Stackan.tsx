import React, {useEffect, useState} from "react";
import {Order, OrderSide} from "../../types";
import "./Stackan.css";
import {useEthereum} from "../Ethereum";

interface Props {
  orders: Order[]
}

interface MegaOrder extends Omit<Order, 'uid'> {
  uids: number[]
}

function prepareOrders(orders: Order[]): MegaOrder[] {
  return orders
    .sort((a, b) => {
      if (a.price === b.price) {
        return a.side - b.side
      } else {
        return b.price - a.price
      }
    })
    .reduce((acc, order) => {
      if (!acc.length) {
        return [{
          ...order,
          uids: [order.uid]
        }];
      }

      const lastOrder = acc[acc.length - 1];
      const shouldMerge = (a: MegaOrder, b: Order): boolean => a.side === b.side && a.price === b.price

      if (shouldMerge(lastOrder, order)) {
        acc[acc.length - 1] = { ...lastOrder, quantity: lastOrder.quantity + order.quantity }
        return acc;
      }
      return [...acc, {
        ...order,
        uids: [order.uid]
      }];
    }, [] as MegaOrder[])
}

const Stackan = (props: Props) => {
  const [orders, setOrders] = useState([] as MegaOrder[]);
  useEffect(() => {
    setOrders(prepareOrders(props.orders));
  }, [props.orders]);
  const eth = useEthereum()

  const getOrderClassNames = (order: MegaOrder) => `order ${Number(order.side) === OrderSide.Bid ? "order--bid" : "order--ask"}`;

  async function cancel(uid: number) {
    await eth.cancelOrder(uid)
  }

  return (
    <div className="stackan">
      <ul className="order-list">
        { orders.map(order => (
          <li className={getOrderClassNames(order)} key={JSON.stringify(order.uids)}>
            <span><b>Uids:</b> { order.uids.join(', ') }</span>
            &nbsp;
            <span><b>Price:</b> { order.price } WEI</span>
            &nbsp;
            <span><b>Quantity:</b> { order.quantity }</span>
          </li>
        )) }
      </ul>
    </div>
  )
}

export default Stackan;
