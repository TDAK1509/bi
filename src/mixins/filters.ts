export default {
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
};
