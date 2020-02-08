export namespace ApiRes {
  export enum FirebaseCollection {
    CLIENTS = "clients",
    TRANSACTIONS = "transactions",
    OPTIONS = "options"
  }

  export interface Options {
    sellers: string[];
    transaction_types: string[];
    product_names: string[];
    payment_types: string[];
    clients: string[];
  }
}
