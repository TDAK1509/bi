import { Component } from "vue-property-decorator";
import ErrorHandling from "./errorHandling";

@Component
export default class Options extends ErrorHandling {
  get isOptionsFetched(): boolean {
    return this.$store.state.options.isFetchedOptions;
  }

  get clientList(): string[] {
    if (!this.isOptionsFetched) {
      return [];
    }
    return this.$store.state.options.options.clients;
  }

  get sellerNameList(): string[] {
    if (!this.isOptionsFetched) {
      return [];
    }
    return this.$store.state.options.options.sellers;
  }

  get transactionTypeList(): string[] {
    if (!this.isOptionsFetched) {
      return [];
    }
    return this.$store.state.options.options.transaction_types;
  }

  get productNameList(): string[] {
    if (!this.isOptionsFetched) {
      return [];
    }
    return this.$store.state.options.options.product_names;
  }

  get paymentTypeList(): string[] {
    if (!this.isOptionsFetched) {
      return [];
    }
    return this.$store.state.options.options.payment_types;
  }

  async addClient(clientName: string) {
    try {
      await this.$store.dispatch("options/addClient", clientName);
      this.toastSuccess(`Khách hàng ${clientName} đã được tạo!`);
    } catch (error) {
      this.toastError();
    }
  }

  async addSeller(sellerName: string) {
    try {
      await this.$store.dispatch("options/addSeller", sellerName);
      this.toastSuccess(`Thêm người bán thành công!`);
    } catch (error) {
      this.toastError();
    }
  }

  async addTransactionType(transactionType: string) {
    try {
      await this.$store.dispatch("options/addTransactionType", transactionType);
      this.toastSuccess(`Thêm loại giao dịch thành công!`);
    } catch (error) {
      this.toastError();
    }
  }

  async addProductName(productName: string) {
    try {
      await this.$store.dispatch("options/addProductName", productName);
      this.toastSuccess(`Thêm sản phẩm thành công!`);
    } catch (error) {
      this.toastError();
    }
  }

  async addPaymentType(paymentType: string) {
    try {
      await this.$store.dispatch("options/addPaymentType", paymentType);
      this.toastSuccess(`Thêm hình thức thanh toán thành công!`);
    } catch (error) {
      this.toastError();
    }
  }
}
