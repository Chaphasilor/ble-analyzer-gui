<template>
  <div
    class="flex flex-col"
  >

      <div
        class="grid content-center grid-flow-row grid-rows-1 gap-1 text-center border-b-2 border-gray-700 grid-cols-connection-list"
      >
        <span>Color</span>
        <span>Access Address</span>
        <span>Master</span>
        <span>Slave</span>
        <span>Total Packets</span>
        <span>Status</span>
      </div>
      
    <VirtualList
      ref="connection-list"
      class="h-full overflow-y-auto"
      :data-key="'accessAddress'"
      :data-sources="connections"
      :data-component="ConnectionSummaryComponent"
      :keeps="50"
    />
    
  </div>
</template>

<script>

import ConnectionSummary from '@/components/ConnectionSummary'
import VirtualList from 'vue-virtual-scroll-list'

export default {
  name: `PacketList`,
  components: {
    VirtualList
  },
  data() {
    return {
      ConnectionSummaryComponent: ConnectionSummary,
    }
  },
  computed: {
    connections: function() {
      return this.$store.getters.connections
    },
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
