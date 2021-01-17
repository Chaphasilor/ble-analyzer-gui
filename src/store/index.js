import Vue from 'vue'
import Vuex from 'vuex'
import API from '@/assets/js/api'

Vue.use(Vuex)

const websocketUrl = `ws://127.0.0.1`
let api = new API(websocketUrl)

export default new Vuex.Store({
  modules: {
  },
  state: {
    packets: [],
    connections: [],
  },
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
},
  actions: {
    addPackets(context, newPackets) {
      context.commit(`ADD_PACKETS`, newPackets)
    },
    setConnections(context, newConnections) {
      context.commit(`SET_CONNECTIONS`, newConnections)
    },
    connectToServer() {

      api.connectToServer()
      .then(() => {
        console.log(`Connected to socket!`)
      })
      .catch(err => {
        console.error(`Error while connecting to the socket:`, err);
      })
      
    },
    async receiveLivePackets() {

      await api.getLivePackets()
      await api.getLiveConnections()

    },
    loadAllPackets() {

      api.loadAllPackets()
      .then(() => {
        console.log(`Loaded all packets!`)
      })
      .catch(err => {

        console.error(`Error while loading all packets:`, err);

      })

    },
    clearPackets(context) {

      context.commit(`SET_PACKETS`, [])
      
    },
    async loadPacket(context, packetId) {

      let packet = await api.loadPacket(packetId) // might throw an error

      return packet
      
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
  },
  getters: {
    packets: (store) => store.packets,
    connections: (store) => store.connections,
  }
})
