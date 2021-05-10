import './App.css';
import {Order, OrderSide} from "./types";
import {Stackan} from "./components/Stackan";
import {Knopki} from "./components/Knopki/Knopki";
import {useEthereumInit} from "./components/Ethereum";
import {useEffect, useState} from "react";

import "./@types/react-datetime-picker.d.ts";
import {Balans} from "./components/Balans/Balans";

// const orders: Order[] = [
//   {uid: 1, price: 10, quantity: 1, side: OrderSide.Ask},
//   {uid: 3, price: 10, quantity: 1, side: OrderSide.Bid},
//   {uid: 2, price: 10, quantity: 1, side: OrderSide.Ask},
//   {uid: 4, price: 10, quantity: 1, side: OrderSide.Bid},
//   {uid: 5, price: 10, quantity: 1, side: OrderSide.Ask},
//   {uid: 7, price: 10, quantity: 1, side: OrderSide.Bid}
// ]

function App() {
  const [orders, setOrders] = useState([] as Order[])
  const ethResult = useEthereumInit()

  useEffect(() => {
    const eth = ethResult.ethereum
    if (!eth) return

    eth.getAllOrders()
      .then(orders => setOrders(orders))
  }, [ethResult.ethereum])

  if (ethResult.fallback) {
    return ethResult.fallback
  }

  return (
    <div className="App">
      {ethResult.provideEthereum(
        <div>
          <Balans/>
          <Knopki/>
          <Stackan orders={orders}/>
        </div>
      )}
    </div>
  );
}

export default App;
