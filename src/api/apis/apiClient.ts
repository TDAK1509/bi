import { db } from "@/firebase";
import { ApiRes } from "@/api/api-res";
import { Client, ClientView } from "@/models/client";

export default class ApiClient {
  private db: firebase.firestore.Firestore;

  constructor() {
    this.db = db;
  }

  async addClient(client: Client): Promise<string> {
    const docRef = await this.db
      .collection(ApiRes.FirebaseCollection.CLIENTS)
      .add(client);
    return docRef.id;
  }

  async fetchClients(): Promise<ClientView[]> {
    const clients: ClientView[] = [];

    const docRef = await this.db.collection(ApiRes.FirebaseCollection.CLIENTS);
    const querySnapshot = await docRef.get();

    querySnapshot.forEach(doc => {
      const data = <Client>doc.data();
      const client: ClientView = {
        id: doc.id.toString(),
        ...data
      };
      clients.push(client);
    });

    return clients;
  }
}
