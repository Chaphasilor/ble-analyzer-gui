import store from '@/store/index'

export default class API {

  constructor(url) {

    this.url = url

  }

  formatBytes(bytes, decimals = 2) {

    if (bytes === 0) return `0 B`;
  
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = [`B`, `KB`, `MB`, `GB`, `TB`, `PB`, `EB`, `ZB`, `YB`];
  
    const i = Math.floor(Math.log(bytes) / Math.log(k));
  
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ` ` + sizes[i];

  }
  
  dotify(number) {

    let reversedNumberAsString = String(number).split(``).reverse().join(``);
    let dotifiedNumber = ``;
    for (let i = 0; i < reversedNumberAsString.length; i++) {
      dotifiedNumber = `${reversedNumberAsString.charAt(i)}${(i%3===0 && i!=0) ? `.` : ``}${dotifiedNumber}`;
    }
    return dotifiedNumber;
    
  }

  parseMessage(message) {

    // console.log(`message:`, message);
    
    try {
      return JSON.parse(message.data)
    } catch (err) {
      return false
    }

  }

  //TODO
  // - rename send to sendCommand, pass command and value as params
  // - have sendCommand unlink the responseHandler, when a `commandEnd` message arrives from the server
  // - remember all running commands in an array. only the last/newest command's handler is called to handle messages. once the responseHandler gets unlinked, pop the command and "return" to the previous handler
  // - server should not send anything other than the requested data after a command is issued and before it is has ended => pause all other data (like live data)

  send(data, responseHandler) {

    this.socket.send(JSON.stringify(data))

    //TODO allow to unlink handler
    this.socket.onmessage = (message) => {
      responseHandler(this.parseMessage(message))
    }

  }
  
  connectToServer() {
    return new Promise((resolve, reject) => {
    
      this.socket = new WebSocket(this.url)
  
      this.socket.onopen = () => {
        console.log(`Socket opened!`)
        return resolve()
      }

      this.socket.onerror = (error) => {
        return reject(error)
      }
    
    })
  }

  getLivePackets() {

    this.send({
      type: `command`,
      value: [
        `live`
      ]
    }, (response) => {
      store.dispatch(`addPackets`, response)
    })
    
  }

  loadPacket(packetId) {
    return new Promise((resolve) => {
    
      console.log(`packetId:`, packetId);

      this.send({
        type: `command`,
        value: [
          `send`,
          packetId,
        ]
      }, (response) => {
        return resolve(response)
      })
    
    })
  }

}