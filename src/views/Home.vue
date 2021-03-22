<template>
  <div
    class="grid h-screen p-0 m-0 grid-rows-main grid-cols-main"
    @keydown.esc="resetBackendUrl()"
  >
    
    <BackendConnectionDialog
      v-if="backendUrl === ``"
      class="fixed z-10 w-full h-full m-auto mx-auto"
      @keydown.esc="resetBackendUrl()"
    />
    
    <Header
      class="w-full h-10 col-span-full"
    />

    <div
      :class="`grid m-0 h-full grid-rows-layout ${detailsOpen ? `col-span-auto` : `col-span-full`}`"
    >

      <OverviewSwitcher
        class=""
        :overviews="overviews"
        onFilterChange="packets"
        v-model="selectedOverview"
      />
      
      <div
        class="max-h-full"
      >

        <PacketList
          v-if="selectedOverview === `packets`"
          class="h-full"
        />

        <ConnectionList
          v-if="selectedOverview === `connections`"
          class="h-full"
        />

        <AdvertiserList
          v-if="selectedOverview === `advertisers`"
          class="h-full"
        />

      </div>

      <Issues
        class="border-t border-gray-500"
      />

    </div>

    <PacketDetails
      v-if="detailsOpen"
      class="border-l border-gray-500"
      v-model="detailsOpen"
    />

  </div>
</template>

<script>

import PacketList from '@/components/PacketList'
import ConnectionList from '@/components/ConnectionList'
import AdvertiserList from '@/components/AdvertiserList'
import Issues from '@/components/Issues'
import Header from '../components/Header.vue'
import PacketDetails from '../components/PacketDetails.vue'
import OverviewSwitcher from '../components/OverviewSwitcher.vue'
import BackendConnectionDialog from '../components/BackendConnectionDialog.vue'

export default {
  name: 'Home',
  components: {
    PacketList,
    ConnectionList,
    AdvertiserList,
    Issues,
    Header,
    PacketDetails,
    OverviewSwitcher,
    BackendConnectionDialog,
  },
  data: function() {
    return {
      overviews: [`packets`, `connections`, `advertisers`], // configure overviews (tabs)
      selectedOverview: `packets`, // default overview
      detailsOpen: false,
    }
  },
  computed: {
    selectedPacket() {
      return this.$store.getters.selectedPacket
    },
    backendUrl() {
      return this.$store.getters.backendUrl
    },
  },
  watch: {
    detailsOpen() {
      if (!this.detailsOpen) {
        this.$store.dispatch(`selectPacket`, NaN) // unselect packet if details are closed
      }
    },
    selectedPacket() {
      this.detailsOpen = !isNaN(this.selectedPacket) // open details if a packet gets selected
    }
  },
  methods: {
    resetBackendUrl() {
      if (this.backendUrl === ``) {
        this.$store.dispatch(`resetBackendUrl`)
      }
    }
  }
}
</script>
