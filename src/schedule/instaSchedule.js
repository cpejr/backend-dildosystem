const { SimpleIntervalJob, AsyncTask } = require('toad-scheduler');
const axios = require('axios');

const credentiaisModel = require('../models/CredentialModel');

const options = {
  days: 15, 
  runImmediately: true
};

async function refreshInstagramToken() {
  const {access_token: oldToken} = await credentiaisModel.getCredentials();

  const {data:{access_token}} = await axios.request({
    method: 'get',
    url:'https://graph.instagram.com/refresh_access_token',
    params: {
      grant_type: 'ig_refresh_token',
      access_token: oldToken
    },
  });

  const expiry_date = new Date();
  expiry_date.setDate(expiry_date.getDate() + 60);
  const newCredentials = {
    access_token,
    refresh_token: access_token,
    scope: 'Instagram',
    token_type: 'AccessToken',
    expiry_date
  }

  const result = await credentiaisModel.updateCredentials(newCredentials);

  console.log('Refreshed Instagram Credentials', newCredentials);

}

const instaUpdateTask = new AsyncTask('simple task',
  refreshInstagramToken,
  (err) => {console.log('Erro ao atualizar as credenciais do Instagram', err)}
);

const instaUpdateJob = new SimpleIntervalJob(options, instaUpdateTask);

module.exports = { instaUpdateJob, refreshInstagramToken }