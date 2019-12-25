require("firebase/firestore");
const firebase = require("./config");
const db = firebase.firestore();

const sellers = [
  "Long",
  "Mi",
  "Duy ",
  "Hải",
  "Bw Team",
  "Phi",
  "Bi",
  "Trịnh Y Y",
  "Duy",
  "Đèn Dầu",
  "A",
  "Thịnh",
  "Lala"
];

const docRef = db.collection("options").doc("options");
docRef
  .set({ sellers }, { merge: true })
  .then(() => {
    console.log("done");
  })
  .catch(error => {
    console.log("ERROR", error);
  });
