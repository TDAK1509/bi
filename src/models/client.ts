export interface Client {
  date: string;
  name: string;
  debts: Debt[];
}

export interface ClientView extends Client {
  id: string;
}

export interface ClientInfo {
  id: string;
  name: string;
}

export interface Debt {
  date: string;
  name: string;
  amount: number;
  paid_transaction_list: Array<DebtTransaction>;
}

export interface DebtTransaction {
  id: string;
  amount: number;
  date: string;
}
