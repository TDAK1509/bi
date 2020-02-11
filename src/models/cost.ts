export interface Cost {
  description: string;
  seller_name: string;
  amount: number;
  date: string;
}

export interface CostView extends Cost {
  id: string;
}
