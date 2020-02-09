<template>
  <header class="nav-bar">
    <b-button
      type="is-white"
      icon-right="long-arrow-alt-left"
      @click="toPreviousPage"
    />

    <router-link class="nav-bar__search" :to="{ name: 'search' }" exact>
      <b-icon icon="search" size="is-small" />
      Tìm giao dịch
    </router-link>

    <div class="nav-bar__change-password">
      <b-button
        type="is-warning"
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
        >Doanh Thu</router-link
      >

      <router-link class="nav-bar__navigator-item" :to="{ name: 'debt' }" exact
        >Nợ</router-link
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
  color: #000;

  &:hover {
    color: red;
  }
}

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
}

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

.nav-bar__navigator {
  display: flex;
  justify-content: flex-end;
}

.nav-bar__navigator-item {
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 700;
  color: #000;
  padding: 0px 20px;

  &:hover {
    color: red;
  }

  &.router-link-active {
    color: red;
    cursor: not-allowed;
  }

  &:not(:first-child) {
    border-left: 1px solid #000;
  }
}
.nav-bar__change-password {
  flex: 1;
  text-align: center;
}
</style>
