export interface Transaction {
  date: string;
  name: string;
  type: string;
  amount: number;
}

export interface TransactionView extends Transaction {
  client: string;
}

export interface Client {
  name: string;
  created_at: Date;
  transactions: Transaction[];
}

export type FilterType = "month" | "year" | "all";
