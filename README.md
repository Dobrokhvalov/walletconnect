# WalletConnect

Library to connect Dapps to mobile wallets using WalletConnect

You can read more about WalletConnect protocol here: http://walletconnect.org/

## install

```bash
npm install --save walletconnect # yarn add walletconnect
```

## Example

```js
import WalletConnect from 'walletconnect'

// create a webconnector
const wc = new WalletConnect(
  'https://walletconnect.matic.network',
)

// create new session
const session = await wc.createSession()
console.log(session.sessionId) // prints session id
console.log(session.sharedKey.toString('hex')) // prints shared private key

// fetch session status
// const sessionStatus = await wc.getSessionStatus()

// listen status
wc.listenSessionStatus((err, result) => {
  // check result
})

// draft tx
const tx = {from: '0xab12...1cd', to: '0x0', nonce: 1, gas: 100000, value: 0, data: '0x0'}

// create transaction
const transactionId = await wc.createTransaction(tx)

// fetch tx status
// const txStatus = await wc.getTransactionStatus()

// listen status
wc.listenTransactionStatus(transactionId, (err, result) => {
  // check result
})
```
