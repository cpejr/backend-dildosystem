const FirebaseModel = require('../models/FirebaseModel');
const DatabaseModel = require('../models/DatabaseModel');
const jwt = require('jsonwebtoken');

module.exports = {
    async signin(request, response) {
        const { email, password } = request.body;
        const firebaseUid = await FirebaseModel.login(email, password);
        const user = await DatabaseModel.getUserByUid(firebaseUid);
        console.log(user);
        console.log(firebaseUid);
        const accessToken = jwt.sign({user},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"30d"});
        return response.status(200).json({accessToken,user});
    }
}
