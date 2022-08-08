

const getDatabase = () => {
    const dbpath = './data/theater.db'
    const db = require('better-sqlite3')(dbpath)
    return db
}

module.exports = getDatabase;