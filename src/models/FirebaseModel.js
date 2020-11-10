const admin = require("firebase-admin");
const firebase = require("firebase/app");

require("firebase/auth");

const serviceAccount = require("../../serviceAccountKey.json");

var firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.FIREBASE_DATABASEURL,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDE,
  appID: process.env.FIREBASE_APPID,
};

firebase.initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dildo-system.firebaseio.com"
});

module.exports = {
  async createNewUser(email, password) {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((result) => {
          resolve(result.user.uid);
        })
        .catch((error) => {
          reject(error);
        });
    })
  },

  async deleteUser(uid) {
    return new Promise((resolve, reject) => {
      admin.auth().deleteUser(uid)
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          console.err(error);
          const errorMessage = error.message;
          reject(errorMessage);
        });
    })
  }, 

  async changeUserPassword(uid, newPassword) {
    return new Promise((resolve, reject) => {
      admin.auth().updateUser(uid, {
        password: newPassword
      })
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          console.err(error);
          const errorMessage = error.message;
          reject(errorMessage);
        })
    })
  },

  async sendPasswordChangeEmail(emailAddress) {
    return new Promise((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(emailAddress)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.err(error);
        const errorMessage = error;
        reject(error);
      });
    })
  },

  async changeUserEmail(uid, newEmail) {
    return new Promise((resolve, reject) => {
      admin.auth().updateUser(uid, {
        email: newEmail
      })
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          console.err(error);
          const errorMessage = error.message;
          reject(errorMessage);
        })
    })
  },

  async getUserEmails(uids) {
    return new Promise((resolve, reject) => {
      admin.auth().getUsers(uids) //Must have entries <= 100 
        .then((results) => {
          const users = results ? results.users : [];
          const emails = users.map((user) => {return {uid: user.uid, email: user.email}});
          resolve(emails);
        })
        .catch((error) => {
          console.err(error);
          const errorMessage = error.message;
          reject(errorMessage);
        })
    })
  },
  
  async login (email, password) {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {
          resolve(result.user.uid);
        })
        .catch((error) => {
          console.err(error);
          const errorMessage = error.message;
          reject(errorMessage);
        });
    })
  }
};