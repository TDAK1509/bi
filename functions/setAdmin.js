require("dotenv").config();
const admin = require("firebase-admin");
const serviceAccount = require("../firebase-admin-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL
});

function setAdmin(email) {
  admin
    .auth()
    .getUserByEmail(email)
    .then(function(user) {
      return admin
        .auth()
        .setCustomUserClaims(user.uid, { isAdmin: true })
        .then(() => {
          console.log("Done", email);
        })
        .catch(error => {
          console.log(email, error);
        });
    })
    .catch(function(error) {
      console.log("ERROR", error);
    });
}

setAdmin("dbcgdhh@gmail.com");
setAdmin("trietphan0794@gmail.com");
