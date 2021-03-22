<template>
  <div
    class="grid content-center h-auto grid-flow-row gap-1 border-b border-gray-700 cursor-pointer hover:bg-gray-300 place-items-center"
    @dblclick="filterConnection()"
    @click="details = !details"
    title="Click to toggle details"
  >

    <div
      class="grid content-center w-full grid-flow-row gap-1 text-center grid-cols-connection-list place-items-center"
    >

      <div
        class="grid content-center p-2 place-items-center"
      >

        <div
          class="w-16 h-8 rounded-md "
          :style="`background-color: #${accessAddressToColor(source.accessAddress)}; color: ${colorLightOrDark(accessAddressToColor(source.accessAddress)) === `light` ? `black` : `white`}`"
        ></div>

      </div>

      <span
        class="font-mono"
      >{{ source.accessAddress }}</span>

      <span>{{ source.master }}</span>
      <span>{{ source.slave }}</span>
      <span>{{ source.packets }}</span>
      <span>{{ source.state }}</span>
      
      <button
        class="block p-2 text-white bg-lightblue-600 hover:bg-lightblue-500"
        type="button"
        @click.stop="filterConnection()"
      >Filter</button>

      <!-- `chevron-down` icon from https://github.com/tabler/tabler-icons -->

      <svg
        v-if="!details"
        class="w-8 h-8 stroke-current stroke-1"
        viewBox="0 0 24 24"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <polyline points="6 9 12 15 18 9" />
      </svg>

      <!-- `chevron-up` icon from https://github.com/tabler/tabler-icons -->

      <svg
        v-else
        class="w-8 h-8 stroke-current stroke-1"
        viewBox="0 0 24 24"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <polyline points="6 15 12 9 18 15" />
      </svg>

    </div>

    <div
      v-if="details"
      class="w-full p-4 mt-2"
    >

      <div
        v-if="propertiesAvailable"
      >

        <div
          class="mb-2 font-semibold"
        >Connection Properties:</div>
        
        <table
          class="w-full text-center"
        >
          <tr
            class="border-b border-gray-400"
          >
            <th class="font-normal">CRC Init</th>
            <th class="font-normal">Window Size</th>
            <th class="font-normal">Window Offset</th>
            <th class="font-normal">Connection Interval</th>
            <th class="font-normal">Slave Latency</th>
            <th class="font-normal">Supervision Timeout</th>
            <th class="font-normal">Channel Hop</th>
            <th class="font-normal">Sleep Clock Accuracy</th>
          </tr>
          <tr>
            <td class="font-mono">{{ source.properties.crcInit }}</td>
            <td>{{ source.properties.windowSize }}</td>
            <td>{{ source.properties.windowOffset }}</td>
            <td>{{ source.properties.connectionInterval }}</td>
            <td>{{ source.properties.slaveLatency }}</td>
            <td>{{ source.properties.supervisionTimeout }}</td>
            <td>{{ source.properties.channelHop }}</td>
            <td>{{ source.properties.sleepClockAccuracy }}</td>
          </tr>

        </table>
        
        <div
          class="mt-4 mb-2 font-semibold"
        >Channel Map:</div>
        <div class="flex flex-row justify-between">
          <div
            v-for="([key, value]) of Object.entries(source.properties.channelMap)"
            :key="key"
            class="mx-2"
            :class="value ? `font-bold` : `font-light`"
          >{{ key }}</div>
        </div>

      </div>

      <div
        v-else
        class="text-center"
      >
        No additional data available because the start of the connection wasn't detected
      </div>

    </div>
    
  </div>
</template>

<script>
export default {
  name: `ConnectionSummary`,
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
  data() {
    return {
      details: false,
    }
  },
  computed: {
    propertiesAvailable() {
      return Object.entries(this.source.properties).length > 0
    }
  },
  methods: {
    /**
     * ### Interprets the last 6 bytes of the access address as a hex color
     */
    accessAddressToColor(address) {
      return address.slice(4)
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
    /**
     * ### Applies a packet filter that only shows packets from this connection
     */
    filterConnection() {

      this.$store.dispatch(`setPacketFilter`, [
        [[`accessAddress`], this.source.accessAddress],
      ])

    }
  }
}
</script>