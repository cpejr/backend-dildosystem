
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('table_name').del()
    .then(function () {
      // Inserts seed entries
      return knex('table_name').insert([
        {id: 1, name: 'Jorge', email: 'jorge@jorge.com'},
        {id: 2, name: 'Maria', email: 'maria@maria.com'},
      ]);
    });
};
