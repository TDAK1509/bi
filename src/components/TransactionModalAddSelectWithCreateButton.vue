<template>
  <div class="select-with-create-button">
    <b-field
      :label="label"
      :type="errorMessage ? 'is-danger' : ''"
      :message="errorMessage"
    >
      <b-select v-if="isClientName" :value="selected" @input="onSelect">
        <option
          v-for="l in list"
          :key="l.id"
          :value="{ id: l.id, name: l.name }"
          >{{ l.name }}</option
        >
      </b-select>

      <b-select v-else :value="selected" @input="onSelect">
        <option v-for="(l, index) in list" :key="index" :value="l">{{
          l
        }}</option>
      </b-select>
    </b-field>

    <b-tooltip
      class="select-with-create-button__add-button"
      :label="`Thêm ${label}`"
      type="is-warning"
    >
      <b-button
        type="is-success"
        icon-right="plus"
        size="is-small"
        @click="prompt"
      />
    </b-tooltip>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Model } from "vue-property-decorator";
import { ClientInfo } from "@/models/transaction";

@Component
export default class TransactionModalAddSelectWithCreateButton extends Vue {
  @Model("input", { required: true })
  selected!: any;

  @Emit("input")
  onSelect(value: string) {}

  @Prop({ type: String, required: true })
  label!: string;

  @Prop({ type: String, required: true })
  errorMessage!: string;

  @Prop({ type: Array, required: true })
  list!: Array<String | ClientInfo>;

  @Emit("add-to-list")
  addToList(value: string) {}

  get isClientName(): boolean {
    return this.list[0] instanceof Object;
  }

  prompt() {
    this.$buefy.dialog.prompt({
      message: `Thêm ${this.label}`,
      inputAttrs: {
        placeholder: "Điền vào chỗ trống..."
      },
      trapFocus: true,
      onConfirm: value => this.addToList(value)
    });
  }
}
</script>

<style lang="scss" scoped>
.select-with-create-button {
  display: flex;
}
.select-with-create-button__add-button {
  margin-left: 10px;
}
</style>
