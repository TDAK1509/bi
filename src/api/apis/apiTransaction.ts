import { db } from "@/firebase";
import { Transaction, TransactionView } from "@/models/transaction";
import { ApiRes } from "@/api/api-res";
import { formatDateToString } from "@/utils/date";
import { TransactionSearchQuery, FirebaseOperator } from "@/models/search";

export default class ApiTransaction {
  private db: firebase.firestore.Firestore;

  constructor() {
    this.db = db;
  }

  async addTransaction(transaction: Transaction): Promise<string> {
    const docRef = await this.db
      .collection(ApiRes.FirebaseCollection.TRANSACTIONS)
      .add(transaction);
    return docRef.id;
  }

  async deleteTransaction(transactionId: string): Promise<boolean> {
    try {
      await this.db
        .collection(ApiRes.FirebaseCollection.TRANSACTIONS)
        .doc(transactionId)
        .delete();
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateTransaction(transaction: TransactionView) {
    const docRef = this.db
      .collection(ApiRes.FirebaseCollection.TRANSACTIONS)
      .doc(transaction.id);
    delete transaction.id;
    await docRef.set(transaction);
  }

  async fetchTransactions(
    storeCommit: Function,
    commitName: string,
    query: TransactionSearchQuery,
    callback: Function[] = []
  ) {
    let docRef = this.db
      .collection(ApiRes.FirebaseCollection.TRANSACTIONS)
      .where("date", ">=", query.start_date)
      .where("date", "<=", query.end_date);

    if (query.field && query.operator && query.value) {
      docRef = this.db
        .collection(ApiRes.FirebaseCollection.TRANSACTIONS)
        .where("date", ">=", query.start_date)
        .where("date", "<=", query.end_date)
        .where(query.field, <FirebaseOperator>query.operator, query.value);
    }

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
