require("firebase/firestore");
const firebase = require("./config");
const db = firebase.firestore();

const transaction_types = [
  "ATS",
  "Bưu Cục",
  "Đại Ship",
  "Dũng Ship",
  "Gdtt",
  "Hải Ship",
  "Now",
  "Quân Ship",
  "Trực Tiếp",
  "x"
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
