<template>
  <div
    class="relative flex flex-col"
  >

    <div
      class="grid content-center grid-flow-row grid-rows-1 gap-1 pr-4 text-center border-b-2 border-gray-700 grid-cols-packet-list"
    >
      <span>ID</span>
      <span>Time of Arrival</span>
      <span>Channel</span>
      <span>RSSI</span>
      <span>Type</span>
      <span>Access Address</span>
      <span>Highest Proto</span>
      <span>Payload</span>
      <span>Length</span>
      <span>CRC</span>
    </div>
      
    <VirtualList
      ref="packet-list"
      class="h-full overflow-y-auto"
      :data-key="'packetId'"
      :data-sources="filteredPackets"
      :data-component="PacketSummaryComponent"
      :keeps="40"
      @scroll="scrollHandler"
      @tobottom="toBottomHandler"
    />

    <div
      class="absolute grid w-full h-full place-content-center"
      v-if="filteredPackets.length === 0"
    >
      <span
        class=""
      >No packets loaded</span>
    </div>
    
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
      userHasScrolled: false,
    }
  },
  computed: {
    packets: function() {
      return this.$store.getters.packets
    },
    filteredPackets: function() {

      let filter = this.$store.getters.packetFilter
      let filteredPackets = []

      if (filter.length === 0) {
        filteredPackets = this.packets
      }

      console.log(`filter:`, filter)

      filteredPackets = this.packets.filter(packet => {
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
    scrollToIndex: function() {
      return this.$store.getters.scrollToIndex
    },
  },
  watch: {
    filteredPackets() {
      // scroll list (to top) to force re-rendering 
      this.$refs[`packet-list`].scrollToIndex(0)
    },
    scrollToIndex(index) {
      if (!isNaN(index)) {
        this.$refs[`packet-list`].scrollToIndex(index)
      }
    },
    packets() {
      // list won't stay scrolled if packets are updated :/
      // if (!this.userHasScrolled) { 
        this.$refs[`packet-list`].scrollToBottom()
      // }
    }
  },
  methods: {
    scrollHandler() {
      this.userHasScrolled = true
    },
    toBottomHandler() {
      this.userHasScrolled = false
    }
  },
  mounted() {

    // prevent text selection on double click without preventing text selection by dragging
    document.addEventListener('mousedown', preventSelection, false);
    
  },
  beforeDestroy() {

    document.removeEventListener('mousedown', preventSelection, false);
    
  }
}

function preventSelection(event) {
  if (event.detail > 1) {
    event.preventDefault();
  }
}

</script>
