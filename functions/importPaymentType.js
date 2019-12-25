require("firebase/firestore");
const firebase = require("./config");
const db = firebase.firestore();

const payment_types = ["Ck ACB", "Ck VIB", "Ck VCB", "x", "Ck Momo"];

const docRef = db.collection("options").doc("options");
docRef
  .set({ payment_types }, { merge: true })
  .then(() => {
    console.log("done");
  })
  .catch(error => {
    console.log("ERROR", error);
  });
