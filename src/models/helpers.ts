export type FilterType = "month" | "year" | "all";

export interface SelectOptions {
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

export interface ErrorMessage {
  success: boolean;
  message: string;
}

export interface VueSelectOption {
  value: any;
  label: string;
}
