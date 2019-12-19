export interface Transaction {
  _id: string | number;
  date: string;
  name: string;
  type: string;
  amount: number;
}

export interface TransactionView extends Transaction {
  client_name: string;
  client_id: string | number;
}

export interface Debt {
  _id: string | number;
  date: string;
  name: string;
  amount: number;
  paid_transaction_list: Array<DebtTransaction>;
}

export interface DebtView extends Debt {
  paid: number;
}

export interface DebtTransaction {
  id: string | number;
  amount: number;
}

export interface Client {
  _id: string | number;
  name: string;
  created_at: string;
  transactions: Transaction[];
  debts: Debt[];
}

export type FilterType = "month" | "year" | "all";
