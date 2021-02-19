<template>
  <div
    class="overflow-x-auto"
  >

    <h2
      class="h-10 p-1 text-xl bg-gray-300"
    >
      Issues
    </h2>

    <div
      class="p-1 my-1 border-b border-gray-500"
      v-for="(issue, index) of issues"
      :key="index"
      @dblclick="$store.dispatch(`scrollToIndex`, getClosestPacket(issue.microseconds) - 1);"
    >
      At {{ generateTimestamp(issue.microseconds) }}:
      <span
        :class="`px-1 ${issue.type === `warning` ? `bg-orange-400` : `bg-red-600 text-white`}`"
      >{{ issue.message }}</span>
    </div>

    <span
      v-if="issues.length === 0"
    >No issues yet</span>
  
  </div>
</template>

<script>
export default {
  name: `Issues`,
  computed: {
    issues() {
      return this.$store.getters.issues
    },
  },
  methods: {
    generateTimestamp(microseconds) {

      let timestampDate = new Date(Math.round(microseconds/1000))
      return `${String(timestampDate.getHours()).padStart(2, `0`)}:${String(timestampDate.getMinutes()).padStart(2, `0`)}:${String(timestampDate.getSeconds()).padStart(2, `0`)}.${String(timestampDate.getMilliseconds()).padEnd(3, `0`)}${String(microseconds).slice(-3).padEnd(3, `0`)}`
      
    },
    getClosestPacket(microseconds) {
      return this.$store.getters.packets.filter(packet => packet.microseconds <= microseconds).splice(-1)[0].packetId
    }
  }
}
</script>
