import { db } from "@/firebase";
import { ApiRes } from "@/api/api-res";
import { SelectOptions } from "@/models/helpers";

export default class ApiOptions {
  private db: firebase.firestore.Firestore;

  constructor() {
    this.db = db;
  }

  async getOptions(): Promise<SelectOptions> {
    const docRef = this.db
      .collection(ApiRes.FirebaseCollection.OPTIONS)
      .doc("options");
    const doc = await docRef.get();
    const data = <ApiRes.Options>doc.data();

    return {
      sellers: data.sellers || [],
      transaction_types: data.transaction_types || [],
      product_names: data.product_names || [],
      payment_types: data.payment_types || []
    };
  }

  async addOptionSeller(sellerNames: string[]) {
    const docRef = this.db
      .collection(ApiRes.FirebaseCollection.OPTIONS)
      .doc("options");
    await docRef.set(
      {
        sellers: sellerNames
      },
      { merge: true }
    );
  }

  async addOptionTransactionType(transactionTypes: string[]) {
    const docRef = this.db
      .collection(ApiRes.FirebaseCollection.OPTIONS)
      .doc("options");
    await docRef.set(
      {
        transaction_types: transactionTypes
      },
      { merge: true }
    );
  }

  async addOptionProductName(productNames: string[]) {
    const docRef = this.db
      .collection(ApiRes.FirebaseCollection.OPTIONS)
      .doc("options");
    await docRef.set(
      {
        product_names: productNames
      },
      { merge: true }
    );
  }

  async addOptionPaymentType(paymentTypes: string[]) {
    const docRef = this.db
      .collection(ApiRes.FirebaseCollection.OPTIONS)
      .doc("options");
    await docRef.set(
      {
        payment_types: paymentTypes
      },
      { merge: true }
    );
  }
}
