const connection = require('../database/connection');
const FirebaseModel = require('../models/FirebaseModel');
const UserModel = require('../models/UserModel');

module.exports = {
  async index(request, response) {
    const { user_status } = request.query;
    let query = user_status ? { user_status } : {};
    const users = await UserModel.getUsers(query);
    return response.json(users);
  },

  async getOne(request, response) {
    const { id } = request.params;
    const users = await UserModel.getUserById(id);
    return response.json(users);
  },

  async create(request, response) {
    const user = request.body; 
    let firebaseUid; 
    try {
      firebaseUid = await FirebaseModel.createNewUser(user.email, user.password);
      user.firebase = firebaseUid;

      delete user.email;
      delete user.password;
      await connection('users').insert(user);
    } catch (err) {

      if (firebaseUid)
        FirebaseModel.deleteUser(firebaseUid)

      if (err.message)
        return response.status(400).json({ notification: err.message });

      console.log("User creation failed: " + err);
      return response.status(500).json({ notification: "Internal server error while trying to register user" });
    }
    return response.status(200).json({ notification: "Usuario criado!" });
  },

  async delete(request, response) {

    try {
      const { id } = request.params;

      const user = await UserModel.getUserById(id);
      console.log(user);

      await FirebaseModel.deleteUser(user.firebase);

      await UserModel.deleteUser(id);

      response.status(200).json({ message: "Sucesso!" });
    } catch (err) {
      console.log(err);
      return response.status(500).json({ notification: "Internal server error while trying to delete user" });
    }
  },

  async update(request, response) {
    try {
      const { id } = request.params;
      const newUser = request.body;
      const { password, email } = request.body;

      if (password) {
        const user = await UserModel.getUserById(id);
        
        const firebaseUid = user.firebase;

        await FirebaseModel.changeUserPassword(firebaseUid, password);

        delete newUser.password;
      }

      if(email) {
        const user = await UserModel.getUserById(id);
        
        const firebaseUid = user.firebase;

        await FirebaseModel.changeUserEmail(firebaseUid, email);

        delete newUser.email;
      }

      await UserModel.updateUser(newUser, id);

      response.status(200).json({ message: "Sucesso!" });
    } catch (err) {
      console.log(err);
      return response.status(500).json({ notification: "Internal server error while trying to update category" });
    }
  },
}