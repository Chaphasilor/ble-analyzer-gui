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
      userHasScrolled: false, // tracks if the user has actively scrolled
    }
  },
  computed: {
    packets: function() {
      return this.$store.getters.packets
    },
    filteredPackets: function() {
      return this.$store.getters.filteredPackets
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
    scrollToIndex(id) {
      if (!isNaN(id)) {
        this.$refs[`packet-list`].scrollToIndex(id)
      }
    },
    packets() {
      // scroll to bottom if new packets arrive, unless th user has actively scrolled somewhere else
      // if (!this.userHasScrolled) { // list won't stay scrolled if packets are updated :/
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

    // scroll to index if set
    if (!isNaN(this.scrollToIndex)) {
      this.$refs[`packet-list`].scrollToIndex(this.scrollToIndex)
    }

    // prevent text selection on double click without preventing text selection by dragging
    document.addEventListener(`mousedown`, preventSelection, false);
    
  },
  beforeDestroy() {

    // remove the event listener before the component is unloaded
    document.removeEventListener(`mousedown`, preventSelection, false);
    
  }
}

function preventSelection(event) {
  if (event.detail > 1) {
    event.preventDefault();
  }
}

</script>
