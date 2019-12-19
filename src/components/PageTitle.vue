<template>
  <div class="page-title">
    <h4 class="page-title__text is-size-3"><slot></slot></h4>
  </div>
</template>

<script>
export default {
  name: "PageTitle"
};
</script>

<style scoped>
.page-title {
  text-align: center;
}
.page-title__text {
  margin: auto;
  font-weight: bold;
  letter-spacing: 2px;
  margin-bottom: 20px;
  color: red;
  text-transform: uppercase;
}
</style>
