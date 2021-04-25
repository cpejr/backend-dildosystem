const axios = require('axios');

module.exports = {
  async getDriveImages(request, response) {

    const { id } = request.params;
    console.log(id)
    const url = `https://docs.google.com/uc?id=${id}`;
    

    try {
      let respostaDrive = await axios.get(url);
      // respostaCielo = respostaCielo.data;
      // console.log(respostaDrive.data)

      return response.status(200).json(respostaDrive.data);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: "Internal server error" });
    }
  }
}