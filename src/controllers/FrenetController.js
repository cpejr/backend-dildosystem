const axios = require('axios');

module.exports = {
  async getShippingServices(request, response) {
    const url = 'https://api.frenet.com.br/shipping/quote'
    const objFrenet = request.body;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'token': process.env.FRENET_API_TOKEN
      }
    };

    try {
      let respostaFrenet = await axios.post(url, objFrenet, config);
      respostaFrenet = respostaFrenet.data
      return response.status(200).json(respostaFrenet);
    } catch (e) {
      console.log(e);
      return response.status(500).json({ message: "Internal server error" })
    }
  }
}