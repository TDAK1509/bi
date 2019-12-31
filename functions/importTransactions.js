require("firebase/firestore");
const firebase = require("./config");
const db = firebase.firestore();
const csv = require("csv-parser");
const fs = require("fs");

const dbRef = db.collection("transactions");

fs.createReadStream("functions/transactions.csv")
  .pipe(csv())
  .on("data", async row => {
    const transaction = {
      date: row.date,
      transaction_type: row.transaction_type,
      amount: row.amount,
      payment_type: row.payment_type,
      seller_name: row.seller,
      product_name: row.product_name,
      product_quantity: row.quantity,
      client_name: row.client_name,
      client_id: row.client_id
    };

    dbRef
      .add(transaction)
      .then()
      .catch(() => {
        console.log("ERROR: ", row);
      });
  })
  .on("end", () => {
    console.log("DONE");
  });
