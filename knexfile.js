module.exports = {

    development: {
        client: 'mysql',
        connection: {
            host: process.env.MYSQL_HOST || 'localhost',
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || 'password',
            database: process.env.MYSQL_DATABASE || 'bemconectado'
        },
        migrations: {
            directory: './src/database/migrations'
        },
        seeds: {
            directory: './src/database/seeds'
        },
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