import {useEthereum} from "../Ethereum";
import {useEffect, useState} from "react";

export const Balans = () => {
  const [balance, setBalance] = useState(0)
  const [allowance, setAllowance] = useState(0)
  const eth = useEthereum()

  useEffect(() => {
    eth.getMyBalance()
      .then(x => setBalance(x))
    eth.getAllowance()
      .then(x => setAllowance(x))
  }, [eth])

  return (
    <div>
      <br/>
      my balance: {balance} innotokens; my allowance: {allowance} innotokens
    </div>
  )
}
