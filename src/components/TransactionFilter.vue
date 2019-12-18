<template>
  <div>
    <b-field>
      <b-radio-button v-model="radio" native-value="month" type="is-black">
        <span>Tháng</span>
      </b-radio-button>

      <b-radio-button v-model="radio" native-value="year" type="is-black">
        <span>Năm</span>
      </b-radio-button>

      <b-radio-button v-model="radio" native-value="all" type="is-black"
        >Tất cả</b-radio-button
      >
    </b-field>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class TransactionFilter extends Vue {
  radio: string = "month";

  @Watch("radio")
  onRadioChange() {
    this.$emit("filter", this.radio);
  }
}
</script>
