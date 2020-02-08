require("firebase/firestore");
const firebase = require("./config");
const db = firebase.firestore();
const clientJson = require("./clients.json");

const clients = clientJson.map(c => c.name);

const docRef = db.collection("options").doc("options");
docRef
  .set({ clients }, { merge: true })
  .then(() => {
    console.log("done");
  })
  .catch(error => {
    console.log("ERROR", error);
  });
