import { db } from "@/firebase";
import { ApiRes } from "@/api/api-res";
import { SelectOptions, Product } from "@/models/helpers";
import * as firebase from "firebase";

export default class ApiOptions {
  private db: firebase.firestore.Firestore;

  constructor() {
    this.db = db;
  }

  async fetchOptions(
    storeCommit: Function,
    commitName: string,
    callback: Function[] = []
  ) {
    const docRef = this.db
      .collection(ApiRes.FirebaseCollection.OPTIONS)
      .doc("options");

    docRef.onSnapshot(doc => {
      const data = <ApiRes.Options>doc.data();
      const options: SelectOptions = {
        sellers: data.sellers || [],
        transaction_types: data.transaction_types || [],
        product_names: this.fromJsonToProductNames(data.product_names),
        payment_types: data.payment_types || [],
        clients: data.clients || []
      };
      storeCommit(commitName, options);
      callback.forEach(c => c());
    });
  }

  private fromJsonToProductNames(
    productNames: Array<string | Product>
  ): Product[] {
    return productNames.map((product: string | Product) => {
      if (typeof product === "string") {
        const productObject: Product = {
          name: product,
          stock: 0,
          unit: "cái"
        };
        return productObject;
      }
      return product;
    });
  }

  updateStock(products: Product[]) {
    const docRef = this.db
      .collection(ApiRes.FirebaseCollection.OPTIONS)
      .doc("options");
    return docRef.update({
      product_names: products
    });
  }

  async addOptionClient(clientName: string) {
    const docRef = this.db
      .collection(ApiRes.FirebaseCollection.OPTIONS)
      .doc("options");
    await docRef.update({
      clients: firebase.firestore.FieldValue.arrayUnion(clientName)
    });
  }

  async addOptionSeller(sellerName: string) {
    const docRef = this.db
      .collection(ApiRes.FirebaseCollection.OPTIONS)
      .doc("options");
    await docRef.update({
      sellers: firebase.firestore.FieldValue.arrayUnion(sellerName)
    });
  }

  async addOptionTransactionType(transactionType: string) {
    const docRef = this.db
      .collection(ApiRes.FirebaseCollection.OPTIONS)
      .doc("options");
    await docRef.update({
      transaction_types: firebase.firestore.FieldValue.arrayUnion(
        transactionType
      )
    });
  }

  async addOptionProductName(productName: string) {
    const docRef = this.db
      .collection(ApiRes.FirebaseCollection.OPTIONS)
      .doc("options");
    await docRef.update({
      product_names: firebase.firestore.FieldValue.arrayUnion(productName)
    });
  }

  async addOptionPaymentType(paymentType: string) {
    const docRef = this.db
      .collection(ApiRes.FirebaseCollection.OPTIONS)
      .doc("options");
    await docRef.update({
      payment_types: firebase.firestore.FieldValue.arrayUnion(paymentType)
    });
  }
}
