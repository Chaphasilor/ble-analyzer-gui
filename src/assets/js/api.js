import store from '@/store/index'

export default class API {

  constructor(url) {

    this.url = url
    this.activeCommands = []

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

      console.info(`Connecting to websocket at ${this.url}`)
      this.socket = new WebSocket(this.url)
  
      this.socket.onopen = () => {
        if (this.socket.readyState === WebSocket.OPEN) {

          console.log(`Socket opened!`)
          
          this.socket.onmessage = (message) => {
            this.connectionId = JSON.parse(message.data)
            return resolve()
          }

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
          console.error(`Command '${parsed.value[0]}' threw an error:`, parsed.value[1])
          break;
      
        default:
          break;
      }
    
      
    }

  }
  
  async getLivePackets() {

    await this.sendCommand(`live`,
      [],
      (response) => {
        console.log(`response:`, response);
        store.dispatch(`addPackets`, response)
      }
    )
    
  }

  async getLiveConnections() {

    await this.sendCommand(`connectionsLive`,
      [],
      (response) => {
        console.log(`response:`, response);
        store.dispatch(`setConnections`, response)
      }
    )
    
  }

  async getLiveAdvertisers() {

    await this.sendCommand(`advertisersLive`,
      [],
      (response) => {
        console.log(`response:`, response);
        store.dispatch(`setAdvertisers`, response)
      }
    )
    
  }

  async getLiveIssues() {

    await this.sendCommand(`issuesLive`,
      [],
      (response) => {
        console.log(`response:`, response);
        store.dispatch(`setIssues`, response)
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
  
  loadAllAdvertisers() {
    return new Promise((resolve) => {
    
      this.sendCommand(`advertisers`,
        [],
        (response) => {
          store.dispatch(`setAdvertisers`, response)
          return resolve()
        }
      )
    
    })
  }
  
  loadAllIssues() {
    return new Promise((resolve) => {
    
      this.sendCommand(`issues`,
        [],
        (response) => {
          store.dispatch(`setIssues`, response)
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

}