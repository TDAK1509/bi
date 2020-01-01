<template>
  <div>
    <nav-bar />
    <router-view />
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";

export default {
  name: "Main",

  components: {
    NavBar
  },

  methods: {
    init() {
      return this.$store.dispatch("init");
    }
  },

  async mounted() {
    if (this.$store.state.isLoggedIn === false) {
      this.$router.push({ name: "login" });
      return;
    }
    await this.init();
  }
};
</script>
