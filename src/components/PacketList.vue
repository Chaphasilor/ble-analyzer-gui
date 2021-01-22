<template>
  <div
    class="flex flex-col"
  >

    <div
      class="grid grid-flow-row grid-rows-1 gap-2 text-center border-b-2 border-gray-700 grid-cols-packet-list"
    >

      <span>ID</span>
      <span>Arrival Time</span>
      <span>Access/Source Address</span>
      <span>Destination Address</span>
      <span>Protocols</span>
      <span>Length</span>
      
    </div>

    <VirtualList
      ref="packet-list"
      class="h-full overflow-y-auto"
      :data-key="'packetId'"
      :data-sources="filteredPackets"
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
    },
    filteredPackets: function() {

      let filter = this.$store.getters.packetFilter
      
      if (filter.length === 0) {
        return this.packets
      }

      console.log(`filter:`, filter)

      return this.packets.filter(packet => {
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
      
    },
  },
  watch: {
    filteredPackets() {
      // scroll list (to top) to force re-rendering 
      this.$refs[`packet-list`].scrollToIndex(0)
    }
  },
  mounted() {

    console.log(`this.packets:`, this.packets);

    // prevent text selection on double click without preventing text selection by dragging
    document.addEventListener('mousedown', function (event) {
      if (event.detail > 1) {
        event.preventDefault();
      }
    }, false);
    
  }
}
</script>
