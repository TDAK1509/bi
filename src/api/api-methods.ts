import * as firebase from "firebase";
import { db, auth } from "@/firebase";
import { Transaction, TransactionView } from "@/models/transaction";
import { Client, Debt, ClientView } from "@/models/client";
import { SelectOptions, ErrorMessage } from "@/models/helpers";
import { formatDateToString } from "@/utils/date";

enum FirebaseCollection {
  CLIENTS = "clients",
  TRANSACTIONS = "transactions",
  OPTIONS = "options"
}

export async function addClient(client: Client) {
  const docRef = await db.collection(FirebaseCollection.CLIENTS).add(client);
  return docRef.id;
}

export async function addTransaction(transaction: Transaction) {
  const docRef = await db
    .collection(FirebaseCollection.TRANSACTIONS)
    .add(transaction);
  return docRef.id;
}

export async function addDebt(clientId: string, debt: Debt) {
  const docRef = db.collection(FirebaseCollection.CLIENTS).doc(clientId);
  await docRef.update({
    debts: firebase.firestore.FieldValue.arrayUnion(debt)
  });
}

export async function updateDebts(clientId: string, debts: Debt[]) {
  const docRef = db.collection(FirebaseCollection.CLIENTS).doc(clientId);
  await docRef.update({ debts });
}

export async function fetchTransactions(startDate: Date, endDate: Date) {
  const transactions: TransactionView[] = [];

  const docRef = db
    .collection(FirebaseCollection.TRANSACTIONS)
    .where("date", ">=", formatDateToString(startDate))
    .where("date", "<=", formatDateToString(endDate));
  const querySnapshot = await docRef.get();

  querySnapshot.forEach(doc => {
    const data = doc.data();
    const transaction: TransactionView = {
      id: doc.id.toString(),
      date: data.date,
      transaction_type: data.transaction_type,
      amount: data.amount,
      payment_type: data.payment_type,
      seller_name: data.seller_name,
      product_name: data.product_name,
      product_quantity: data.product_quantity,
      client_name: data.client_name,
      client_id: data.client_id,
      is_transaction_debt: data.is_transaction_debt || false
    };
    transactions.push(transaction);
  });

  return transactions;
}

export async function fetchClients(): Promise<Array<ClientView>> {
  const clients: ClientView[] = [];

  const docRef = await db.collection(FirebaseCollection.CLIENTS);
  const querySnapshot = await docRef.get();

  querySnapshot.forEach(doc => {
    const data = doc.data();
    const client: ClientView = {
      id: doc.id.toString(),
      name: data.name,
      date: data.date,
      debts: data.debts
    };
    clients.push(client);
  });

  return clients;
}

export async function login(
  username: string,
  password: string
): Promise<Boolean> {
  try {
    await auth.signInWithEmailAndPassword(username, password);
    return true;
  } catch (error) {
    return false;
  }
}

export async function changePassword(
  newPassword: string
): Promise<ErrorMessage> {
  try {
    if (auth.currentUser) {
      await auth.currentUser.updatePassword(newPassword);
      return {
        success: true,
        message: "Đổi password thành công"
      };
    } else {
      throw { message: "Cần đăng nhập trước" };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

export async function getOptions(): Promise<SelectOptions> {
  const docRef = db.collection(FirebaseCollection.OPTIONS).doc("options");
  const doc = await docRef.get();
  const data = doc.data();

  return {
    sellers: data!.sellers || [],
    transaction_types: data!.transaction_types || [],
    product_names: data!.product_names || [],
    payment_types: data!.payment_types || []
  };
}

export async function addOptionSeller(sellerNames: string[]) {
  const docRef = db.collection(FirebaseCollection.OPTIONS).doc("options");
  await docRef.set(
    {
      sellers: sellerNames
    },
    { merge: true }
  );
}

export async function addOptionTransactionType(transactionTypes: string[]) {
  const docRef = db.collection(FirebaseCollection.OPTIONS).doc("options");
  await docRef.set(
    {
      transaction_types: transactionTypes
    },
    { merge: true }
  );
}

export async function addOptionProductName(productNames: string[]) {
  const docRef = db.collection(FirebaseCollection.OPTIONS).doc("options");
  await docRef.set(
    {
      product_names: productNames
    },
    { merge: true }
  );
}

export async function addOptionPaymentType(paymentTypes: string[]) {
  const docRef = db.collection(FirebaseCollection.OPTIONS).doc("options");
  await docRef.set(
    {
      payment_types: paymentTypes
    },
    { merge: true }
  );
}

export async function deleteTransaction(
  transactionId: string
): Promise<boolean> {
  try {
    await db
      .collection(FirebaseCollection.TRANSACTIONS)
      .doc(transactionId)
      .delete();
    return true;
  } catch (error) {
    return false;
  }
}
