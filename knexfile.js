module.exports = {

    development: {
        client: 'mysql',
        connection: {
            host: 'localhost' || process.env.MYSQL_HOST,
            user: 'root' || process.env.MYSQL_USER,
            password: 'cpejr123' || process.env.MYSQL_PASSWORD,
            database: 'bemConectado' || process.env.MYSQL_DATABASE,
        },
        migrations: {
            directory: './src/database/migrations'
        },
        useNullAsDefault: true,
    },

    production: {
        client: 'mysql',
        connection: {
            database: 'my_db',
            user: 'username',
            password: 'password'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },
}