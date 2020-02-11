import { db } from "@/firebase";
import { ApiRes } from "@/api/api-res";
import { CostManager, Cost, CostSearchQuery } from "@/models/cost";
import * as firebase from "firebase";

export default class ApiOptions {
  private db: firebase.firestore.Firestore;

  constructor() {
    this.db = db;
  }

  async fetchCosts(
    storeCommit: Function,
    commitName: string,
    query: CostSearchQuery,
    callback: Function[] = []
  ) {
    let docRef = this.db
      .collection(ApiRes.FirebaseCollection.COST)
      .where("date", ">=", query.start_date)
      .where("date", "<=", query.end_date);

    docRef.onSnapshot(querySnapshot => {
      const costsFromApi: ApiRes.Cost[] = [];

      querySnapshot.forEach(doc => {
        const data = doc.data();
        const cost = <ApiRes.Cost>{
          ...data,
          id: doc.id.toString()
        };
        costsFromApi.push(cost);
      });

      const costManager = CostManager.buildFromJson(costsFromApi);

      storeCommit(commitName, costManager.costs);
      callback.forEach(c => c());
    });
  }

  async addCost(cost: Cost): Promise<string> {
    const docRef = await this.db
      .collection(ApiRes.FirebaseCollection.COST)
      .add(cost);
    return docRef.id;
  }

  async removeCost(costId: string) {
    try {
      await this.db
        .collection(ApiRes.FirebaseCollection.COST)
        .doc(costId)
        .delete();
      return true;
    } catch (error) {
      return false;
    }
  }
}
