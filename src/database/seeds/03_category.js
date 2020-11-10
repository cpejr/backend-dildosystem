exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('categories').del()
    .then(function () {
      // Inserts seed entries
      return knex('categories').insert([
        {
          id: "3a6999f0-22e0-11eb-8d75-214996dae135",
          name: "MODA SENSUAL"
        },
        {
          id: "c6169700-22e0-11eb-8d75-214996dae135",
          name: "PARA ELAS"
        },
        {
          id: "cc5ae620-22e0-11eb-8d75-214996dae135",
          name: "PARA ELES"
        },
        {
          id: "d206ece0-22e0-11eb-8d75-214996dae135",
          name: "SAINDO DA ROTINA"
        },
        {
          id: "d82a6d90-22e0-11eb-8d75-214996dae135",
          name: "SEXO ANAL"
        },
        {
          id: "dda48ee0-22e0-11eb-8d75-214996dae135",
          name: "HIGIENE E BANHO"
        },
        {
          id: "e5bcdab0-22e0-11eb-8d75-214996dae135",
          name: "ACESSÓRIOS BDSM"
        },
        {
          id: "eab2d7e0-22e0-11eb-8d75-214996dae135",
          name: "ESPECIAIS"
        },
      ]);
    });
};