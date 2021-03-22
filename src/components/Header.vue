<template>
  <div
    class="flex flex-row justify-between w-full h-full text-left bg-gray-300"
  >

    <div class="flex flex-row p-1">
      
      <h1
        class="text-2xl font-bold text-lightblue-600"
      >BLE Analyzer</h1>

      <div
        class="p-1 ml-12 text-lg font-semibold"
      >
        <span
          v-if="$store.getters.connectedToBackend"
          class="text-green-700"
        >Connected</span>
        <span
          v-else
          class="text-red-500"
        >Disconnected</span>
      </div>

    </div>

    <div
      class="flex flex-row-reverse"
    >

      <!-- Settings (Backend URL setup) -->

      <button
        class="p-2 text-white bg-lightblue-600 hover:bg-lightblue-500"
        type="button"
        @click="$store.dispatch(`setBackendUrl`, ``)"
      >
        <!-- `settings` icon from https://github.com/tabler/tabler-icons -->
        <svg
          class="w-8 h-8 stroke-current stroke-1.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      <!-- Buttons to control the GUI -->

      <button
        class="p-2 mr-1 text-white bg-lightblue-600 hover:bg-lightblue-500"
        type="button"
        @click="$store.dispatch(`receiveLive`)"
      >
        Receive Live Packets
      </button>

      <button
        class="p-2 mr-1 text-white bg-lightblue-600 hover:bg-lightblue-500"
        type="button"
        @click="$store.dispatch(`loadEverything`)"
      >
        Load Packets
      </button>

      <!-- <button
        class="p-2 mr-1 text-white bg-lightblue-600 hover:bg-lightblue-500"
        type="button"
        @click="$store.dispatch(`loadAllPackets`)"
      >
        Load All Packets
      </button>

      <button
        class="p-2 mr-1 text-white bg-lightblue-600 hover:bg-lightblue-500"
        type="button"
        @click="$store.dispatch(`loadAllConnections`)"
      >
        Load Connections
      </button>

      <button
        class="p-2 mr-1 text-white bg-lightblue-600 hover:bg-lightblue-500"
        type="button"
        @click="$store.dispatch(`loadAllAdvertisers`)"
      >
        Load Advertisers
      </button>

      <button
        class="p-2 mr-1 text-white bg-lightblue-600 hover:bg-lightblue-500"
        type="button"
        @click="$store.dispatch(`loadAllIssues`)"
      >
        Load Issues
      </button> -->

      <button
        v-if="$store.getters.packets.length > 0"
        class="p-2 mr-1 text-white bg-orange-500 hover:bg-orange-400"
        type="button"
        @click="$store.dispatch(`clearEverything`)"
      >
        Clear Packets
      </button>

      <!-- <button
        v-if="$store.getters.packets.length > 0"
        class="p-2 mr-1 text-white bg-orange-500 hover:bg-orange-400"
        type="button"
        @click="$store.dispatch(`clearPackets`)"
      >
        Clear Packets
      </button>

      <button
        v-if="$store.getters.connections.length > 0"
        class="p-2 mr-1 text-white bg-orange-500 hover:bg-orange-400"
        type="button"
        @click="$store.dispatch(`clearConnections`)"
      >
        Clear Connections
      </button>

      <button
        v-if="$store.getters.advertisers.length > 0"
        class="p-2 mr-1 text-white bg-orange-500 hover:bg-orange-400"
        type="button"
        @click="$store.dispatch(`clearAdvertisers`)"
      >
        Clear Advertisers
      </button>

      <button
        v-if="$store.getters.issues.length > 0"
        class="p-2 mr-1 text-white bg-orange-500 hover:bg-orange-400"
        type="button"
        @click="$store.dispatch(`clearIssues`)"
      >
        Clear Issues
      </button> -->

      <button
        v-if="$store.getters.packetFilter.length > 0"
        class="p-2 mr-1 text-white bg-orange-500 hover:bg-orange-400"
        type="button"
        @click="$store.dispatch(`clearPacketFilter`)"
      >
        Clear Filter
      </button>

      <button
        v-if="$store.getters.liveActive"
        class="p-2 mr-1 text-white bg-orange-500 hover:bg-orange-400"
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
