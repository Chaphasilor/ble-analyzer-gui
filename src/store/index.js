import Vue from 'vue'
import Vuex from 'vuex'
import API from '@/assets/js/api'

Vue.use(Vuex)

// set up the API outside the store so that it's easier to work with
const websocketUrl = `ws://127.0.0.1:70`
let api = new API(websocketUrl)

export default new Vuex.Store({
  modules: {
  },
  // set up the store's contents with default values
  state: {
    packets: [],
    connections: [],
    advertisers: [],
    issues: [],
    packetFilter: [],
    selectedPacket: NaN,
    scrollToIndex: NaN,
    liveActive: false,
  },
  // define mutations (methods that *directly* modify the store and have to be synchronous)
  mutations: {
    SET_PACKETS(store, packets) {
      store.packets = packets
    },
    ADD_PACKETS(store, packetsToAdd) {
      store.packets.push(...packetsToAdd)
    },
    SET_CONNECTIONS(store, connections) {
      store.connections = connections
    },
    SET_ADVERTISERS(store, advertisers) {
      store.advertisers = advertisers
    },
    SET_ISSUES(store, issues) {
      store.issues = issues
    },
    SET_PACKET_FILTER(store, filter) {
      store.packetFilter = filter
    },
    SET_SELECTED_PACKET(store, packetId) {
      store.selectedPacket = packetId
    },
    SET_SCROLL_TO_INDEX(store, index) {
      store.scrollToIndex = index
    },
    SET_LIVE_ACTIVE(store, state) {
      store.liveActive = state
    },
  },
  // define actions (methods that can be async and either call mutations or API methods or both)
  actions: {
    addPackets(context, newPackets) {
      context.commit(`ADD_PACKETS`, newPackets)
    },
    setPackets(context, newPackets) {
      context.commit(`SET_PACKETS`, newPackets)
    },
    setConnections(context, newConnections) {
      context.commit(`SET_CONNECTIONS`, newConnections)
    },
    setAdvertisers(context, newAdvertisers) {
      context.commit(`SET_ADVERTISERS`, newAdvertisers)
    },
    setIssues(context, newIssues) {
      context.commit(`SET_ISSUES`, newIssues)
    },
    setPacketFilter(context, filter = []) {
      context.commit(`SET_PACKET_FILTER`, filter)
    },
    selectPacket(context, packetId) {
      context.commit(`SET_SELECTED_PACKET`, packetId)
      console.log(`packetId:`, packetId)
    },
    /**
     * ### Scrolls the packet list to a specific packet id
     * @param {Number} id the packet id to scroll to 
     */
    scrollToId(context, id) {
      // try to find the packet with the specified id in all available packets
      if (context.getters.packets.find(x => x.packetId === id)) {

        // try to find the packet with the specified id in the filtered packets
        let foundPacket = context.getters.filteredPackets.find(x => x.packetId === id)

        if (foundPacket) {

          let packetIndex = context.getters.filteredPackets.indexOf(foundPacket)
          context.commit(`SET_SCROLL_TO_INDEX`, packetIndex) // select the index, so that the scrolling happens in PacketList.vue
          setTimeout(() => context.dispatch(`clearScrollToIndex`), 500) // "blink"-effect 
          
        } else {
          alert(`Packet is hidden by a filter`)
        }

      } else {
        alert(`Packet not loaded yet! Try clicking on 'Load Packets' first!`)
      }
    },
    /**
     * ### Connects to the backend through the API
     */
    connectToServer() {

      api.connectToServer()
      .then(() => {
        console.info(`Connected to backend!`)
      })
      .catch(err => {
        console.error(`Error while connecting to the socket:`, err);
      })
      
    },
    /**
     * ### Subscribes to *all* live commands
     * Also connects to the backend if not already connected
     */
    async receiveLive(context) {

      // only do this if not already subscribed
      if (!context.getters.liveActive) {
        
        context.commit(`SET_LIVE_ACTIVE`, true)

        // connect to backend (resolves immediately if already connected)
        try {
          await api.connectToServer()
        } catch (err) {
          context.commit(`SET_LIVE_ACTIVE`, false)
          return
        }
        
        try {
          // subscribe to all commands
          await Promise.all([
            api.getLivePackets(),
            api.getLiveConnections(),
            api.getLiveAdvertisers(),
            api.getLiveIssues(),
          ])
  
        } catch (err) {
          console.error(`Failed to subscribe to some live commands:`, err)
          context.dispatch(`stopLive`)
          alert(`Couldn't start some live commands! Please try again.`)
        }

      } else {
        console.warn(`Already subscribed!`)
        // disabled because alerts stop script execution:
        // alert(`Already subscribed!`)
      }

    },
    /**
     * ### Unsubscribes from *all* live commands
     */
    async stopLive(context) {

      // only unsubscribe if actually connected and subscribed
      if (api.connected && context.getters.liveActive) {

        try {
          await Promise.all([
            api.endLivePackets(),
            api.endLiveConnections(),
            api.endLiveAdvertisers(),
            api.endLiveIssues(),
          ])
    
          context.commit(`SET_LIVE_ACTIVE`, false)
        } catch (err) {
          console.error(`Failed to unsubscribe to from live commands:`, err)
          alert(`Couldn't stop some live commands! Please reload the page.`)
        }

      }

    },
    /**
     * ### Loads all info from the backend without subscribing
     */
    async loadEverything() {
      try {

        await api.loadAllPackets()
        await api.loadAllConnections()
        await api.loadAllAdvertisers()
        await api.loadAllIssues()

        console.info(`Loaded everything!`)

      } catch (err) {
        console.error(`Error loading everything:`, err)
      }
    },
    loadAllPackets(context) {

      api.loadAllPackets()
      .then(() => {
        console.log(`Loaded all packets!`)
        console.log(`context.getters.packets:`, context.getters.packets)
      })
      .catch(err => {
        console.error(`Error while loading all packets:`, err);
      })

    },
    loadAllConnections() {

      api.loadAllConnections()
      .then(() => {
        console.log(`Loaded all connections!`)
      })
      .catch(err => {
        console.error(`Error while loading all connections:`, err);
      })

    },
    loadAllAdvertisers() {

      api.loadAllAdvertisers()
      .then(() => {
        console.log(`Loaded all advertisers!`)
      })
      .catch(err => {
        console.error(`Error while loading all advertisers:`, err);
      })

    },
    loadAllIssues() {

      api.loadAllIssues()
      .then(() => {
        console.log(`Loaded all issues!`)
      })
      .catch(err => {
        console.error(`Error while loading all issues:`, err);
      })

    },
    /**
     * ### Removes all packets, etc. from the store, without unsubscribing from anything
     */
    clearEverything(context) {

      context.dispatch(`clearPackets`)
      context.dispatch(`clearConnections`)
      context.dispatch(`clearAdvertisers`)
      context.dispatch(`clearIssues`)
      context.dispatch(`clearPacketFilter`)
      context.dispatch(`clearSelectedPacket`)
      
    },
    clearPackets(context) {
      context.commit(`SET_PACKETS`, [])
    },
    clearConnections(context) {
      context.commit(`SET_CONNECTIONS`, [])
    },
    clearAdvertisers(context) {
      context.commit(`SET_ADVERTISERS`, [])
    },
    clearIssues(context) {
      context.commit(`SET_ISSUES`, [])
    },
    clearPacketFilter(context) {
      context.commit(`SET_PACKET_FILTER`, [])
    },
    clearSelectedPacket(context) {
      context.commit(`SET_SELECTED_PACKET`, NaN)
    },
    clearScrollToIndex(context) {
      context.commit(`SET_SCROLL_TO_INDEX`, NaN)
    },
    /**
     * ### Loads a packet in `full` format through the API
     * Used to show packet details
     * @param {Number} packetId the id of the packet to load
     * @returns {Object} the loaded packet
     */
    async loadPacket(context, packetId) {

      let packet = await api.loadPacket(packetId) // might throw an error

      return packet
      
    },
  },
  // defined getters for accessing the data inside the store inside the components
  getters: {
    packets: (store) => store.packets,
    // use the packet filter to filter all available packets for matching criteria
    filteredPackets: (store) => {
      let filter = store.packetFilter
      let filteredPackets = []

      if (filter.length === 0) {
        filteredPackets = store.packets
      }

      filteredPackets = store.packets.filter(packet => {
        return filter.every(([key, value]) => {

          let base = packet
          for (const subkey of key) {
            if (base) {
              base = base[subkey]
            } else {
              return false
            }
          }

          return base == value
          
        })
      })

      return filteredPackets.sort((a, b) => a.packetId > b.packetId ? 1 : -1) // sort by packetId (ascending)
    },
    connections: (store) => store.connections,
    advertisers: (store) => store.advertisers,
    issues: (store) => store.issues,
    packetFilter: (store) => store.packetFilter,
    selectedPacket: (store) => store.selectedPacket,
    scrollToIndex: (store) => store.scrollToIndex,
    liveActive: (store) => store.liveActive,
  }
})
