<template>
  <ol>
    <li
      class="border border-red-500"
      :key="packet.packetId"
      v-for="packet of packets"
    >

      <PacketSummary
        v-bind="packet"
      />
      
    </li>
  </ol>
</template>

<script>

import PacketSummary from '@/components/PacketSummary'

export default {
  name: `PacketList`,
  components: {
    PacketSummary,
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
