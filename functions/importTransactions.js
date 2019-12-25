require("firebase/firestore");
const firebase = require("./config");
const db = firebase.firestore();
const csv = require("csv-parser");
const fs = require("fs");

const clients = {};
fs.createReadStream("functions/transactions.csv")
  .pipe(csv())
  .on("data", async row => {
    const clientName = row.client;
    const transaction = {
      date: row.date,
      transaction_type: row.transaction_type,
      amount: row.amount,
      payment_type: row.payment_type,
      seller_name: row.seller,
      product_name: row.product_name,
      product_quantity: row.quantity
    };
    if (!clients.hasOwnProperty(clientName)) {
      clients[clientName] = {
        name: clientName,
        created_at: "2019-12-25",
        transactions: [transaction],
        debts: []
      };
    } else {
      clients[clientName].transactions.push(transaction);
    }
  })
  .on("end", () => {
    const docRef = db.collection("clients");

    for (const clientName in clients) {
      const client = clients[clientName];
      docRef
        .add(client)
        .then()
        .catch(() => {
          console.log("ERROR: ", clientName);
        });
    }

    console.log("DONE");
  });
