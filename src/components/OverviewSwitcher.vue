<template>
  <div
    class="flex flex-row"
  >

    <button
      v-for="overviewName of overviews"
      :key="overviewName"
      :class="`w-full ${value !== overviewName ? `bg-gray-400` : `focus:outline-none`}`"
      @click="$emit(`input`, overviewName)"
    >
      {{ overviewName.split(` `).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(` `) }}
    </button>
      
  </div>
</template>

<script>
export default {
  name: `overviewSwitcher`,
  props: {
    value: String,
    overviews: {
      type: Array,
      default: function() {
        return [`Main`]
      }
    }
  },
  mounted() {

    console.log(`this.value:`, this.value)
    
  }
}
</script>
