<template>
  <header class="nav-bar">
    <b-button
      type="is-white"
      icon-right="long-arrow-alt-left"
      @click="toPreviousPage"
    />

    <div class="nav-bar__change-password">
      <b-button
        type="is-danger"
        icon-left="key"
        @click="showPasswordModal = true"
        >Đổi password</b-button
      >
    </div>

    <nav class="nav-bar__navigator">
      <router-link
        class="nav-bar__navigator-item"
        :to="{ name: 'transaction' }"
        exact
        >Xem báo cáo tài chính</router-link
      >
    </nav>

    <b-button
      type="is-white"
      icon-right="long-arrow-alt-right"
      @click="toNextPage"
    />

    <change-password-modal v-model="showPasswordModal" />
  </header>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ChangePasswordModal from "./ChangePasswordModal.vue";

@Component({
  components: {
    ChangePasswordModal
  }
})
export default class NavBar extends Vue {
  searchText: string = "";
  showPasswordModal = false;

  toPreviousPage() {
    history.back();
  }

  toNextPage() {
    history.forward();
  }
}
</script>

<style lang="scss" scoped>
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px;
  border-bottom: 2px solid #ccc;
}

.nav-bar__search {
  margin-left: 20px;
  position: relative;

  .nav-bar__search-input {
    width: 220px;
  }

  .nav-bar__search-results {
    display: block;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: #fff;
    z-index: 1;

    .nav-bar__search-results-item {
      display: block;
      padding: 5px 10px;
      border: 1px solid #ccc;
      color: #727272;

      &:not(:last-child) {
        border-bottom: none;
      }

      &:hover {
        background: #ccc;
      }
    }
  }
}

.nav-bar__navigator {
  display: flex;
  justify-content: flex-end;

  .nav-bar__navigator-item {
    margin-right: 20px;
    text-transform: uppercase;
    letter-spacing: 1.5px;

    &.router-link-active {
      color: #ccc;
      cursor: not-allowed;
    }
  }
}

.nav-bar__change-password {
  flex: 1;
  text-align: center;
}
</style>
