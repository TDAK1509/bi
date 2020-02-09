<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",

  created() {
    this.$store.dispatch("init");
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
