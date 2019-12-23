<template>
  <header class="nav-bar">
    <b-button
      type="is-white"
      icon-right="long-arrow-alt-left"
      @click="toPreviousPage"
    />

    <div class="nav-bar__search">
      <b-input
        v-model="searchText"
        class="nav-bar__search-input"
        placeholder="Nhập tên khách hàng"
        icon="search"
        type="search"
        expanded
      ></b-input>

      <div v-if="searchedClients !== null" class="nav-bar__search-results">
        <router-link
          v-for="client in searchedClients"
          :key="client._id"
          class="nav-bar__search-results-item"
          :to="`/client/${client._id}`"
          >{{ client.name }}</router-link
        >
      </div>
    </div>

    <nav class="nav-bar__navigator">
      <router-link class="nav-bar__navigator-item" to="/" exact
        >Xem báo cáo tài chính</router-link
      >
    </nav>

    <b-button
      type="is-white"
      icon-right="long-arrow-alt-right"
      @click="toNextPage"
    />
  </header>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Client } from "../models/transaction";

@Component
export default class NavBar extends Vue {
  searchText: string = "";

  get clients(): Client[] {
    return this.$store.state.clients;
  }

  get searchedClients(): Client[] | null {
    if (this.searchText === "") {
      return null;
    }

    return this.clients.filter((client: Client) =>
      client.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

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
  flex: 1;

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
</style>
