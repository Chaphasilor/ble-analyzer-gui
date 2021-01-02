<template>
  <div
    class="grid grid-flow-row grid-cols-6 grid-rows-1 gap-2 text-center"
  >

    <span>{{ source.packetId }}</span>
    <span>{{ source.microseconds }}</span>
    <span>{{ source.source }}</span>
    <span>{{ source.destination }}</span>
    <span>{{ source.protocols }}</span>
    <span>{{ source.length }}</span>
    
  </div>
</template>

<script>
export default {
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
  }
}
</script>