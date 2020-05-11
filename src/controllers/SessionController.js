const FirebaseModel = require('../models/FirebaseModel');
const DatabaseModel = require('../models/DatabaseModel');
const jwt = require('jsonwebtoken');

module.exports = {
  async signin(request, response) {
    try {
      const { email, password } = request.body;
      let firebaseUid;

      try {
        firebaseUid = await FirebaseModel.login(email, password);
      } catch (error) {
        return response.status(400).json({ message: 'Invalid credentials' });
      }
      const user = await DatabaseModel.getUserByUid(firebaseUid);

      const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30d" });
      return response.status(200).json({ accessToken, user });

    } catch (error) {
      return response.status(500).json({ message: 'Error while trying to validate credentials' })
    }
  },
}
