
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([{
        "id": "arthuzim",
        "name": "Arthur Braga",
        "firebase": "fEq0sRvUwzL8YC7ixnMthPMF9Vb2",
        "email": "arthur2@gmail.com",
        "type": "admin",
        "cpf": "15112358439",
        "birthdate": "2001-09-01",
        "phonenumber": "9584578456",
        "user_status": "approved"
      },
      {
        "id": "73e68a90-1e8e-11eb-9ebb-d7958a7b8b99",
        "name": "Vitória Régia de Carvalho Martins",
        "firebase": "fdKN1xcxgKSJb8DR6kSdq7KiBI23",
        "email": "vicregiac@gmail.com",
        "type": "admin",
        "cpf": "02660846308",
        "birthdate": "1995-06-25",
        "phonenumber": "62992336652",
        "user_status": "approved"
      },
      {
        "id": "73e68a90-1e8e-11eb-9ebb-d7958a7b8c48",
        "name": "Loja Casulus",
        "firebase": "RmEbCHthgBR3YBqXA2HefIcRpw32",
        "email": "lojacasulus@gmail.com",
        "type": "admin",
        "cpf": "02660846308",
        "birthdate": "1995-06-25",
        "phonenumber": "62992336652",
        "user_status": "approved"
      },
      {
        "id": "giovanninha",
        "name": "Giovanna Souza",
        "firebase": "cAmJkGCkgsSCfogOYbUAfgZIgqF2",
        "email": "giovanna@gmail.com",
        "type": "retailer",
        "cpf": "15112358439",
        "birthdate": "2001-09-01",
        "phonenumber": "9857467384",
        "user_status": "pending"
      },
      {
        "id": "eliasim",
        "name": "Elias Faria Silva",
        "firebase": "Gkol3EL3HkMzsmW4mCLjF69XJkl2",
        "email": "98eliasfaria@gmail.com",
        "type": "wholesaler",
        "cpf": "07072617671",
        "birthdate": "1998-06-28",
        "phonenumber": "31988532806",
        "user_status": "approved"
      }]);
    });
};