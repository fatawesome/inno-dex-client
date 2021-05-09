import {useState} from "react";
import {OrderFlags} from "../../types";
import {useEthereum} from "../Ethereum";

export function Knopki () {
  const [price, setPrice] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const [flags, setFlags] = useState(OrderFlags.ImmediateOrCancel)

  const eth = useEthereum()

  function submit () {
    alert('jopa')
  }

  return (
    <div className={"knopki"}>
      <form onSubmit={submit}>
        <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} />
        <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
        <select name="pohuo" id="poebat" onChange={e => setFlags(Number(e.target.value))} value={flags}>
          <option value={OrderFlags.ImmediateOrCancel.toString()}>Immediate-or-Cancel</option>
          <option value={OrderFlags.TimeInForce.toString()}>Time-in-Force</option>
          <option value={OrderFlags.GoodTillCancel.toString()}>Good-till-Cancel</option>
        </select>
        {flags === OrderFlags.TimeInForce && (<div></div>) // ebani timepicker pls
        }
        <input type="submit" value="Ebashim" />
      </form>
    </div>
  )
}
