import ApiAuth from "@/api/apis/apiAuth";
import ApiClient from "@/api/apis/apiClient";
import ApiTransaction from "@/api/apis/apiTransaction";
import ApiDebt from "@/api/apis/apiDebt";
import ApiOptions from "@/api/apis/apiOptions";

export class ApiState {
  auth = new ApiAuth();
  client = new ApiClient();
  transaction = new ApiTransaction();
  debt = new ApiDebt();
  options = new ApiOptions();
}

export const api = {
  namespaced: true,
  state: new ApiState()
};
