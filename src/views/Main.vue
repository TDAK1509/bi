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

  async mounted() {
    if (this.$store.state.auth.isLoggedIn === false) {
      this.$router.push({ name: "login" });
      return;
    }
  }
};
</script>
