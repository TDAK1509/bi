export namespace ApiRes {
  export enum FirebaseCollection {
    CLIENTS = "clients",
    TRANSACTIONS = "transactions",
    OPTIONS = "options",
    COST = "cost"
  }

  export interface Options {
    sellers: string[];
    transaction_types: string[];
    product_names: string[] | Product[];
    payment_types: string[];
    clients: string[];
  }

  export interface Product {
    name: string;
    stock: number;
    unit: string;
  }
}
