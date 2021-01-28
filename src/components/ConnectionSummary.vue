<template>
  <div
    class="grid content-center grid-flow-row grid-rows-1 gap-1 text-center border-b border-gray-700 cursor-pointer hover:bg-gray-300 grid-cols-connection-list place-items-center"
    @dblclick="$store.dispatch(`setPacketFilter`, [
      [[`accessAddress`], source.accessAddress],
    ])"
  >

    <div
      class="grid content-center p-2 place-items-center"
    >

      <div
        class="w-16 h-8 rounded-md"
        :style="`background-color: #${accessAddressToColor(source.accessAddress)}; color: ${colorLightOrDark(accessAddressToColor(source.accessAddress)) === `light` ? `black` : `white`}`"
      ></div>

    </div>

    <span
      class="font-mono"
    >{{ source.accessAddress }}</span>

    <span>{{ source.master }}</span>
    <span>{{ source.slave }}</span>
    <span>{{ source.packets }}</span>
    
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
  computed: {
  },
  methods: {
    accessAddressToColor(address) {
      return address.slice(4)
    },
    colorLightOrDark(color) {

      var r = parseInt(color.slice(0, 2), `16`);
      var g = parseInt(color.slice(2, 4), `16`);
      var b = parseInt(color.slice(4), `16`);

      var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // ITU-R BT.709

      return luma > 128 ? `light` : `dark`
      
    },
  }
}
</script>