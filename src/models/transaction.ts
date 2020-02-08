export interface Transaction {
  date: string;
  transaction_type: string;
  amount: number;
  payment_type: string;
  seller_name: string;
  product_name: string;
  product_quantity: string;
  client_name: string;
  is_transaction_debt?: boolean;
}

export interface TransactionView extends Transaction {
  id: string;
}

export class TransactionForDebt {
  constructor(
    public readonly transaction: Transaction,
    public readonly debtId: number
  ) {}
}
