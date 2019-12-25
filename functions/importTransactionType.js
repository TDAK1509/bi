require("firebase/firestore");
const firebase = require("./config");
const db = firebase.firestore();

const transaction_types = [
  "Bưu Cục",
  "Ats",
  "Hải Ship",
  "Đại Ship",
  "Truc Tiep",
  "Quân Ship",
  "X",
  "Dũng Ship",
  "Now"
];

const docRef = db.collection("options").doc("options");
docRef
  .set({ transaction_types }, { merge: true })
  .then(() => {
    console.log("done");
  })
  .catch(error => {
    console.log("ERROR", error);
  });
