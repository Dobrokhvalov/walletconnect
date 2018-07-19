import 'idempotent-babel-polyfill'

import { Connector, Listener, generateKey } from 'js-walletconnect-core'
import QRCode from 'qrcode'

export default class WalletConnect extends Connector {
  constructor(options) {
    super(options)
    this.canvasElement =
      typeof options.canvasElement !== 'undefined'
        ? options.canvasElement
        : document.getElementById('walletconnect-qrcode-canvas')
  }
  //
  // Create session
  //
  async createSession() {
    if (this.sessionId) {
      throw new Error('session already created')
    }

    // create shared key
    if (!this.sharedKey) {
      this.sharedKey = await generateKey()
    }

    // store session info on bridge
    const res = await fetch(`${this.bridgeUrl}/session/new`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    if (res.status >= 400) {
      throw new Error(res.statusText)
    }

    // get json
    const body = await res.json()
    // session id
    this.sessionId = body.sessionId

    const sessionData = {
      sessionId: this.sessionId,
      sharedKey: this.sharedKey
    }

    await QRCode.toDataURL(this.canvasElement, sessionData, {
      errorCorrectionLevel: 'H'
    })
      .then(url => {
        this.qrcode = url
      })
      .catch(err => {
        console.log(err)
      })

    // sessionId and shared key
    return {
      sessionId: this.sessionId,
      sharedKey: this.sharedKey,
      qrcode: this.qrcode
    }
  }

  //
  // create transaction
  //
  async createTransaction(data = {}) {
    if (!this.sessionId) {
      throw new Error(
        'Create session using `createSession` before sending transaction'
      )
    }

    // encrypt data
    const encryptedData = await this.encrypt(data)

    // store transaction info on bridge
    const res = await fetch(
      `${this.bridgeUrl}/session/${this.sessionId}/transaction/new`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: encryptedData,
          dappName: this.dappName
        })
      }
    )
    if (res.status >= 400) {
      throw new Error(res.statusText)
    }

    // res
    const body = await res.json()

    // return transactionId
    return {
      transactionId: body.transactionId
    }
  }

  //
  // get session status
  //
  getSessionStatus() {
    if (!this.sessionId) {
      throw new Error('sessionId is required')
    }
    return this._getEncryptedData(`/session/${this.sessionId}`, withTtl = true)
  }

  //
  // get transaction status
  //
  getTransactionStatus(transactionId) {
    if (!this.sessionId || !transactionId) {
      throw new Error('sessionId and transactionId are required')
    }

    return this._getEncryptedData(
      `/transaction-status/${transactionId}`
    )
  }

  //
  // Listen for session status
  //
  listenSessionStatus(cb, pollInterval = 1000, timeout = 60000) {
    return new Listener(this, {
      fn: () => {
        return this.getSessionStatus()
      },
      cb,
      pollInterval,
      timeout
    })
  }

  //
  // Listen for session status
  //
  listenTransactionStatus(
    transactionId,
    cb,
    pollInterval = 1000,
    timeout = 60000
  ) {
    return new Listener(this, {
      fn: () => {
        return this.getTransactionStatus(transactionId)
      },
      cb,
      pollInterval,
      timeout
    })
  }
}
