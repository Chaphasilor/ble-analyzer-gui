<template>
  <div
    class="p-2 text-lg"
  >

    <h1
      class="mb-6 text-2xl"
    >
      Packet {{ routeParams.packetId }} - Details
    </h1>

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
        <td>Type of Packet</td>
        <td>{{ packet.destination.type }}</td>
      </tr>
      
      <tr>
        <td>Source Device Address</td>
        <td>{{ packet.source }}</td>
      </tr>

      <tr
        v-if="packet.destination.type != `broadcast`"
      >
        <td>Destination Device Address</td>
        <td>{{ packet.destination.address }}</td>
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
      class="block p-2 text-white bg-lightblue-600"
      type="button"
      @click="showConnection"
    >
      Show Connection
    </button>
    
    <br>
    <br>
    {{ packet }}
    
  </div>
</template>

<script>
export default {
  name: `PacketDetails`,
  data() {
    return {
      packet: {
        packetId: null,
        microseconds: null,
        source: ``,
        destination: {
          type: `unknown`,
          address: ``,
        },
        protocols: [],
        length: null
      },
    }
  },
  computed: {
    routeParams() {
      return this.$route.params
    },
    date() {
      return new Date(Math.round(this.packet.microseconds/1000))
    },
  },
  methods: {
    showConnection() {
      //TODO implement this
    }
  },
  mounted() {

    this.$store.dispatch(`loadPacket`, this.routeParams.packetId).then((packet) => {
      this.packet = packet
      console.log(`this.packet:`, this.packet);
    })
    
  }
}
</script>
