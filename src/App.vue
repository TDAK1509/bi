<template>
  <div id="app">
    <nav-bar />
    <router-view />
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";

export default {
  name: "App",

  components: {
    NavBar
  },

  methods: {
    getClients() {
      return this.$store.dispatch("getClients");
    }
  },

  mounted() {
    this.getClients();
  }
};
</script>

<style lang="scss">
#app {
  color: #000;
}
</style>
