require("firebase/auth");
const firebase = require("./config");

const email = process.env.LOGIN_EMAIL;
const password = process.env.LOGIN_PASSWORD;

firebase
  .auth()
  .createUserWithEmailAndPassword(email, password)
  .catch(function(error) {
    console.log("Error creating user", error);
  });
