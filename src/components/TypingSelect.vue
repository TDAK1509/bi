<template>
  <div class="typing-select">
    <div class="typing-select__input-header">
      <p class="typing-select__input-header-name">
        {{ label }}
      </p>

      <button
        class="typing-select__input-header-button"
        type="button"
        @click="prompt"
      >
        <b-icon icon="plus" size="is-small" type="is-info" />
      </button>
    </div>

    <v-select
      :values="selected"
      @input="onInput"
      :options="options"
      :reduce="option => option.value"
      label="label"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Model, Prop, Emit } from "vue-property-decorator";
import { VueSelectOption } from "../models/helpers";

@Component
export default class TypingSelect extends Vue {
  @Model("input", { required: true })
  selected!: any;

  @Prop({ type: Array, required: true })
  options!: VueSelectOption[];

  @Prop({ type: String, default: "Label" })
  label!: string;

  @Emit("input")
  onInput(value: any) {}

  @Emit("add")
  onClickAdd(value: string) {}

  prompt() {
    this.$buefy.dialog.prompt({
      message: `Thêm ${this.label}`,
      inputAttrs: {
        placeholder: "Điền vào chỗ trống..."
      },
      trapFocus: true,
      onConfirm: value => this.onClickAdd(value)
    });
  }
}
</script>

<style lang="scss" scoped>
.typing-select__input-header {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.typing-select__input-header-name {
  margin-right: 10px;
  font-weight: 700;
}

.typing-select__input-header-button {
  background: none;
  border: none;
  padding: 0;
  font-size: 1em;
  cursor: pointer;
}
</style>
