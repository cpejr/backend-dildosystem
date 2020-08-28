
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('credentials').del()
    .then(function () {
      // Inserts seed entries
      return knex('credentials').insert([
        
            {
              "access_token" : "ya29.a0AfH6SMBdbtqz_KbAp0MiDap_hzLhFdLf93JjeGDu7paTe1s2D7gb1YZCA_CNUqx9FFlLHKwwbV5jaCZhGUgWVz5YQtYZ7Gled3bvJJR5LfCbjtEscOlmaQsk4D6Rs_jzq9N9IcjqOt8RIoyV8BI8bXR0GwVFxgIJ82IP",
              "refresh_token" : "1\/\/0hUm83kYdV-VDCgYIARAAGBESNwF-L9IrnOo_SelPlwIfiKwoqB9mgW1YqCrO-AeL108szBuTvq9eJC-FLFxQjlbnRcK-0oNU5gg",
              "scope" : "https:\/\/www.googleapis.com\/auth\/drive",
              "token_type" : "Bearer",
              "expiry_date" : 1598619859814
            }  
      ]);
    }); 
};