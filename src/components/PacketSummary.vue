<template>
  <div
    class="grid grid-flow-row grid-rows-1 gap-2 text-center border-b border-gray-700 grid-cols-packet-list"
    @click="$router.push({
      name: `PacketDetails`,
      params: {
        packetId: source.packetId,
      }
    })"
  >

    <span>{{ source.packetId }}</span>
    <span>{{ `${String(date.getHours()).padStart(2, `0`)}:${String(date.getMinutes()).padStart(2, `0`)}:${String(date.getSeconds()).padStart(2, `0`)}.${String(date.getMilliseconds()).padEnd(3, `0`)}${String(source.microseconds).slice(-3).padEnd(3, `0`)}` }}</span>
    <span>{{ source.source }}</span>
    <span v-if="source.destination.type == `broadcast`">Broadcast</span>
    <span v-else>{{ source.destination.address }}</span>
    <span>{{ source.protocols.join(`, `) }}</span>
    <span>{{ source.length }}</span>
    
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
    },
    source: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    date() {
      return new Date(Math.round(this.source.microseconds/1000))
    }
  }
}
</script>