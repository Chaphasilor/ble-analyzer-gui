<template>
  <div
    class="grid grid-cols-3 grid-rows-1 gap-1"
  >

    <button
      v-for="overviewName of overviews"
      :key="overviewName"
      :class="`w-full ${value !== overviewName ? `bg-gray-400 hover:bg-gray-200` : `focus:outline-none`}`"
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
    },
    scrollToIndex() {
      return this.$store.getters.scrollToIndex
    }
  },
  watch: {
    // switch to the view defined by `this.onFilterChange` if the packet filter is changed
    packetFilter: {
      deep: true,
      handler: function() {
        this.$emit(`input`, this.onFilterChange)
      }
    },
    scrollToIndex: {
      handler: function() {
        this.$emit(`input`, this.onFilterChange)
      }
    },
  },
  mounted() {

    // console.debug(`this.value:`, this.value)
    // console.debug(`this.onFilterChange:`, this.onFilterChange)
    
  }
}
</script>
