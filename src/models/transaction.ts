export interface Transaction {
  date: string;
  transaction_type: string;
  amount: number;
  payment_type: string;
  seller_name: string;
  product_name: string;
  product_quantity: string;
}

export interface TransactionView extends Transaction {
  client_name: string;
  client_id: string;
}

export interface TransactionAddArguments {
  clientId: string;
  transaction: Transaction;
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

export interface SelectOptions {
  sellers: string[];
  transaction_types: string[];
  product_names: string[];
  payment_types: string[];
}
