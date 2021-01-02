<template>
  <div
    class="flex flex-col"
  >

    <div
      class="grid grid-flow-row grid-cols-6 grid-rows-1 gap-2 text-center border-b border-gray-700"
    >

      <span>Packet ID</span>
      <span>Microseconds</span>
      <span>Source</span>
      <span>Destination</span>
      <span>Protocols</span>
      <span>Packet Length</span>
      
    </div>

    <VirtualList
      class="h-full overflow-y-auto"
      :data-key="'packetId'"
      :data-sources="packets"
      :data-component="PacketSummaryComponent"
      header-tag="div"
      header-class="grid grid-flow-row grid-cols-6 grid-rows-1 gap-2 text-center border-b border-gray-700"
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
