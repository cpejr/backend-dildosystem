
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: "arthuzim", name: 'Arthur', firebase: 'Mpn273QdElcxqvYYsuFuOe2NHE63', email:'arthur2@gmail.com', type: 'admin', cpf: '15112358439', birthdate: '09/01/2001', phonenumber: '9857467384' }, 
        {id: "casulim", name: 'Casulus', firebase: 'ja3dzu8zM1MwIui4MZASYaScuOu2', email:'lojacasulus@gmail.com', type: 'admin', cpf: '15112358439', birthdate: '09/01/2001', phonenumber: '9857467384' },
        {id: "giovanninha", name: 'Giovanna', firebase: 'cAmJkGCkgsSCfogOYbUAfgZIgqF2', email:'giovanna@gmail.com', type: 'retailer', cpf: '15112358439', birthdate: '09/01/2001', phonenumber: '9857467384' },
        {id: "jaozim", name: 'João', firebase: 'mMnkpc3cvZXrzVL9tZf1z17lKWb2', email:'joao@gmail.com', type: 'wholesaler', cpf: '15112358439', birthdate: '09/01/2001', phonenumber: '9857467384' }, 
        {id: "jaozimX", name: 'JoãoX', firebase: 'eNtyK4Fn9GWBE364ohZX0sDPbSx1', email:'joao4@gmail.com', type: 'wholesaler', cpf: '15112358439', birthdate: '09/01/2001', phonenumber: '9857467384' }, 
        {id: "leandrim", name:'Leandro', firebase:'rI7uLmNyYqclYLtJjPjoRkCLe0T2', email:'leandrogripp@cpejr.com.br', type: 'wholesaler', cpf: '15112358439', birthdate: '09/01/2001', phonenumber: '9857467384' }
      ]);
    }); 
};