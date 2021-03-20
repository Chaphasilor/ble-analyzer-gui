<template>
  <div
    class="flex flex-col"
  >

      <div
        class="grid content-center grid-flow-row grid-rows-1 gap-1 pr-4 text-center border-b-2 border-gray-700 grid-cols-advertiser-list"
      >
        <span>Advertising Address</span>
        <span>Full Local Name</span>
        <span>Short Local Name</span>
        <span>Total Packets</span>
      </div>
      
    <VirtualList
      ref="connection-list"
      class="h-full overflow-y-auto"
      :data-key="'advertisingAddress'"
      :data-sources="advertisers"
      :data-component="AdvertiserSummaryComponent"
      :keeps="50"
    />
    
  </div>
</template>

<script>

import AdvertiserSummary from '@/components/AdvertiserSummary'
import VirtualList from 'vue-virtual-scroll-list'

export default {
  name: `PacketList`,
  components: {
    VirtualList
  },
  data() {
    return {
      AdvertiserSummaryComponent: AdvertiserSummary,
    }
  },
  computed: {
    advertisers: function() {
      return this.$store.getters.advertisers
    },
  },
  mounted() {

    // prevent text selection on double click without preventing text selection by dragging
    document.addEventListener(`mousedown`, preventSelection, false);
    
  },
  beforeDestroy() {

    // remove the event listener before unloading the component
    document.removeEventListener(`mousedown`, preventSelection, false);
    
  }
}

function preventSelection(event) {
  if (event.detail > 1) {
    event.preventDefault();
  }
}

</script>
