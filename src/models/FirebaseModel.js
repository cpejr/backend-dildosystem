var admin = require("firebase-admin");

var serviceAccount = require("../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dildo-system.firebaseio.com"
});

module.exports = {

};