const getDatabase = require('../utils/getDatabase')

class Base {

    constructor(name, year) {
        this.db = getDatabase()
    }
}

module.exports = Base;