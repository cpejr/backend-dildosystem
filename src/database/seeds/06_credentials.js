
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('credentials').del()
    .then(function () {
      // Inserts seed entries
      return knex('credentials').insert([
        
            {
              "access_token" : 'ya29.a0AfH6SMB-zCXh10FEx_6dLBd3hEKKcyFdsF1ecqYVxEgXg1FBocKJJqaT_pNW58BbUw4yyN_NUM0CspPf-PZy-RCHTs-gJdUKh1CbEhyJDljlyiNrkHB1x6LyCYAGKdRRQJ4cM4eLbtNbV_oW9Hkx28jsFy4CMMHxh_c',
              "refresh_token" : '1//0hKWPCwxRWMm_CgYIARAAGBESNwF-L9IrAM1bsE0LebkoaZg9qlmp36s5G22flEcBfej7ZestQCyAoKwV1nCMQ29cPTE2DQ_Vztk',
              "scope" : "https:\/\/www.googleapis.com\/auth\/drive",
              "token_type" : "Bearer",
              "expiry_date" : 1598924145866
            }  
      ]);
    }); 
};