import { db } from "@/firebase";
import { ApiRes } from "@/api/api-res";
import { Debt } from "@/models/client";
import * as firebase from "firebase";

export default class ApiClient {
  private db: firebase.firestore.Firestore;

  constructor() {
    this.db = db;
  }

  async addDebt(clientId: string, debt: Debt) {
    const docRef = this.db
      .collection(ApiRes.FirebaseCollection.CLIENTS)
      .doc(clientId);
    await docRef.update({
      debts: firebase.firestore.FieldValue.arrayUnion(debt)
    });
  }

  async updateDebts(clientId: string, debts: Debt[]) {
    const docRef = this.db
      .collection(ApiRes.FirebaseCollection.CLIENTS)
      .doc(clientId);
    await docRef.update({ debts });
  }
}
