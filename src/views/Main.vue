<template>
  <div>
    <nav-bar />

    <main class="main">
      <router-view />
    </main>
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
    if (
      this.$store.state.auth.isCheckedAuthState &&
      !this.$store.state.auth.isAuth
    ) {
      this.$router.push({ name: "login" });
      return;
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  padding: 0 20px;
  margin-top: 30px;
}
</style>
