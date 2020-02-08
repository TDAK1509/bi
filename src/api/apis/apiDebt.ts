import { db } from "@/firebase";
import { ApiRes } from "@/api/api-res";
import * as firebase from "firebase";

export default class ApiClient {
  private db: firebase.firestore.Firestore;

  constructor() {
    this.db = db;
  }

  async updateDebtAmount(transactionId: string, debtAmount: number) {
    const docRef = this.db
      .collection(ApiRes.FirebaseCollection.TRANSACTIONS)
      .doc(transactionId);
    await docRef.update({ debt_amount: debtAmount });
  }

  async updateDebtStatus(transactionId: string, isDebt: boolean) {
    const docRef = this.db
      .collection(ApiRes.FirebaseCollection.TRANSACTIONS)
      .doc(transactionId);
    await docRef.update({ is_debt: isDebt });
  }
}
