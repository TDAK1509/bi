<template>
  <div>
    <nav-bar />

    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NavBar from "@/components/NavBar.vue";

@Component({
  components: {
    NavBar
  }
})
export default class Main extends Vue {}
</script>

<style lang="scss" scoped>
.main {
  padding: 0 20px;
  margin-top: 30px;
}
</style>
