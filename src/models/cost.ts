import { ApiRes } from "@/api/api-res";

export interface Cost {
  id?: string;
  description: string;
  seller_name: string;
  amount: number;
  date: string;
}

export interface CostSearchQuery {
  start_date: string;
  end_date: string;
}

export class CostManager {
  constructor(public readonly costs: Cost[]) {}

  public static buildFromJson(json: ApiRes.Cost[]): CostManager {
    return new CostManager(<Cost[]>json);
  }
}
