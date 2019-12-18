<template>
  <header class="nav-bar">
    <div class="nav-bar__search">
      <b-field type="is-black">
        <b-input
          class="nav-bar__search-input"
          placeholder="Nhập tên khách hàng"
          type="search"
          expanded
        ></b-input>
        <p class="control">
          <b-button icon-right="search" type="is-black" />
        </p>
      </b-field>
    </div>

    <nav class="nav-bar__navigator">
      <router-link class="nav-bar__navigator-item" to="/" exact
        >Giao dịch</router-link
      >
      <router-link class="nav-bar__navigator-item" to="debt" exact
        >Nợ</router-link
      >
    </nav>
  </header>
</template>

<script>
export default {
  name: "nav-bar"
};
</script>

<style lang="scss" scoped>
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px;
  border-bottom: 2px solid #ccc;
}

.nav-bar__search-input {
  width: 190px;
}

.nav-bar__navigator {
  display: flex;
  flex-direction: flex-end;

  .nav-bar__navigator-item {
    &:not(:last-child) {
      margin-right: 40px;
    }

    color: #000;
    text-transform: uppercase;
    letter-spacing: 1.5px;

    &.router-link-active {
      color: red;
    }
  }
}
</style>
