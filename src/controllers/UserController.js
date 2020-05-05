const connection = require('../database/connection');
const FirebaseModel = require('../models/FirebaseModel');

module.exports = {
  async index(request, response) {
    const users = await connection('users').select('*');
    return response.json(users);
  },

  async create(request, response) {
    const user = request.body
    let firebaseUid;
    try {
      firebaseUid = await FirebaseModel.createNewUser(user.email, user.password);
      user.firebase = firebaseUid;

      delete user.password;
      await connection('users').insert(user);
    } catch (err) {

      if (firebaseUid)
        FirebaseModel.deleteUser(firebaseUid)

      if(err.message)
        return response.status(400).json({notification: err.message});

      console.log("User creation failed: " + err);
      return response.status(500).json({ notification: "Internal server error while trying to register user" });
    }
    return response.status(200).json({ notification: "Usuario criado!" });
  }
}