
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('table_name').del()
    .then(function () {
      // Inserts seed entries
      return knex('table_name').insert([
        {id: 1, title: 'Fazer algo', user_id: 1},
        {id: 2, title: 'Fazer alguma coisa', user_id: 1},
        {id: 3, title: 'Meudeudoceu', user_id: 1},
      ]);
    });
};
