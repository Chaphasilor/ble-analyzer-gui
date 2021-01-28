<template>
  <div
    class="grid grid-cols-3 grid-rows-1 gap-1"
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
    },
    onFilterChange: String, 
  },
  computed: {
    packetFilter() {
      return this.$store.getters.packetFilter
    }
  },
  watch: {
    packetFilter: {
      deep: true,
      handler: function() {
        this.$emit(`input`, this.onFilterChange)
      }
    }
  },
  mounted() {

    console.log(`this.value:`, this.value)
    console.log(`this.onFilterChange:`, this.onFilterChange)
    
  }
}
</script>
