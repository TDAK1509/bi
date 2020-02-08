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

  async fetchTransactions(
    storeCommit: Function,
    commitName: string,
    startDate: Date,
    endDate: Date
  ) {
    const docRef = this.db
      .collection(ApiRes.FirebaseCollection.TRANSACTIONS)
      .where("date", ">=", formatDateToString(startDate))
      .where("date", "<=", formatDateToString(endDate));

    docRef.onSnapshot(
      querySnapshot => {
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
      },
      err => {
        console.log(`Error getting real time transactions`, err);
      }
    );
  }
}
