const { config } = require('aws-sdk');
const axios = require('axios');
const InstaCredecialModel = require('../models/InstaCredencial')

module.exports = {

  async config() {
    let tempo = await InstaCredecialModel.getCredentials()
    console.log(tempo)

    if( !tempo ) {
      const data = {
        access_token: process.env.INSTA_ACCESS_TOKEN,
        expiry_date: new Date()
      }
      InstaCredecialModel.createCredentials(data)
    }
    
    // tempo = tempo.expiry_date
    // console.log(tempo)

  },

  async getPictures(request, response) {
    try {
      
      let allPics = await axios.get(`https://graph.instagram.com/me/media?fields=id,caption&access_token=${process.env.INSTA_ACCESS_TOKEN}`);

      allPics = allPics.data.data

      const picsUrl = [];

      // console.log('pics: ', allPics)

      // Map assincrono
      await Promise.all(allPics.map(async pics => {
        const resp = await axios.get(`https://graph.instagram.com/${pics.id}?fields=id,media_type,media_url,username,timestamp&access_token=${process.env.INSTA_ACCESS_TOKEN}`);
        // console.log(resp.data)
        picsUrl.push(resp.data)
      }))

      //console.log(picsUrl)

      return response.status(200).json(picsUrl);
    } catch (error) {
      //console.log(error);
      return response.status(500).json({ message: "There was an error while trying to fetch" });
    }
  }


}