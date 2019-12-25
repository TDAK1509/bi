import * as firebase from "firebase";
import { db } from "@/firebase";
import {
  ClientToAddToDatabase,
  Client,
  Transaction,
  Debt,
  SelectOptions
} from "@/models/transaction";

enum FirebaseCollection {
  CLIENTS = "clients",
  OPTIONS = "options"
}

export async function addClient(client: ClientToAddToDatabase) {
  const docRef = await db.collection(FirebaseCollection.CLIENTS).add(client);
  return docRef.id;
}

export async function getAllClients(): Promise<Array<Client>> {
  const clients: Client[] = [];

  const docRef = await db.collection(FirebaseCollection.CLIENTS);
  const querySnapshot = await docRef.get();
  querySnapshot.forEach(doc => {
    const data = doc.data();
    const client: Client = {
      _id: doc.id.toString(),
      name: data.name,
      created_at: data.created_at,
      transactions: data.transactions,
      debts: data.debts
    };
    clients.push(client);
  });

  return clients;
}

export async function addTransaction(
  clientId: string,
  transaction: Transaction
) {
  const docRef = await db.collection(FirebaseCollection.CLIENTS).doc(clientId);
  docRef.update({
    transactions: firebase.firestore.FieldValue.arrayUnion(transaction)
  });
}

export async function addDebt(clientId: string, debt: Debt) {
  const docRef = await db.collection(FirebaseCollection.CLIENTS).doc(clientId);
  docRef.update({
    debts: firebase.firestore.FieldValue.arrayUnion(debt)
  });
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
