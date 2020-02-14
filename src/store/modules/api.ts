import ApiAuth from "@/api/apis/apiAuth";
import ApiTransaction from "@/api/apis/apiTransaction";
import ApiDebt from "@/api/apis/apiDebt";
import ApiOptions from "@/api/apis/apiOptions";
import ApiCost from "@/api/apis/apiCost";

export class ApiState {
  auth = new ApiAuth();
  transaction = new ApiTransaction();
  debt = new ApiDebt();
  options = new ApiOptions();
  cost = new ApiCost();
}

export const api = {
  namespaced: true,
  state: new ApiState()
};
