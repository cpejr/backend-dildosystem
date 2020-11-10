exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('subcategories').del()
    .then(function () {
      // Inserts seed entries
      return knex('subcategories').insert([
        // MODA SENSUAL
        {
          "category_id": "3a6999f0-22e0-11eb-8d75-214996dae135",
          "id": "17601190-22e1-11eb-8d75-214996dae135",
          "name": "Fantasias"
        },
        {
          "category_id": "3a6999f0-22e0-11eb-8d75-214996dae135",
          "id": "2099abe0-22e1-11eb-8d75-214996dae135",
          "name": "Camisola"
        },
        {
          "category_id": "3a6999f0-22e0-11eb-8d75-214996dae135",
          "id": "24a71dd0-22e1-11eb-8d75-214996dae135",
          "name": "Body"
        },
        {
          "category_id": "3a6999f0-22e0-11eb-8d75-214996dae135",
          "id": "27fb03c0-22e1-11eb-8d75-214996dae135",
          "name": "Calcinhas"
        },
        {
          "category_id": "3a6999f0-22e0-11eb-8d75-214996dae135",
          "id": "2b2541a0-22e1-11eb-8d75-214996dae135",
          "name": "Conjuntos"
        },
        {
          "category_id": "3a6999f0-22e0-11eb-8d75-214996dae135",
          "id": "2e2a1d30-22e1-11eb-8d75-214996dae135",
          "name": "Espartilhos"
        },
        {
          "category_id": "3a6999f0-22e0-11eb-8d75-214996dae135",
          "id": "318e56d0-22e1-11eb-8d75-214996dae135",
          "name": "Acessórios"
        },
        {
          "category_id": "3a6999f0-22e0-11eb-8d75-214996dae135",
          "id": "36cf66c0-22e1-11eb-8d75-214996dae135",
          "name": "Calcinha tailandesa"
        },
        {
          "category_id": "3a6999f0-22e0-11eb-8d75-214996dae135",
          "id": "3d4e26d0-22e1-11eb-8d75-214996dae135",
          "name": "Kit sensual"
        },
        // PARA ELAS
        {
          "category_id": "c6169700-22e0-11eb-8d75-214996dae135",
          "id": "4d4f9820-22e1-11eb-8d75-214996dae135",
          "name": "Excitantes femininos"
        },
        {
          "category_id": "c6169700-22e0-11eb-8d75-214996dae135",
          "id": "743c7fc0-22e1-11eb-8d75-214996dae135",
          "name": "Vibrador Líquido"
        },
        {
          "category_id": "c6169700-22e0-11eb-8d75-214996dae135",
          "id": "798e3180-22e1-11eb-8d75-214996dae135",
          "name": "Lubrificantes"
        },
        {
          "category_id": "c6169700-22e0-11eb-8d75-214996dae135",
          "id": "7cc7b1a0-22e1-11eb-8d75-214996dae135",
          "name": "Vibradores"
        },
        {
          "category_id": "c6169700-22e0-11eb-8d75-214996dae135",
          "id": "81543ea0-22e1-11eb-8d75-214996dae135",
          "name": "Perfume afrodisíaco"
        },
        {
          "category_id": "c6169700-22e0-11eb-8d75-214996dae135",
          "id": "883b5d70-22e1-11eb-8d75-214996dae135",
          "name": "Pompoarismo"
        },
        {
          "category_id": "c6169700-22e0-11eb-8d75-214996dae135",
          "id": "91c45040-22e1-11eb-8d75-214996dae135",
          "name": "Kits"
        },
        // PARA ELES
        {
          "category_id": "cc5ae620-22e0-11eb-8d75-214996dae135",
          "id": "c513b080-22e1-11eb-8d75-214996dae135",
          "name": "Lubrificantes"
        },
        {
          "category_id": "cc5ae620-22e0-11eb-8d75-214996dae135",
          "id": "cb4e62b0-22e1-11eb-8d75-214996dae135",
          "name": "Retardantes"
        },
        {
          "category_id": "cc5ae620-22e0-11eb-8d75-214996dae135",
          "id": "d4fc69b0-22e1-11eb-8d75-214996dae135",
          "name": "Excitantes Masculinos"
        },
        {
          "category_id": "cc5ae620-22e0-11eb-8d75-214996dae135",
          "id": "daf509d0-22e1-11eb-8d75-214996dae135",
          "name": "Masturbadores"
        },
        {
          "category_id": "cc5ae620-22e0-11eb-8d75-214996dae135",
          "id": "e0237c20-22e1-11eb-8d75-214996dae135",
          "name": "Acessórios"
        },
        {
          "category_id": "cc5ae620-22e0-11eb-8d75-214996dae135",
          "id": "e760d140-22e1-11eb-8d75-214996dae135",
          "name": "Perfume Afodisíaco"
        },
        {
          "category_id": "cc5ae620-22e0-11eb-8d75-214996dae135",
          "id": "ed239450-22e1-11eb-8d75-214996dae135",
          "name": "Kits"
        },
        // SAINDO DA ROTINA
        {
          "category_id": "d206ece0-22e0-11eb-8d75-214996dae135",
          "id": "143987c0-22e2-11eb-8d75-214996dae135",
          "name": "Jogos Eróticos"
        },
        {
          "category_id": "d206ece0-22e0-11eb-8d75-214996dae135",
          "id": "1f95db00-22e2-11eb-8d75-214996dae135",
          "name": "Gel Comestível - Oral"
        },
        {
          "category_id": "d206ece0-22e0-11eb-8d75-214996dae135",
          "id": "321f2fb0-22e2-11eb-8d75-214996dae135",
          "name": "Bolinhas Explosivas"
        },
        {
          "category_id": "d206ece0-22e0-11eb-8d75-214996dae135",
          "id": "3aae0b10-22e2-11eb-8d75-214996dae135",
          "name": "Esquenta/Esfria"
        },
        {
          "category_id": "d206ece0-22e0-11eb-8d75-214996dae135",
          "id": "4e7d4d40-22e2-11eb-8d75-214996dae135",
          "name": "Óleos Para Massagem"
        },
        {
          "category_id": "d206ece0-22e0-11eb-8d75-214996dae135",
          "id": "555095f0-22e2-11eb-8d75-214996dae135",
          "name": "Kits"
        },
        {
          "category_id": "d206ece0-22e0-11eb-8d75-214996dae135",
          "id": "5b0ec520-22e2-11eb-8d75-214996dae135",
          "name": "Decoração Romântica"
        },
        {
          "category_id": "d206ece0-22e0-11eb-8d75-214996dae135",
          "id": "65f9b8f0-22e2-11eb-8d75-214996dae135",
          "name": "Acessórios Para Casais"
        },
        // SEXO ANAL
        {
          "category_id": "d82a6d90-22e0-11eb-8d75-214996dae135",
          "id": "b6a2d4d0-22e2-11eb-8d75-214996dae135",
          "name": "Plug Anal"
        },
        {
          "category_id": "d82a6d90-22e0-11eb-8d75-214996dae135",
          "id": "b96aa760-22e2-11eb-8d75-214996dae135",
          "name": "Dessensibilizante Anal"
        },
        {
          "category_id": "d82a6d90-22e0-11eb-8d75-214996dae135",
          "id": "c5bc7e30-22e2-11eb-8d75-214996dae135",
          "name": "Lubrificantes"
        },
        {
          "category_id": "d82a6d90-22e0-11eb-8d75-214996dae135",
          "id": "da3dd250-22e2-11eb-8d75-214996dae135",
          "name": "Ducha Higiênica"
        },
        {
          "category_id": "d82a6d90-22e0-11eb-8d75-214996dae135",
          "id": "e2620500-22e2-11eb-8d75-214996dae135",
          "name": "Excitante Anal"
        },
        {
          "category_id": "d82a6d90-22e0-11eb-8d75-214996dae135",
          "id": "ecb106f0-22e2-11eb-8d75-214996dae135",
          "name": "Kit Meu Primeiro Anal"
        },
        // HIGIENE E BANHO
        {
          "category_id": "dda48ee0-22e0-11eb-8d75-214996dae135",
          "id": "63692d90-22e3-11eb-8d75-214996dae135",
          "name": "Desodorante Íntimo"
        },
        {
          "category_id": "dda48ee0-22e0-11eb-8d75-214996dae135",
          "id": "6d01d7d0-22e3-11eb-8d75-214996dae135",
          "name": "Espumas e Sais de Banho"
        },
        {
          "category_id": "dda48ee0-22e0-11eb-8d75-214996dae135",
          "id": "755e7fa0-22e3-11eb-8d75-214996dae135",
          "name": "Preservativos"
        },
        {
          "category_id": "dda48ee0-22e0-11eb-8d75-214996dae135",
          "id": "7d909500-22e3-11eb-8d75-214996dae135",
          "name": "Sabonete Íntimo"
        },
        {
          "category_id": "dda48ee0-22e0-11eb-8d75-214996dae135",
          "id": "872324c0-22e3-11eb-8d75-214996dae135",
          "name": "Higienizadores"
        },
        {
          "category_id": "dda48ee0-22e0-11eb-8d75-214996dae135",
          "id": "89713370-22e3-11eb-8d75-214996dae135",
          "name": "Kits"
        },
        // ACESSORIOS BDSM
        {
          "category_id": "e5bcdab0-22e0-11eb-8d75-214996dae135",
          "id": "a157ab90-22e3-11eb-8d75-214996dae135",
          "name": "Algemas"
        },
        {
          "category_id": "e5bcdab0-22e0-11eb-8d75-214996dae135",
          "id": "a72eb9f0-22e3-11eb-8d75-214996dae135",
          "name": "Chicote e Chibatas"
        },
        {
          "category_id": "e5bcdab0-22e0-11eb-8d75-214996dae135",
          "id": "acd7da80-22e3-11eb-8d75-214996dae135",
          "name": "Coleiras"
        },
        {
          "category_id": "e5bcdab0-22e0-11eb-8d75-214996dae135",
          "id": "b8a90fa0-22e3-11eb-8d75-214996dae135",
          "name": "Kit Fetiche"
        },
        {
          "category_id": "e5bcdab0-22e0-11eb-8d75-214996dae135",
          "id": "bdf7b420-22e3-11eb-8d75-214996dae135",
          "name": "Mordaça"
        },
        {
          "category_id": "e5bcdab0-22e0-11eb-8d75-214996dae135",
          "id": "c22cd250-22e3-11eb-8d75-214996dae135",
          "name": "Palmatória"
        },
        {
          "category_id": "e5bcdab0-22e0-11eb-8d75-214996dae135",
          "id": "c5ef3180-22e3-11eb-8d75-214996dae135",
          "name": "Separadores"
        },
        {
          "category_id": "e5bcdab0-22e0-11eb-8d75-214996dae135",
          "id": "ce4d5ff0-22e3-11eb-8d75-214996dae135",
          "name": "Vendas Para Olhos"
        },
        // ESPECIAIS
        {
          "category_id": "eab2d7e0-22e0-11eb-8d75-214996dae135",
          "id": "eac5e350-22e3-11eb-8d75-214996dae135",
          "name": "Mais vendidos"
        },
        {
          "category_id": "eab2d7e0-22e0-11eb-8d75-214996dae135",
          "id": "eef7f440-22e3-11eb-8d75-214996dae135",
          "name": "Novidades"
        },
        {
          "category_id": "eab2d7e0-22e0-11eb-8d75-214996dae135",
          "id": "f8cd0b40-22e3-11eb-8d75-214996dae135",
          "name": "Cinquenta Tons De Cinza"
        },
        {
          "category_id": "eab2d7e0-22e0-11eb-8d75-214996dae135",
          "id": "ff1b4570-22e3-11eb-8d75-214996dae135",
          "name": "Linha LGBT"
        },
        {
          "category_id": "eab2d7e0-22e0-11eb-8d75-214996dae135",
          "id": "035ac3e0-22e4-11eb-8d75-214996dae135",
          "name": "Ofertas"
        }
      ]);
    });
};