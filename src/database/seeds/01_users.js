
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('table_name').del()
    .then(function () {
      // Inserts seed entries
      return knex('table_name').insert([
        {name: 'Jose', email: 'jose@hotmail.com', firebase: 'KHSBAHKNDJAHXHA'},
        {name: 'Maria', email: 'Maria@hotmail.com', firebase: 'KHSBAHFKAJDJAHXHA'},
        {name: 'Paula', email: 'Paula@hotmail.com', firebase: 'KHSBAHKABCJNAKAHXHA'},
        {name: 'Ana', email: 'Ana@hotmail.com', firebase: 'KHSBAVSAHBDJJAHXHA'},
        {name: 'Marcos', email: 'Marcos@hotmail.com', firebase: 'KHSBACNALKNK'},
        {name: 'Pedro', email: 'Pedro@hotmail.com', firebase: 'AJNAKLNKHKNDJAHXHA'},
        {name: 'Felipe', email: 'Felipe@hotmail.com', firebase: 'JAKBJLDAHKNDJAHXHA'},
      ]);
    });
};
