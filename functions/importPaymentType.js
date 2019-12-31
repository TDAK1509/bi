require("firebase/firestore");
const firebase = require("./config");
const db = firebase.firestore();

const payment_types = ["ACB", "Momo", "Tiền Mặt", "VCB", "VIB", "x"];

const docRef = db.collection("options").doc("options");
docRef
  .set({ payment_types }, { merge: true })
  .then(() => {
    console.log("done");
  })
  .catch(error => {
    console.log("ERROR", error);
  });
