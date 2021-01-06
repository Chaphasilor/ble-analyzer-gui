<template>
  <div
    class="grid h-screen grid-rows-layout"
  >
    
    <div
      class="flex flex-row justify-between w-full h-10 text-left bg-gray-300"
    >
      <h1
        class="text-2xl font-bold text-lightblue-600"
      >BLE Analyzer</h1>

      <div>

        <button
          class="p-2 mr-1 text-white bg-lightblue-600"
          type="button"
          @click="$store.dispatch(`clearPackets`)"
        >
          Clear Packets
        </button>
        <button
          class="p-2 mr-1 text-white bg-lightblue-600"
          type="button"
          @click="$store.dispatch(`loadAllPackets`)"
        >
          Load All Packets
        </button>
        <button
          class="p-2 text-white bg-lightblue-600"
          type="button"
          @click="$store.dispatch(`receiveLivePackets`)"
        >
          Receive Packets
        </button>
        
      </div>
      
    </div>
    
    <PacketList
      class=""
    />

    <div
      class="border-t-4 border-gray-700"
    >
      Details (about sniffing or <span class="italic">maybe</span> even packets)
    </div>
    
  </div>
</template>

<script>

import PacketList from '@/components/PacketList'

export default {
  name: 'Home',
  components: {
    PacketList,
  }
}
</script>
