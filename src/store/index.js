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
    advertisers: [],
    issues: [],
    packetFilter: [],
    selectedPacket: NaN,
    scrollToIndex: NaN,
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
},
  actions: {
    addPackets(context, newPackets) {
      context.commit(`ADD_PACKETS`, newPackets)
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
    scrollToIndex(context, index) {
      context.commit(`SET_SCROLL_TO_INDEX`, index)
      console.log(`index:`, index)
      setTimeout(() => context.commit(`SET_SCROLL_TO_INDEX`, NaN), 500)
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
    async receiveLive() {

      // await api.getLivePackets()
      await api.getLiveConnections()
      await api.getLiveAdvertisers()
      await api.getLiveIssues()

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
    async loadPacket(context, packetId) {

      let packet = await api.loadPacket(packetId) // might throw an error

      return packet
      
    },
  },
  getters: {
    packets: (store) => store.packets,
    connections: (store) => store.connections,
    advertisers: (store) => store.advertisers,
    issues: (store) => store.issues,
    packetFilter: (store) => store.packetFilter,
    selectedPacket: (store) => store.selectedPacket,
    scrollToIndex: (store) => store.scrollToIndex,
  }
})
