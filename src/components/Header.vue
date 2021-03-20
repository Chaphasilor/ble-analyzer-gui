<template>
  <div
    class="flex flex-row justify-between w-full h-full text-left bg-gray-300"
  >
    <h1
      class="text-2xl font-bold text-lightblue-600"
    >BLE Analyzer</h1>

    <div
      class="flex flex-row-reverse"
    >

      <!-- Buttons to control the GUI -->

      <button
        class="p-2 text-white bg-lightblue-600"
        type="button"
        @click="$store.dispatch(`receiveLive`)"
      >
        Receive Live Packets
      </button>

      <button
        class="p-2 mr-1 text-white bg-lightblue-600"
        type="button"
        @click="$store.dispatch(`loadEverything`)"
      >
        Load Packets
      </button>

      <!-- <button
        class="p-2 mr-1 text-white bg-lightblue-600"
        type="button"
        @click="$store.dispatch(`loadAllPackets`)"
      >
        Load All Packets
      </button>

      <button
        class="p-2 mr-1 text-white bg-lightblue-600"
        type="button"
        @click="$store.dispatch(`loadAllConnections`)"
      >
        Load Connections
      </button>

      <button
        class="p-2 mr-1 text-white bg-lightblue-600"
        type="button"
        @click="$store.dispatch(`loadAllAdvertisers`)"
      >
        Load Advertisers
      </button>

      <button
        class="p-2 mr-1 text-white bg-lightblue-600"
        type="button"
        @click="$store.dispatch(`loadAllIssues`)"
      >
        Load Issues
      </button> -->

      <button
        v-if="$store.getters.packets.length > 0"
        class="p-2 mr-1 text-white bg-orange-400"
        type="button"
        @click="$store.dispatch(`clearEverything`)"
      >
        Clear Packets
      </button>

      <!-- <button
        v-if="$store.getters.packets.length > 0"
        class="p-2 mr-1 text-white bg-orange-400"
        type="button"
        @click="$store.dispatch(`clearPackets`)"
      >
        Clear Packets
      </button>

      <button
        v-if="$store.getters.connections.length > 0"
        class="p-2 mr-1 text-white bg-orange-400"
        type="button"
        @click="$store.dispatch(`clearConnections`)"
      >
        Clear Connections
      </button>

      <button
        v-if="$store.getters.advertisers.length > 0"
        class="p-2 mr-1 text-white bg-orange-400"
        type="button"
        @click="$store.dispatch(`clearAdvertisers`)"
      >
        Clear Advertisers
      </button>

      <button
        v-if="$store.getters.issues.length > 0"
        class="p-2 mr-1 text-white bg-orange-400"
        type="button"
        @click="$store.dispatch(`clearIssues`)"
      >
        Clear Issues
      </button> -->

      <button
        v-if="$store.getters.packetFilter.length > 0"
        class="p-2 mr-1 text-white bg-orange-400"
        type="button"
        @click="$store.dispatch(`clearPacketFilter`)"
      >
        Clear Filter
      </button>

      <button
        v-if="$store.getters.liveActive"
        class="p-2 mr-1 text-white bg-orange-400"
        type="button"
        @click="$store.dispatch(`stopLive`)"
      >
        Stop Receiving Packets
      </button>
      
    </div>
    
  </div>
</template>

<script>
export default {
  name: `Header`,
}
</script>
