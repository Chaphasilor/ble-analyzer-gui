<template>
  <div
    class="grid content-center h-12 grid-flow-row grid-rows-1 gap-1 p-2 text-center border-b border-gray-700 cursor-pointer hover:bg-gray-300 grid-cols-advertiser-list place-items-center"
    @dblclick="$store.dispatch(`setPacketFilter`, [
      [[`advertisingAddress`], source.advertisingAddress],
    ])"
  >

    <span
      class="font-mono"
    >{{ source.advertisingAddress }}</span>

    <span>{{ source.completeLocalName }}</span>

    <span>{{ source.shortLocalName }}</span>

    <span>{{ source.packets }}</span>
    
  </div>
</template>

<script>
export default {
  name: `AdvertiserSummary`,
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
  }
}
</script>