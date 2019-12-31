export type FilterType = "month" | "year" | "all";

export interface SelectOptions {
  sellers: string[];
  transaction_types: string[];
  product_names: string[];
  payment_types: string[];
}
