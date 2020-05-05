
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {name: 'Jose', email: 'jose@hotmail.com', firebase: 'KHSBAHKNDJAHXHA', type: 'admin', cpf: '17901271249128', birthdate: '12/06/1976', zipcode: '121512432'},
        {name: 'Maria', email: 'Maria@hotmail.com', firebase: 'KHSBAHFKAJDJAHXHA', type: 'admin', cpf: '179025137949128', birthdate: '12/07/1976', zipcode: '33352432'},
        {name: 'Paula', email: 'Paula@hotmail.com', firebase: 'KHSBAHKABCJNAKAHXHA', type: 'admin', cpf: '179065477949128', birthdate: '12/08/1976', zipcode: '22152432'},
        {name: 'Ana', email: 'Ana@hotmail.com', firebase: 'KHSBAVSAHBDJJAHXHA', type: 'admin', cpf: '12290127949698', birthdate: '12/09/1976', zipcode: '88852432'},
        {name: 'Marcos', email: 'Marcos@hotmail.com', firebase: 'KHSBACNALKNK', type: 'admin', cpf: '56590127949128', birthdate: '12/10/1976', zipcode: '09952432'},
        {name: 'Pedro', email: 'Pedro@hotmail.com', firebase: 'AJNAKLNKHKNDJAHXHA', type: 'admin', cpf: '9859012723949128', birthdate: '12/11/1976', zipcode: '11252432'},
        {name: 'Felipe', email: 'Felipe@hotmail.com', firebase: 'JAKBJLDAHKNDJAHXHA', type: 'admin', cpf: '6737901237949128', birthdate: '12/12/1976', zipcode: '44352432'},
      ]);
    });
};