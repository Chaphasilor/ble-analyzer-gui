import store from '@/store/index'

export default class API {

  /**
   * ### Creates a new instance of the API without connecting to the backend yet
   * @param {String} url the websocket url to connect to. protocol has to be `ws://` or `wss://`
   */
  constructor(url) {

    this.url = url
    this.activeCommands = []

  }

  /**
   * ### Parses the payload of a websocket message
   * @param {Object} message the message received through the websocket
   * @returns {Object} the parsed payload
   */
  parseMessage(message) {

    // console.debug(`message:`, message);
    
    try {
      return JSON.parse(message.data)
    } catch (err) {
      throw new Error(`Couldn't parse message:`, err)
    }

  }

  /**
   * **Getter** is API connection established and ready?
   */
  get connected() {
    return this.socket != undefined && this.socket.readyState === WebSocket.OPEN
  }

  /**
   * ### Connects to the backend API
   * @resolves undefined
   * @rejects {Error} the reason why the connection couldn't be established
   */
  connectToServer() {
    return new Promise((resolve, reject) => {

      if (this.connected) {
        return resolve()
      }

      console.info(`Connecting to websocket at '${this.url}'`)
      this.socket = new WebSocket(this.url)
  
      this.socket.onopen = () => {
        

        if (this.socket.readyState === WebSocket.OPEN) {

          console.info(`Socket opened!`)
          
          // upon connection, the server will send its assigned socket ID over the socket
          // wait for it, save it and then resolve
          this.socket.onmessage = (message) => {
            this.connectionId = JSON.parse(message.data)
            return resolve()
          }

        } else {
          return reject(new Error(`Socket opened but isn't ready`))
        }

        // overwrite the previous onclose-handler after the socket is connected
        this.socket.onclose = (event) => {
          alert(`Lost connection to server! (Code: '${event.code}', Reason: '${event.reason}')`)
        }
        
      }

      // if the socket didn't open but threw an error
      this.socket.onerror = (error) => {
        return reject(error)
      }

      // if the socket closed without opening first. unlikely to happen
      this.socket.onclose = () => {
        return reject(new Error(`Can't connect to server!`))
      }

    })
  }

  /**
   * ### Sends data to the backend API
   * Mostly for debug, not actually used currently
   * @param {Object} data the payload to send over the socket
   * @param {Function} responseHandler a callback that receives any responses from the server, until this method is called again
   */
  async send(data, responseHandler) {
    
    // console.debug(`this.connected:`, this.connected);
    
    // make sure we are connected to the backend API before sending any data
    if (!this.connected) {

      try {
        await this.connectToServer()
      } catch (err) {
        throw new Error(`Fatal: Failed to open websocket:`, err)
      }
      
    }
    
    // stringify the data and send it over the socket
    this.socket.send(JSON.stringify(data))

    // register the callback as a message handler (parse the received message before calling the callback)
    this.socket.onmessage = (message) => {
      responseHandler(this.parseMessage(message))
    }

  }

  /**
   * ### Sends a command to the API and allows to handle responses to the command
   * @param {String} command the commmand to send to the server
   * @param {Object} payload the payload to send alongside the command
   * @param {Function} responseHandler a callback for handling responses *to this command only*
   */
  async sendCommand(command, payload, responseHandler) {
    
    // make sure we are connected to the backend API
    if (!this.connected) {

      try {
        await this.connectToServer()
      } catch (err) {
        throw new Error(`Fatal: Failed to open websocket:`, err)
      }
      
    }
    
    // format the command and payload, then send it
    this.socket.send(JSON.stringify({
      type: `command`,
      value: [
        command,
        ...payload
      ]
    }))

    // remember the command by adding it and its responseHandler to `this.activeCommands` for later reference
    this.activeCommands.push({
      name: command,
      handler: responseHandler,
    })

    // handle responses by the server
    // this includes responses to *all* commands
    this.socket.onmessage = (message) => {

      let parsed = this.parseMessage(message)

      // find the command to which the server replied to 
      let command = this.activeCommands.find(x => x.name === parsed.value[0])
  
      // if the command isn't part of `this.activeCommands`, ignore it
      if (!command) {
        console.warn(`Command not found: ${parsed.value[0]}`)
        return
      }
  
      // detect the type of the reply and handle accordingly
      switch (parsed.type) {
        case `response`:
            // if the reply is a response, invoke the active command's response handler
            command.handler(parsed.value[1])    
          break;
        case `commandEnd`:
          // if the reply is a command end, remove the command from the active commands
          this.activeCommands = this.activeCommands.filter(x => x !== command)
          break;
      
        case `error`:
          // if the reply is an error, log it in the console
          // the command hasn't ended yet
          console.warn(`Command '${parsed.value[0]}' threw an error:`, parsed.value[1])
          break;
      
        default:
          break;
      }
    
      
    }

  }
  
  /**
   * ### Subscribe to live packets from the backend
   */
  async getLivePackets() {

    console.info(`Now listening for live packets`)

    await this.sendCommand(`packetsLive`,
      [],
      (response) => {
        // console.debug(`New live packets:`, response);
        store.dispatch(`addPackets`, response) // adds the new packets to the store
      }
    )
    
  }

