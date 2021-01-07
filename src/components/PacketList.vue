<template>
  <div
    class="flex flex-col"
  >

    <div
      class="grid grid-flow-row grid-rows-1 gap-2 text-center border-b-2 border-gray-700 grid-cols-packet-list"
    >

      <span>ID</span>
      <span>Arrival Time</span>
      <span>Source Address</span>
      <span>Destination Address</span>
      <span>Protocols</span>
      <span>Length</span>
      
    </div>

    <VirtualList
      class="h-full overflow-y-auto"
      :data-key="'packetId'"
      :data-sources="packets"
      :data-component="PacketSummaryComponent"
      :keeps="50"
    />
    
  </div>
</template>

<script>

import PacketSummary from '@/components/PacketSummary'
import VirtualList from 'vue-virtual-scroll-list'

export default {
  name: `PacketList`,
  components: {
    VirtualList
  },
  data() {
    return {
      PacketSummaryComponent: PacketSummary,
    }
  },
  computed: {
    packets: function() {
      return this.$store.getters.packets
    }
  },
  mounted() {

    console.log(`this.packets:`, this.packets);
    
  }
}
</script>
