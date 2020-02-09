import { Vue, Component } from "vue-property-decorator";

@Component({
  filters: {
    monetize: (value: number): string => {
      const currencyFormatter = new Intl.NumberFormat("vn-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0
      });
      return currencyFormatter.format(value);
    }
  }
})
export default class Filters extends Vue {}
