<template>
  <div class="add-button">
    <button class="add-button__button" @click="onClick">
      <b-icon icon="plus" size="is-large" />
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from "vue-property-decorator";

@Component
export default class AddButton extends Vue {
  @Emit("click")
  onClick() {}
}
</script>

<style lang="scss" scoped>
.add-button {
  position: fixed;
  bottom: 100px;
  right: 100px;
}

.add-button__button {
  padding: 5px;
  border-radius: 50%;
  background: #000;
  color: #fff;

  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
}
</style>
