require("firebase/firestore");
const firebase = require("./config");
const db = firebase.firestore();
const csv = require("csv-parser");
const fs = require("fs");

const dbRef = db.collection("clients");

fs.createReadStream("functions/clients.csv")
  .pipe(csv())
  .on("data", async row => {
    const clientId = row.id;
    const client = {
      name: row.name,
      date: "2019-12-31",
      debts: []
    };

    dbRef
      .doc(clientId)
      .set(client)
      .then()
      .catch(() => {
        console.log("ERROR: ", clientId);
      });
  })
  .on("end", () => {
    console.log("DONE");
  });
