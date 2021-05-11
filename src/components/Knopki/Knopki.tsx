import { useState } from 'react'

import DateTimePicker from 'react-datetime-picker'
import { OrderFlags, OrderSide } from '../../types'
import { useEthereum } from '../Ethereum'

import './Knopki.css'

export function Knopki () {
  const [side, setSide] = useState(OrderSide.Ask)
  const [price, setPrice] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const [flags, setFlags] = useState(OrderFlags.ImmediateOrCancel)
  const [datetimeInForce, setDatetimeInForce] = useState(new Date())
  const [uidToCancel, setUidToCancel] = useState(0)

  const eth = useEthereum()

  async function submit (e: any) {
    e.preventDefault()
    await eth.createLimitOrder(side, price, quantity, flags, datetimeInForce)
  }

  async function cancel (e: any) {
    e.preventDefault()
    await eth.cancelOrder(uidToCancel)
  }

  async function tap () {
    await eth.tap()
  }

  return (
    <div className={'knopki'}>
      <br/>

      <form onSubmit={submit}>
        <label htmlFor="tap">
          <button id="tap" onClick={tap}>
            gimme munnies
          </button>
        </label>

        <label htmlFor="price">
          Price:
          <input id="price" type="number" value={price} onChange={e => setPrice(Number(e.target.value))}/>
        </label>

        <label htmlFor="quantity">
          Quantity
          <input id="quantity" type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))}/>
        </label>

        <label htmlFor="govna">
          Side:
          <select name="zopa" id="govna" onChange={e => setSide(Number(e.target.value))}>
            <option value={OrderSide.Ask.toString()}>Ask</option>
            <option value={OrderSide.Bid.toString()}>Bid</option>
          </select>
        </label>

        <label htmlFor="poebat">
          Flags:
          <select name="pohuo" id="poebat" onChange={e => setFlags(Number(e.target.value))} value={flags}>
            <option value={OrderFlags.ImmediateOrCancel.toString()}>Immediate-or-Cancel</option>
            <option value={OrderFlags.TimeInForce.toString()}>Time-in-Force</option>
            <option value={OrderFlags.GoodTillCancel.toString()}>Good-till-Cancel</option>
          </select>
        </label>

        {
          flags === OrderFlags.TimeInForce && (
            <label>
              <DateTimePicker value={datetimeInForce} onChange={setDatetimeInForce}/>
            </label>
          )
        }
        <input type="submit" value="Ebashim"/>
      </form>

      <br/>

      <form onSubmit={cancel}>
        <label htmlFor="uidToCancel">
          <input type="number" id="uidToCancel" value={uidToCancel}
                 onChange={e => setUidToCancel(Number(e.target.value))}/>
        </label>
        <input type="submit" value="Ebani po bashke blya"/>
      </form>
    </div>
  )
}
