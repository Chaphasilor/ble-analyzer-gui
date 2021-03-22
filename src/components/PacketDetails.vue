<template>
  <div
    class="overflow-x-auto"
  >

    <div
      class="relative w-full h-10 text-center bg-gray-300"
    >
      <h1
        class="text-2xl font-bold text-lightblue-600"
      >Packet {{ selectedPacket }} - Details</h1>

      <button
        class="absolute top-0 left-0 p-2 text-white bg-orange-500 hover:bg-orange-400"
        type="button"
        @click="$emit(`input`, false)"
      >
        Close
      </button>
      
    </div>

    <div
      class="w-full h-full p-2 text-lg"
    >

      <div
        v-if="packet.malformed"
        class="w-full p-2 mb-4 text-center text-white bg-red-600"
      >
        The packet seems to be malformed. The information below might be incorrect!
      </div>

      <div
        v-if="!packet.crcOk"
        class="w-full p-2 mb-4 text-center text-white bg-orange-600"
      >
        The packet's CRC (checksum) seems to be bad.
        <br>
        <span
          class="font-mono"
        >CRC is {{ 
          packet.protocols.find(proto => proto.shortName === `btle`) ? packet.protocols.find(proto => proto.shortName === `btle`).crc : `unknown`
         }}</span>
      </div>

      <h2 class="font-bold">
        Overview
      </h2>
      
      <table
        class="w-full mt-2 mb-10 order-gray-700"
      >
        <tr
          class="border-b border-gray-400"
        >
          <td>Time of Arrival</td>
          <td>
            {{ generateTimestamp(packet.microseconds) }}
            </td>
        </tr>

        <tr
          class="border-b border-gray-400"
        >
          <td>RSSI</td>
          <td>{{ packet.rssi }} dBm</td>
        </tr>

        <tr
          class="border-b border-gray-400"
        >
          <td>Channel Number</td>
          <td>{{ packet.channel }} ({{ packet.isOnPrimaryAdvertisingChannel ? `primary advertising` : `data or secondary advertising` }})</td>
        </tr>

        <tr
          class="border-b border-gray-400"
        >
          <td>Type of Packet</td>
          <td>{{ packet.type }}</td>
        </tr>

        <tr
          class="border-b border-gray-400"
        >
          <td>LLID</td>
          <td>{{ packet.llid }}</td>
        </tr>
        
        <tr
          class="border-b border-gray-400"
        >
          <td>Direction</td>
          <td>{{ packet.direction === `S2M` ? `Slave to Master` : `Master to Slave` }}</td>
        </tr>
        
        <tr
          class="border-b border-gray-400"
        >
          <td>Source Device Address</td>
          <td class="font-mono">{{ packet.source }}</td>
        </tr>

        <tr
          v-if="packet.destination !== ``"
          class="border-b border-gray-400"
        >
          <td>Destination Device Address</td>
          <td class="font-mono">{{ packet.destination }}</td>
        </tr>

        <tr
          class="border-b border-gray-400"
        >
          <td>Part of a Connection</td>
          <td>{{ packet.connection.isPartOfConnection ? `Yes` : `No` }} <span class="font-mono">{{ packet.connection.isPartOfConnection ? `(${packet.connection.accessAddress})` : `` }}</span></td>
        </tr>

        <tr
          class="border-b border-gray-400"
        >
          <td>Primary Advertisement</td>
          <td>{{ packet.isPrimaryAdvertisement ? `Yes` : `No` }}</td>
        </tr>

        <tr
          class="border-b border-gray-400"
        >
          <td>On Primary Advertising Channel</td>
          <td>{{ packet.isOnPrimaryAdvertisingChannel ? `Yes` : `No` }}</td>
        </tr>

        <tr
          v-if="packet.advertisingAddress && packet.advertisingAddress.length > 0"
          class="border-b border-gray-400"
        >
          <td>Advertising Address</td>
          <td class="font-mono">{{ packet.advertisingAddress }}</td>
        </tr>

        <tr
          class="border-b border-gray-400"
        >
          <td>Frame length</td>
          <td>{{ packet.length }} bytes</td>
        </tr>

        <tr
          class="border-b border-gray-400"
        >
          <td>CRC</td>
          <td class="font-mono">{{ packet.protocols.find(proto => proto.shortName === `btle`) ? packet.protocols.find(proto => proto.shortName === `btle`).crc : `unknown` }} ({{ packet.crcOk ? `OK` : `Bad` }})</td>
        </tr>

      </table>

      <h2 class="font-bold">Payload</h2>
      <div
        class="w-full mb-6 overflow-x-scroll font-mono tracking-tight text-left whitespace-nowrap place-self-start"
        style="word-spacing: -0.25rem;"
      >{{ payloadFormatted }}</div>

      <div
        v-if="packet.advertisingData && packet.advertisingData.length > 0"
        class="mt-4 mb-6"
      >

        <h2 class="font-bold">{{ packet.isPrimaryAdvertisement ? `Advertising Data` : `Scan Response Advertising Data` }}</h2>

        <table
          class="border border-gray-500"
        >

          <tr
            class="border-b border-gray-500"
          >
            <th>Type</th>
            <th>Name</th>
            <th>Value</th>
            <th>Length</th>
          </tr>

          <tr
            v-for="(entry, index) of packet.advertisingData"
            :key="index"
          >
            <td class="p-2 font-mono text-center border border-gray-500">{{ entry.type }}</td>
            <td class="p-2 text-center border border-gray-500">{{ entry.name }}</td>
            <td class="p-2 font-mono text-center border border-gray-500">{{ entry.value }}</td>
            <td class="p-2 text-center border border-gray-500">{{ entry.length }}</td>
          </tr>
          
        </table>

        <br>

        <div
          v-if="packet.advertisingData.filter(x => x.details).length > 0"
        >
        
          <h3 class="font-bold">Advertising Data Details</h3>

          <ul>
            <li
              v-for="(entry, index) of packet.advertisingData.filter(x => x.details)"
              :key="index"
            >
              <span
                class="font-semibold"
              >{{ entry.name }}:</span>
              <ul
                class="pl-4 pr-2"
              >
                <li
                  v-for="(detail, index2) of entry.details"
                  :key="index2"
                >
                  <span class="italic">{{ detail.description }}: </span>
                  <span>{{ detail.supported }}</span>
                </li>
              </ul>
            </li>
          </ul>

        </div>

      </div>

      <button
        v-if="packet.connection.isPartOfConnection"
        class="block p-2 mb-6 text-white bg-lightblue-600 hover:bg-lightblue-500"
        type="button"
        @click="showConnection"
      >
        Show Connection
      </button>

      <h2 class="font-bold">
        Protocols
      </h2>
      
      <table
        class="w-full mb-10 border border-separate border-gray-700 rounded-md"
      >

        <tr
          :key="protocol.name"
          v-for="protocol of packet.protocols"
        >

          <td>
            {{ protocol.name }}
          </td>
        
          <details>
            <summary>
              Toggle Details
            </summary>

            <div
              v-for="([key, value], index) of Object.entries(protocol)"
              :key="index"
              class="block"
            >

              <span
                class="font-medium"
              >{{ key }}: </span>
              <span>{{ value }}</span>

            </div>
            
          </details>

        </tr>
        
      </table>

      <br>
      
    </div>

  </div>
