<template>
  <div
    class="grid content-center grid-flow-row grid-rows-1 gap-1 text-center border-b border-gray-700 cursor-pointer hover:bg-gray-300 grid-cols-packet-list place-items-center"
    :class="`${(source.malformed || !source.crcOk) ? `bg-red-300 hover:bg-red-400` : ``} ${scrollToIndex === index ? `bg-orange-300 hover:bg-orange-500 hover:bg-orange-400` : ``}`"
    :title="source.malformed ? `This packet is malformed` : !source.crcOk ? `The packet's CRC isn't correct` : ``"
    @dblclick="$store.dispatch(`selectPacket`, source.packetId);"
  >

    <span>{{ source.packetId }}</span>
    <span>{{ generateTimestamp(source.microseconds) }}</span>
    
    <span>{{ source.channel }}</span>
    <span>{{ source.rssi }} dBm</span>
    <span
      class="font-mono"
    >{{ source.type }}</span>
    
    <div
      class="px-2 py-px m-1 font-mono rounded-md"
      :style="source.isPartOfConnection ? `background-color: #${accessAddressToColor(source.accessAddress)}; color: ${colorLightOrDark(accessAddressToColor(source.accessAddress)) === `light` ? `black` : `white`}` : ``"
    >
      {{ source.isPartOfConnection ? source.accessAddress : `` }}

      <div
        class="grid w-full h-full place-items-center"
      >
        <!-- `access-point` icon from https://github.com/tabler/tabler-icons -->
        <svg
          v-if="!source.isPartOfConnection"
          class="w-6 h-6 stroke-1.5"
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <line x1="12" y1="12" x2="12" y2="12.01" />
          <path d="M14.828 9.172a4 4 0 0 1 0 5.656" />
          <path d="M17.657 6.343a8 8 0 0 1 0 11.314" />
          <path d="M9.168 14.828a4 4 0 0 1 0 -5.656" />
          <path d="M6.337 17.657a8 8 0 0 1 0 -11.314" />
        </svg>
      </div>

    </div>

    <span>{{ source.highestProtocol }}</span>

    <!-- force scroll bar so all packet summaries have the same height, else there are issues with scrolling to the right offset -->
    <span
      class="w-full overflow-x-scroll font-mono tracking-tight text-left whitespace-nowrap place-self-start"
      style="word-spacing: -0.25rem;"
      v-html="source.isAdvertisement ? highlightAdvertisingAddress(payloadFormatted) : payloadFormatted"
    ></span>

    <span>{{ source.length }}</span>

    <span>{{ source.crcOk ? `OK` : `BAD` }}</span>
    
  </div>
</template>

<script>
export default {
  name: `PacketSummary`,
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
    payloadFormatted() {
      return this.source.payload.split(``).reduce((string, char, index) => {
        return `${string}${char.toUpperCase()}${index % 2 === 0 ? `` : ` `}`
      }, ``)
    },
    detailsViewOpen() {
      return !isNaN(this.$store.getters.selectedPacket)
    },
    scrollToIndex: function() {
      return this.$store.getters.scrollToIndex
    },
  },
  methods: {
    /**
     * ### Interprets the last 6 bytes of the access address as a hex color
     */
    accessAddressToColor(address) {
      return address.slice(4)
    },
    /**
     * ### Generates a human-readable timestamp from the packet's microseconds
     * @param {Number} microseconds the microseconds when the packet arrived
     */
    generateTimestamp(microseconds) {

      let timestampDate = new Date(Math.round(microseconds/1000))
      return `${String(timestampDate.getHours()).padStart(2, `0`)}:${String(timestampDate.getMinutes()).padStart(2, `0`)}:${String(timestampDate.getSeconds()).padStart(2, `0`)}.${String(timestampDate.getMilliseconds()).padEnd(3, `0`)}${String(microseconds).slice(-3).padEnd(3, `0`)}`
      
    },
    /**
     * ### Detect if a color is a light or a dark color
     * Used to make sure text has enough contrast
     * @returns {String} either `light` or `dark`
     */
    colorLightOrDark(color) {

      var r = parseInt(color.slice(0, 2), `16`);
      var g = parseInt(color.slice(2, 4), `16`);
      var b = parseInt(color.slice(4), `16`);

      var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // ITU-R BT.709

      return luma > 128 ? `light` : `dark`
      
    },
    highlightAdvertisingAddress(payloadString) {
      let reversedAddress = this.source.advertisingAddress.toUpperCase().split(`:`).reverse().join(` `)
      return payloadString.replace(reversedAddress, `<b title="Advertising Address: ${this.source.advertisingAddress}" >${reversedAddress}</b>`)
    },
  },
}
</script>