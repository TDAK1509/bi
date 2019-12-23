import * as firebase from "firebase";
import { db } from "@/firebase";
import {
  ClientToAddToDatabase,
  Client,
  Transaction,
  Debt
} from "@/models/transaction";

enum FirebaseCollection {
  CLIENTS = "clients"
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
