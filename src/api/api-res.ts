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
    product_names: string[];
    payment_types: string[];
    clients: string[];
  }

  export interface Cost {
    id: string;
    description: string;
    seller_name: string;
    amount: number;
    date: string;
  }
}
