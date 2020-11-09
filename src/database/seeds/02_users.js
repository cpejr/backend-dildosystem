
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: "arthuzim", name: 'Arthur Braga', firebase: 'fEq0sRvUwzL8YC7ixnMthPMF9Vb2', email:'arthur2@gmail.com', type: 'admin', cpf: '15112358439', birthdate: '2001-09-01', phonenumber: '9857467384' }, 
        {id: "giovanninha", name: 'Giovanna Souza', firebase: 'cAmJkGCkgsSCfogOYbUAfgZIgqF2', email:'giovanna@gmail.com', type: 'retailer', cpf: '15112358439', birthdate: '2001-09-01', phonenumber: '9857467384' },
        {id: "eliasim", name: 'Elias Faria', firebase: 'Gkol3EL3HkMzsmW4mCLjF69XJkl2', email:'98eliasfaria@gmail.com', type: 'wholesaler', cpf: '07072617671', birthdate: '1998-06-28', phonenumber: '31988532806' }, 
      ]);
    }); 
};