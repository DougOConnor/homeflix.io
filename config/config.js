let config = {
  production: {
    username: "root",
    password: "password",
    database: "database_production",
    dialect: "sqlite",
    storage: "./data/production.db"
  }
}

if (
  process.env.DATABASE_USERNAME |
  process.env.DATABASE_PASSWORD |
  process.env.DATABASE_NAME |
  process.env.DATABASE_HOST |
  process.env.DATABASE_PORT |
  process.env.DATABASE_DIALECT |
  process.env.DATABASE_SSL_CA
  ) {
  config = {
    production: {
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      dialect: process.env.DATABASE_DIALECT,
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
    }
  }

  if (process.env.DATABASE_SSL_CA) {
    config.production.dialectOptions = {
      ssl: {
        ca: process.env.DATABASE_SSL_CA
      }
    }
  }

}

module.exports = config