  /**
   * ### Unsubscribe from live packets from the backend
   */
  async endLivePackets() {

    await this.sendCommand(`end`,
      [`packetsLive`],
      (response) => {
        console.info(`Unsubscribed successfully:`, response);
        // currently the backend doesn't send a `commandEnd` reply for the live command
        // this could be changed once the backend's GuiConnection class handles commands internally without relying on the consumer
        this.activeCommands = this.activeCommands.filter(x => x !== `packetsLive`)
      }
    )
    
  }

  /**
   * ### Subscribe to live connections from the backend
   */
  async getLiveConnections() {

    await this.sendCommand(`connectionsLive`,
      [],
      (response) => {
        // console.debug(`New live connections:`, response)
        store.dispatch(`setConnections`, response) // old connections will be overwritten, but the backend should always include *all* connections
      }
    )
    
  }

  /**
   * ### Unsubscribe from live connections from the backend
   */
  async endLiveConnections() {

    await this.sendCommand(`end`,
      [`connectionsLive`],
      (response) => {
        console.info(`Unsubscribed successfully:`, response);
        // currently the backend doesn't send a `commandEnd` reply for the live command
        // this could be changed once the backend's GuiConnection class handles commands internally without relying on the consumer
        this.activeCommands = this.activeCommands.filter(x => x !== `connection`)
      }
    )
    
  }

  /**
   * ### Subscribe to live advertisers from the backend
   */
  async getLiveAdvertisers() {

    await this.sendCommand(`advertisersLive`,
      [],
      (response) => {
        // console.debug(`New live Advertisers:`, response);
        store.dispatch(`setAdvertisers`, response) // old advertisers will be overwritten, but the backend should always include *all* advertisers
      }
    )
    
  }

  /**
   * ### Unsubscribe from live advertisers from the backend
   */
  async endLiveAdvertisers() {

    await this.sendCommand(`end`,
      [`advertisersLive`],
      (response) => {
        console.info(`Unsubscribed successfully:`, response);
        // currently the backend doesn't send a `commandEnd` reply for the live command
        // this could be changed once the backend's GuiConnection class handles commands internally without relying on the consumer
        this.activeCommands = this.activeCommands.filter(x => x !== `advertiser`)
      }
    )
    
  }

  /**
   * ### Subscribe to live issues from the backend
   */
  async getLiveIssues() {

    await this.sendCommand(`issuesLive`,
      [],
      (response) => {
        // console.log(`New live Issues:`, response);
        store.dispatch(`setIssues`, response) // old issues will be overwritten, but the backend should always include *all* issues (might have to be changed if there are too many issues)
      }
    )
    
  }

  /**
   * ### Unsubscribe from live issues from the backend
   */
  async endLiveIssues() {

    await this.sendCommand(`end`,
      [`issuesLive`],
      (response) => {
        console.info(`Unsubscribed successfully:`, response);
        // currently the backend doesn't send a `commandEnd` reply for the live command
        // this could be changed once the backend's GuiConnection class handles commands internally without relying on the consumer
        this.activeCommands = this.activeCommands.filter(x => x !== `issuesLive`)
      }
    )
    
  }
  
  /**
   * ### Loads all sniffed packets from the backend and adds them to the store
   * @returns {Promise}
   */
  loadAllPackets() {
    return new Promise((resolve) => {
    
      this.sendCommand(`sendAll`,
        [],
        (response) => {
          store.dispatch(`setPackets`, response) // overwrites old packets and replaces them with the new packets
          return resolve()
        }
      )
    
    })
  }
  
  /**
   * ### Loads all sniffed connections from the backend and adds them to the store
   * @returns {Promise}
   */
  loadAllConnections() {
    return new Promise((resolve) => {
    
      this.sendCommand(`connections`,
        [],
        (response) => {
          store.dispatch(`setConnections`, response) // overwrites old connections and replaces them with the new connections
          return resolve()
        }
      )
    
    })
  }
  
  /**
   * ### Loads all sniffed advertisers from the backend and adds them to the store
   * @returns {Promise}
   */
  loadAllAdvertisers() {
    return new Promise((resolve) => {
    
      this.sendCommand(`advertisers`,
        [],
        (response) => {
          store.dispatch(`setAdvertisers`, response) // overwrites old advertisers and replaces them with the new advertisers
          return resolve()
        }
      )
    
    })
  }
  
  /**
   * ### Loads all sniffed issues from the backend and adds them to the store
   * @returns {Promise}
   */
  loadAllIssues() {
    return new Promise((resolve) => {
    
      this.sendCommand(`issues`,
        [],
        (response) => {
          store.dispatch(`setIssues`, response) // overwrites old issues and replaces them with the new issues
          return resolve()
        }
      )
    
    })
  }

  /**
   * ### Loads a single packet in `full` format
   * @param {Number} packetId the id of the packet to load
   * @returns {Promise<Object>} the requested packet in `full` format
   */
  loadPacket(packetId) {
    return new Promise((resolve) => {
    
      console.debug(`packetId:`, packetId);

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