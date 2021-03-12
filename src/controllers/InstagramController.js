const axios = require('axios');

module.exports = {
  async getPictures(request, response) {
    try {
      const resp = await axios.get(`https://www.instagram.com/graphql/query/?query_id=17888483320059182&variables=%7B%22id%22:%2219360403638%22,%22first%22:20,%22after%22:null%7D`);

      //resp = await resp.json();

      //console.log(resp.data)

      const pics = resp.data.data.user.edge_owner_to_timeline_media.edges;

      return response.status(200).json(pics);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: "There was an error while trying to fetch" });
    }
  }
}