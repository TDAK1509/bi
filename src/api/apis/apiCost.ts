import { db } from "@/firebase";
import { ApiRes } from "@/api/api-res";
import { CostView, Cost } from "@/models/cost";
import { CostSearchQuery } from "@/models/search";
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
      const costs: CostView[] = [];

      querySnapshot.forEach(doc => {
        const data = <Cost>doc.data();
        const cost: CostView = {
          ...data,
          id: doc.id.toString()
        };
        costs.push(cost);
      });

      storeCommit(commitName, costs);
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

  async updateCost(cost: CostView) {
    const docRef = this.db
      .collection(ApiRes.FirebaseCollection.COST)
      .doc(cost.id);
    delete cost.id;
    await docRef.set(cost);
  }
}
