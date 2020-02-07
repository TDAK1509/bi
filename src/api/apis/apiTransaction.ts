import { db } from "@/firebase";
import { Transaction, TransactionView } from "@/models/transaction";
import { ApiRes } from "@/api/api-res";
import { formatDateToString } from "@/utils/date";

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

  async fetchTransactions(
    startDate: Date,
    endDate: Date
  ): Promise<TransactionView[]> {
    const transactions: TransactionView[] = [];

    const docRef = this.db
      .collection(ApiRes.FirebaseCollection.TRANSACTIONS)
      .where("date", ">=", formatDateToString(startDate))
      .where("date", "<=", formatDateToString(endDate));
    const querySnapshot = await docRef.get();

    querySnapshot.forEach(doc => {
      const data = <Transaction>doc.data();
      const transaction: TransactionView = { ...data, id: doc.id.toString() };
      transactions.push(transaction);
    });

    return transactions;
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
}
