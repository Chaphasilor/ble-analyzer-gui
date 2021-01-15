import store from '@/store/index'

export default class API {

  constructor(url) {

    this.url = url
    this.activeCommands = []

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
      throw new Error(`Couldn't parse message:`, err)
    }

  }

  get connected() {
    return this.socket != undefined && this.socket.readyState === WebSocket.OPEN
  }

  connectToServer() {
    return new Promise((resolve, reject) => {

      this.socket = new WebSocket(this.url)
  
      this.socket.onopen = () => {
        if (this.socket.readyState === WebSocket.OPEN) {

          console.log(`Socket opened!`)
          return resolve()

        } 
      }

      this.socket.onerror = (error) => {
        return reject(error)
      }
    
    })
  }

  async send(data, responseHandler) {
    
    console.log(`this.connected:`, this.connected);
    
    if (!this.connected) {

      try {
        await this.connectToServer()
      } catch (err) {
        throw new Error(`Fatal: Failed to open websocket:`, err)
      }
      
    }
    
    this.socket.send(JSON.stringify(data))

    this.socket.onmessage = (message) => {
      responseHandler(this.parseMessage(message))
    }

  }

  async sendCommand(command, payload, responseHandler) {
    
    if (!this.connected) {

      try {
        await this.connectToServer()
      } catch (err) {
        throw new Error(`Fatal: Failed to open websocket:`, err)
      }
      
    }
    
    this.socket.send(JSON.stringify({
      type: `command`,
      value: [
        command,
        ...payload
      ]
    }))
    this.activeCommands.push({
      name: command,
      handler: responseHandler,
    })

    this.socket.onmessage = (message) => {

      let parsed = this.parseMessage(message)

      console.log(`parsed:`, parsed);
  
      let command = this.activeCommands.find(x => x.name === parsed.value[0])
  
      if (!command) {
        throw new Error(`Command not found: ${command}`)
      }
  
      switch (parsed.type) {
        case `response`:
            command.handler(parsed.value[1])    
          break;
        case `commandEnd`:
          this.activeCommands = this.activeCommands.filter(x => x !== command)
          break;
      
        case `error`:
          console.error(`Command ${parsed.value[0]} threw an error:`, parsed.value[1])
          break;
      
        default:
          break;
      }
    
      
    }

  }
  
  getLivePackets() {

    this.sendCommand(`live`,
      [],
      (response) => {
        console.log(`response:`, response);
        store.dispatch(`addPackets`, response)
      }
    )
    
  }
  
  loadAllPackets() {
    return new Promise((resolve) => {
    
      this.sendCommand(`sendAll`,
        [],
        (response) => {
          store.dispatch(`addPackets`, response)
          return resolve()
        }
      )
    
    })
  }

  loadPacket(packetId) {
    return new Promise((resolve) => {
    
      console.log(`packetId:`, packetId);

      this.sendCommand(`send`,
        [
          packetId,
          `full`,
        ],
        (response) => {
          console.log(`response:`, response);
          return resolve(response)
        }
      )
    
    })
  }

  loadAllConnections() {
    return new Promise((resolve) => {
    
      this.sendCommand(`connections`,
        [],
        (response) => {
          store.dispatch(`setConnections`, response)
          return resolve()
        }
      )
    
    })
  }

}