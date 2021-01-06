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
  },
  mutations: {
    SET_PACKETS(store, packets) {
      store.packets = packets
    },
    ADD_PACKETS(store, packetsToAdd) {
      store.packets.push(...packetsToAdd)
    },
},
  actions: {
    addPackets(context, newPackets) {

      console.log(`newPackets:`, newPackets);
      context.commit(`ADD_PACKETS`, newPackets)
      
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
    receiveLivePackets() {
      api.getLivePackets()
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
  },
  getters: {
    packets: (store) => store.packets,
  }
})
