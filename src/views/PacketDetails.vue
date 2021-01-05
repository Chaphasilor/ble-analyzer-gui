<template>
  <div>

    <!-- Packet Details (ID {{ routeParams.packetId }})

    <br> -->

    {{ packet }}
    
  </div>
</template>

<script>
export default {
  name: `PacketDetails`,
  data() {
    return {
      packet: undefined,
    }
  },
  computed: {
    routeParams() {
      return this.$route.params
    }
  },
  mounted() {

    this.$store.dispatch(`loadPacket`, this.routeParams.packetId).then((packet) => {
      this.packet = packet
    })
    
  }
}
</script>
