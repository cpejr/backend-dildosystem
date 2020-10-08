
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('address').del()
    .then(function () {
      // Inserts seed entries
      return knex('address').insert([
        
            {
              "id" : 'addressid',
              "zipcode" : '17341433',
              "state" : "MG",
              "city" : "Belo Horizonte",
              "neighborhood" : "Liberdade",
              "street" : "Nelson street",
              "number" : "143",
              "complement" : "Apto 201"
            }  
      ]);
    }); 
};