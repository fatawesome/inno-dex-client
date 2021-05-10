import React, {ReactElement, useContext, useState} from 'react'
import Web3 from 'web3'
import {Order, OrderFlags, OrderSide} from "../types";

import coinAbi from "../coin_abi.json";
import dicksAbi from "../dicks_abi.json";

const coinAddress = "0xc6bba2bb7a3a565224c5871158D9Ad1ABf2072B8";
const dicksAddress = "0xceff1560c64b3b4af8dd06d5e5711c8309542a09";

declare global {
  interface Window {
    web3: Web3
    ethereum: any
  }
}

interface Ok {
  fallback?: undefined
  ethereum: Ethereum
  provideEthereum: (x: ReactElement) => ReactElement
}

interface NotOk {
  fallback: ReactElement
  ethereum?: undefined
  provideEthereum?: undefined
}

type UseEthereumResult = Ok | NotOk

class Ethereum {
  constructor(
    public account: string,
    private coinContract = new window.web3.eth.Contract(coinAbi as any, coinAddress),
    private dicksContract = new window.web3.eth.Contract(dicksAbi as any, dicksAddress)
  ) {
    window.web3.defaultAccount = account
  }

  async getAllowance(): Promise<number> {
    return await this.coinContract.methods.allowance(this.account, dicksAddress).call({ from: this.account })
  }

  async getMyBalance(): Promise<number> {
    return await this.coinContract.methods.balanceOf(this.account).call({ from: this.account })
  }

  async cancelOrder(uid: number): Promise<void> {
    return await this.dicksContract.methods.cancelOrder(uid).send({ from: this.account })
  }

  async getAllOrders(): Promise<Order[]> {
    const asks = await this.dicksContract.methods.allAsks().call({from: this.account})
    const bids = await this.dicksContract.methods.allBids().call({from: this.account})
    return [
      ...asks,
      ...bids
    ]
  }

  async createLimitOrder(side: OrderSide, price: number, quantity: number, flags: OrderFlags, goodTill: Date): Promise<void> {
    const uid = await this.dicksContract.methods.next_order().call({from: this.account});
    const goodTillNumber = Math.floor(goodTill.getTime() / 1000);

    const args: any = { from: this.account }

    switch (side) {
      case OrderSide.Bid:
        args.value = price * quantity
        break;
      case OrderSide.Ask:
        const allowance = await this.getAllowance()
        if (allowance < quantity) {
          await this.coinContract.methods.approve(dicksAddress, allowance + quantity).send({ from: this.account })
        }
        break;
    }

    await this.dicksContract.methods
      .limitOrder(uid, side, price, quantity, flags, goodTillNumber)
      .send(args);
  }

  async tap() {
    await this.coinContract.methods.tap().send({ from: this.account })
  }
}

const EthereumContext = React.createContext<Ethereum | undefined>(undefined)

export function useEthereumInit(): UseEthereumResult {
  const [account, setAccount] = useState<string | undefined>(undefined)

  if (window.ethereum === undefined) {
    return {fallback: <>Metamask is not installed</>}
  }

  if (!account) {
    return {
      fallback: <MetamaskRequest onAccount={(x: string) => setAccount(x)}/>
    }
  }

  window.web3 = new Web3(window.ethereum)
  window.ethereum.enable()

  const ethereum = new Ethereum(account)
  return {
    provideEthereum: (x) =>
      <EthereumContext.Provider value={ethereum}>{x}</EthereumContext.Provider>,
    ethereum,
    fallback: undefined
  }
}

export function useEthereum(): Ethereum {
  return useContext(EthereumContext) as Ethereum
}

function MetamaskRequest({onAccount}: { onAccount: (x: string) => void }) {
  function connectMetamask() {
    window.ethereum.request({method: 'eth_requestAccounts'}).then((x: string[]) => onAccount(x[0]))
  }

  return <button onClick={connectMetamask}>Connect MetaMask account</button>
}
