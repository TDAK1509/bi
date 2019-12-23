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
      return this.$store.dispatch("fetchClients");
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

// Import Bulma's core
@import "~bulma/sass/utilities/_all";

// Links
$link: $link;
$link-invert: $link-invert;
$link-focus-border: $link;

// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";
</style>