</template>

<script>
export default {
  name: `PacketDetails`,
  props: {
    value: Boolean,
  },
  data() {
    return {
      packet: {
        malformed: false,
        packetId: null,
        microseconds: null,
        connection: {
          isPartOfConnection: false,
          accessAddress: ``,
          master: ``,
          slave: ``,
        },
        type: `unknown`,
        source: ``,
        destination: ``,
        protocols: [],
        length: null
      },
    }
  },
  computed: {
    /**
     * ### Returns the currently selected packet from the store
     */
    selectedPacket() {
      return this.$store.getters.selectedPacket
    },
    payloadFormatted() {
      return this.packet?.payload?.split(``).reduce((string, char, index) => {
        return `${string}${char.toUpperCase()}${index % 2 === 0 ? `` : ` `}`
      }, ``)
    },
  },
  watch: {
    selectedPacket() {
      if (!isNaN(this.selectedPacket)) {
        this.loadPacket()
      }
    }
  },
  methods: {
    /**
     * ### Loads the packet details (`full` format) from the store 
     */
    loadPacket() {

      this.$store.dispatch(`loadPacket`, this.selectedPacket).then((packet) => {
        // console.debug(`this.packet:`, JSON.parse(JSON.stringify(packet)));
        this.packet = packet
        // console.debug(`this.packet.connection:`, this.packet.connection)
      })
        
    },
    /**
     * ### Applies a packet filter to only show packets from the same connection as the currently selected packet
     */
    showConnection() {

      // filter applies to packetSummary object
      this.$store.dispatch(`setPacketFilter`, [
        [[`isPartOfConnection`], this.packet.connection.isPartOfConnection],
        [[`accessAddress`], this.packet.connection.accessAddress],
      ])
      
    },
    /**
     * ### Generates a human-readable timestamp from the packet's microseconds
     * @param {Number} microseconds the microseconds when the packet arrived
     */
    generateTimestamp(microseconds) {

      let timestampDate = new Date(Math.round(microseconds/1000))
      return `${String(timestampDate.getHours()).padStart(2, `0`)}:${String(timestampDate.getMinutes()).padStart(2, `0`)}:${String(timestampDate.getSeconds()).padStart(2, `0`)}.${String(timestampDate.getMilliseconds()).padEnd(3, `0`)}${String(microseconds).slice(-3).padEnd(3, `0`)}`
      
    },
  },
  mounted() {

    // load the packet details as soon as the component is loaded
    this.loadPacket()
    
  }
}
</script>
