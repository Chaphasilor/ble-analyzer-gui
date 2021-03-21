<template>
  <div
    class="fixed z-10 flex flex-col justify-center w-full h-full p-32"
  >

    <div
      class="w-auto h-full p-6 my-64 text-center text-gray-900 bg-gray-300 border-4 border-gray-500 mx-96"
    >

      <h2
        class="text-xl font-semibold"
      >Connection Setup</h2>

      <form
        class="p-4"
        @submit.prevent="updateBackendUrl()"
      >

        <label for="backend-url">Backend Websocket URL:</label>
        <br>
        <input
          id="backend-url"
          ref="backend-url"
          class="w-full max-w-xl p-2 mt-2"
          type="text"
          name="backend-url"
          placeholder="Enter URL here, either ws:// or wss:// protocol"
        >

        <br>

        <input
          class="p-2 mt-10 text-white cursor-pointer bg-lightblue-600"
          type="submit"
          value="Confirm URL"
        >
      
      </form>

    </div>

  </div>
</template>

<script>
export default {
  name: `BackendConnectionDialog`,
  methods: {
    updateBackendUrl() {

      this.$store.dispatch(`updateBackendUrl`, this.$refs[`backend-url`].value)
      
    }
  }
}
</script>
