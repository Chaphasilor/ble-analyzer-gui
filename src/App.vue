<template>
  <div id="app" class="bg-gray-50">

    <router-view></router-view>
    
  </div>
</template>

<script>


export default {
  name: `App`,
  mounted() {

    // this.$store.dispatch(`connectToServer`) // causes `connectToServer()` to be called twice, which in turn breaks things
    
  }
}
</script>
