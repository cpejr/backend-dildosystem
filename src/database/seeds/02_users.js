
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {name: 'Arthur', firebase: 'Mpn273QdElcxqvYYsuFuOe2NHE63', type: 'admin', cpf: '15112358439', birthdate: '09/01/2001', zipcode: '3175844', phonenumber: '9857467384', state: 'Minas Gerais', city: 'Belo Horizonte', neighborhood: 'União', street: 'Nelson', number: '123', complement: 'apt 101', approved: 'false'},
        {name: 'Giovanna', firebase: 'cAmJkGCkgsSCfogOYbUAfgZIgqF2', type: 'retailer', cpf: '15112358439', birthdate: '09/01/2001', zipcode: '3175844', phonenumber: '9857467384', state: 'Minas Gerais', city: 'Belo Horizonte', neighborhood: 'União', street: 'Nelson', number: '123', complement: 'apt 101', approved: 'false'},
        {name: 'João', firebase: 'mMnkpc3cvZXrzVL9tZf1z17lKWb2', type: 'wholesaler', cpf: '15112358439', birthdate: '09/01/2001', zipcode: '3175844', phonenumber: '9857467384', state: 'Minas Gerais', city: 'Belo Horizonte', neighborhood: 'União', street: 'Nelson', number: '123', complement: 'apt 101', approved: 'false'},
        {name: 'JoãoX', firebase: 'eNtyK4Fn9GWBE364ohZX0sDPbSx1', type: 'wholesaler', cpf: '15112358439', birthdate: '09/01/2001', zipcode: '3175844', phonenumber: '9857467384', state: 'Minas Gerais', city: 'Belo Horizonte', neighborhood: 'União', street: 'Nelsonnn', number: '123', complement: 'apt 101', approved: 'true'}
      ]);
    }); 
};