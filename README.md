# WalletConnect

Library to connect Dapps to mobile wallets using WalletConnect

You can read more about WalletConnect protocol here: http://walletconnect.org/

### Install package

```bash
yarn add walletconnect

# OR

npm install --save walletconnect
```

### Getting Started

```js
import WalletConnect from 'walletconnect'

/**
 *  Create a webConnector
 */
const webConnector = new WalletConnect(
  {
    bridgeURL: 'https://bridge.walletconnect.org',  // Required
    dappName: 'INSERT_DAPP_NAME',                   // Required
    canvasElement: 'INSERT_QRCODE_CANVAS_ELEMENT',  // Optional
    sessionId: 'INSERT_EXISTING_SESSION_ID',        // Optional
    sharedKey: 'INSERT_EXISTING_SHARED_KEY',        // Optional

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
 *  Create transaction
 */
const transactionId = await webConnector.createTransaction(tx)

/**
 *  Listen to transaction status
 */
webConnector.listenTransactionStatus(transactionId, (err, result) => {
  console.log(result) // check result
})
```
