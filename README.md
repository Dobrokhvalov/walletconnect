# WalletConnect

Library to connect Dapps to mobile wallets using WalletConnect

You can read more about WalletConnect protocol here: http://walletconnect.org/

### Install package

```bash
npm install --save walletconnect # yarn add walletconnect
```

### Getting Started

```js
import WalletConnect from 'walletconnect'

/**
 *  Create a webConnector
 */
const webConnector = new WalletConnect(
  'https://walletconnect.matic.network',
  {
    dappName: 'INSERT_DAPP_NAME'
  }
)

/**
 *  Create a new session
 */
const session = await webConnector.createSession()

console.log(session.sessionId) // prints session id
console.log(session.sharedKey.toString('hex')) // prints shared private key

/**
 *  Listen to session status
 */
webConnector.listenSessionStatus((err, result) => {
  console.log(result) // check result
})

/**
 *  Draft transaction
 */
const tx = {from: '0xab12...1cd', to: '0x0', nonce: 1, gas: 100000, value: 0, data: '0x0'}

/**
 *  Create transaciton
 */
const transactionId = await webConnector.createTransaction(tx)

/**
 *  Listen to transaction status
 */
webConnector.listenTransactionStatus(transactionId, (err, result) => {
  console.log(result) // check result
})
```
