export interface SearchQuery {
  field: string;
  value: string;
  operator: string;
  start_date: string;
  end_date: string;
}

export type FirebaseOperator =
  | "<"
  | "<="
  | "=="
  | ">="
  | ">"
  | "array-contains"
  | "in"
  | "array-contains-any";
