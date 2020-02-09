import { db } from "@/firebase";
import { ApiRes } from "@/api/api-res";
import { Transaction, TransactionView } from "@/models/transaction";
import { formatDateToString } from "@/utils/date";

export default class ApiClient {
  private db: firebase.firestore.Firestore;

  constructor() {
    this.db = db;
  }

  async fetchDebts(
    storeCommit: Function,
    commitName: string,
    startDate: Date,
    endDate: Date,
    callback: Function[] = []
  ) {
    const docRef = this.db
      .collection(ApiRes.FirebaseCollection.TRANSACTIONS)
      .where("date", ">=", formatDateToString(startDate))
      .where("date", "<=", formatDateToString(endDate))
      .where("is_debt", "==", true);

    docRef.onSnapshot(querySnapshot => {
      const transactions: TransactionView[] = [];

      querySnapshot.forEach(doc => {
        const data = <Transaction>doc.data();
        const transaction: TransactionView = {
          ...data,
          id: doc.id.toString()
        };
        transactions.push(transaction);
      });

      storeCommit(commitName, transactions);
      callback.forEach(c => c());
    });
  }
}
