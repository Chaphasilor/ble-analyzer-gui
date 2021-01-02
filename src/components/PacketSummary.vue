<template>
  <div
    class="grid grid-flow-row grid-cols-6 grid-rows-1 gap-2"
  >

    <span>{{ packetId }}</span>
    <span>{{ microseconds }}</span>
    <span>{{ source }}</span>
    <span>{{ destination }}</span>
    <span>{{ protocols }}</span>
    <span>{{ length }}</span>
    
  </div>
</template>

<script>
export default {
  props: {
    packetId: {
      type: Number,
      required: true,
    },
    microseconds: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    destination: {
      type: Object,
      required: true,
    },
    protocols: {
      type: Array,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
  }
}
</script>