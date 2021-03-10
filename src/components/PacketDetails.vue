<template>
  <div
    class=""
  >

    <div
      class="relative w-full h-10 text-center bg-gray-300"
    >
      <h1
        class="text-2xl font-bold text-lightblue-600"
      >BLE Analyzer</h1>

      <button
        class="absolute top-0 left-0 p-2 text-white bg-orange-400"
        type="button"
        @click="$emit(`input`, false)"
      >
        Close
      </button>
      
    </div>

    <div
      class="p-2 text-lg"
    >

      <h1
        class="mb-6 text-2xl"
      >
        Packet {{ selectedPacket }} - Details
      </h1>

      <div
        v-if="packet.malformed"
        class="inline-block p-2 mb-4 text-white bg-red-600"
      >
        The Package is malformed. Below information might be incorrect!
      </div>

      <h2>
        Overview
      </h2>
      
      <table
        class="w-full mb-10 border border-separate border-gray-700 rounded-md"
      >
        <tr>
          <td>Time of Arrival</td>
          <td>
            {{ `${String(date.getHours()).padStart(2, `0`)}:${String(date.getMinutes()).padStart(2, `0`)}:${String(date.getSeconds()).padStart(2, `0`)}.${String(date.getMilliseconds()).padEnd(3, `0`)}${String(packet.microseconds).slice(-3).padEnd(3, `0`)}` }}
            </td>
        </tr>

        <tr>
          <td>Channel Number</td>
          <td>{{ packet.channel }}</td>
        </tr>

        <tr>
          <td>Channel Type</td>
          <td>{{ packet.isOnPrimaryAdvertisingChannel ? `Primary Advertising` : `Data or Secondary Advertising` }}</td>
        </tr>

        <tr>
          <td>Type of Packet</td>
          <td>{{ packet.type }}</td>
        </tr>
        
        <tr>
          <td>Direction</td>
          <td>{{ packet.direction === `S2M` ? `Slave to Master` : `Master to Slave` }}</td>
        </tr>
        
        <tr>
          <td>Source Device Address</td>
          <td>{{ packet.source }}</td>
        </tr>

        <tr
          v-if="packet.destination !== ``"
        >
          <td>Destination Device Address</td>
          <td>{{ packet.destination }}</td>
        </tr>

        <tr>
          <td>Protocols Used</td>
          <td>{{ packet.protocols.map(protocol => protocol.name).join(`, `) }}</td>
        </tr>

        <tr>
          <td>Frame length</td>
          <td>{{ packet.length }} byte</td>
        </tr>

      </table>

      <h2>
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

      <button
        v-if="packet.connection.isPartOfConnection"
        class="block p-2 text-white bg-lightblue-600"
        type="button"
        @click="showConnection"
      >
        Show Connection
      </button>
      
    </div>

      <!-- <br>
      <br>
      {{ packet }} -->

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
    selectedPacket() {
      return this.$store.getters.selectedPacket
    },
    date() {
      return new Date(Math.round(this.packet.microseconds/1000))
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
    loadPacket() {

      this.$store.dispatch(`loadPacket`, this.selectedPacket).then((packet) => {
        console.log(`this.packet:`, JSON.parse(JSON.stringify(packet)));
        this.packet = packet
        console.log(`this.packet.connection:`, this.packet.connection)
      })
        
    },
    showConnection() {

      // filter applies to packetSummary object
      this.$store.dispatch(`setPacketFilter`, [
        [[`isPartOfConnection`], this.packet.connection.isPartOfConnection],
        [[`accessAddress`], this.packet.connection.accessAddress],
      ])
      
    }
  },
  mounted() {

    this.loadPacket()
    
  }
}
</script>
