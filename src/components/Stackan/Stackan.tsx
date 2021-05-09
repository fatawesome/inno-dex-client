import React, {useEffect, useState} from "react";
import {Order, OrderSide} from "../../types";
import "./Stackan.css";

interface Props {
  orders: Order[]
}

function prepareOrders(orders: Order[]): Order[] {
  return orders
    .sort((a, b) => {
      if (a.price === b.price) {
        return a.side - b.side
      } else {
        return a.price - b.price
      }
    })
    .reduce((acc, order) => {
      if (!acc.length) {
        return [order];
      }

      const lastOrder = acc[acc.length - 1];
      const shouldMerge = (a: Order, b: Order): boolean => a.side === b.side && a.price === b.price

      if (shouldMerge(lastOrder, order)) {
        acc[acc.length - 1] = { ...lastOrder, quantity: lastOrder.quantity + order.quantity }
        return acc;
      }
      return [...acc, order];
    }, [] as Order[])
}

const Stackan = (props: Props) => {
  const [orders, setOrders] = useState([] as Order[]);
  useEffect(() => {
    setOrders(prepareOrders(props.orders));
  }, [props.orders]);

  const getOrderClassNames = (order: Order) => `order ${order.side === OrderSide.Bid ? "order--bid" : "order--ask"}`;

  return (
    <div className="stackan">
      <ul className="order-list">
        { orders.map(order => (
          <li className={getOrderClassNames(order)} key={order.uid}>
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
