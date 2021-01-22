<template>
  <div>

    TODO: 
    Show Warnings and Alerts here
    <br>
    <br>
    Things like missing packets, protocol errors, timeouts, low RSSIs, etc.
  
    <br>
    <br>
  
    {{ $store.getters.connections }}
    
  </div>
</template>

<script>
export default {
  name: `Issues`,
}
</script>
