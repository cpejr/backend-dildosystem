const axios = require('axios');

module.exports = {
  async print(request, response) {
    try {
      const data = request;
      //console.log(data);
      return response.status(200).json({ message: 'ok!' })
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: 'Internal server error' })
    }
  },
  async getLink(request, response) {

    const requestBody = request.body;
    const url = `https://cieloecommerce.cielo.com.br/api/public/v1/orders`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'MerchantId': process.env.CIELO_MERCHANT_ID
      }
    }

    try {
      let respostaCielo = await axios.post(url, requestBody, config);
      respostaCielo = respostaCielo.data;

      return response.status(200).json(respostaCielo);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: "Internal server error" });
    }
  }
}