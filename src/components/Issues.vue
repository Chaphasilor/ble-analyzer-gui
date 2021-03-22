<template>
  <div
    class="flex flex-col h-full"
  >

    <h2
      class="h-10 p-1 text-xl bg-gray-300"
    >
      Issues
    </h2>

    <div
      class="h-full overflow-x-auto"
    >

      <div
        class="p-1 my-1 border-b border-gray-500 cursor-pointer"
        :class="generateIssueColor(issue.type)"
        v-for="(issue, index) of issues"
        :key="index"
        @click="$store.dispatch(`scrollToId`, getClosestPacket(issue.microseconds));"
      >
        At {{ generateTimestamp(issue.microseconds) }}:
        <span
          class="px-1"
        >{{ issue.message }}</span>
      </div>

    </div>

    <div
      v-if="issues.length === 0"
      class="w-full h-full text-center"
    >
      No issues yet
    </div>
  
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
    /**
     * ### Generates a human-readable timestamp from the issues's microseconds
     * @param {Number} microseconds the microseconds when the issue occurred
     */
    generateTimestamp(microseconds) {

      let timestampDate = new Date(Math.round(microseconds/1000))
      return `${String(timestampDate.getHours()).padStart(2, `0`)}:${String(timestampDate.getMinutes()).padStart(2, `0`)}:${String(timestampDate.getSeconds()).padStart(2, `0`)}.${String(timestampDate.getMilliseconds()).padEnd(3, `0`)}${String(microseconds).slice(-3).padEnd(3, `0`)}`
      
    },
    /**
     * ### Selects background and text color based on the type of the issue
     * @param {String} issueType the type of the issue
     */
    generateIssueColor(issueType) {

      let backgroundAndFontColor = ``

      console.log(`issueType:`, issueType)

      switch (issueType) {
        case `warning`:
          backgroundAndFontColor = `bg-orange-300 hover:bg-orange-500 hover:bg-orange-400 text-black`
          break;

        case `alert`:
          backgroundAndFontColor = `bg-red-300 hover:bg-red-400 text-black`
          break;
      
        default: // info
          // don't add any color, infos are not important
          break;
      }

      return backgroundAndFontColor

    },
    /**
     * ### Finds the packet with the closest matching microsecond count
     * @param {Number} microseconds the microseconds when the issue occurred
     */
    getClosestPacket(microseconds) {
      return this.$store.getters.packets.filter(packet => packet.microseconds <= microseconds).splice(-1)?.[0]?.packetId
    }
  }
}
</script>
