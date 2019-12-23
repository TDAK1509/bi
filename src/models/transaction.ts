export interface Transaction {
  date: string;
  name: string;
  type: string;
  amount: number;
}

export interface TransactionView extends Transaction {
  client_name: string;
  client_id: string;
}

export interface Debt {
  date: string;
  name: string;
  amount: number;
  paid_transaction_list: Array<DebtTransaction>;
}

export interface DebtView extends Debt {
  paid: number;
}

export interface DebtTransaction {
  id: string;
  amount: number;
}

export interface ClientToAddToDatabase {
  name: string;
  created_at: string;
  transactions: Transaction[];
  debts: Debt[];
}

export interface Client extends ClientToAddToDatabase {
  _id: string;
}

export interface ClientInfo {
  id: string;
  name: string;
}

export type FilterType = "month" | "year" | "all";
