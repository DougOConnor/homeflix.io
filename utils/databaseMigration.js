
const dbpath = './data/theater.db'
const db = require('better-sqlite3')(dbpath)

database_migrations = 
    {
        1: `
            CREATE TABLE showings (
                showing_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                tmdb_id TEXT,
                title TEXT,
                poster_path TEXT,
                year INTEGER,
                showing_datetime TEXT
            );

            CREATE TABLE seats (
                seat_id TEXT PRIMARY KEY NOT NULL
            );

            CREATE TABLE users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                username TEXT NOT NULL UNIQUE,
                email TEXT,
                name TEXT,
                birthday TEXT,
                is_admin BOOLEAN,
                password TEXT,
                reset_token TEXT
            );

            CREATE TABLE user_auth_tokens (
                token TEXT PRIMARY KEY NOT NULL,
                user_id INTEGER REFERENCES users(user_id)
            );

            CREATE TABLE reservations (
                seat_id INTEGER REFERENCES seats(seat_id),
                showing_id INTEGER REFERENCES showings(showing_id),
                user_id INTEGER REFERENCES users(user_id),
                PRIMARY KEY (seat_id, showing_id)
            );

        `,
        2: `
            INSERT INTO showings (title, poster_path, showing_datetime)
            VALUES
            ('The Unbearable Weight of Massive Talent', 'https://www.themoviedb.org/t/p/original/8JzPuj4lNQv0wmd38u0ee1dxzhn.jpg', '07-15-2022 08:00:00 PM');
        ` 
   }


let rows = []
let current_version = undefined

function get_db_version() {
    rows = db.prepare("SELECT MAX(version) as current_version from database_information").all();
    current_version = rows[0]["current_version"]
    return current_version
}

function insert_db_version(version) {
    db.prepare(`INSERT INTO database_information (version) VALUES (?)`).run(version)
}

try {
    // Try to get Database Version
    current_version = get_db_version()
} catch (error) {
    // Create database_version table, set version to 0
    console.log("First time running application, setting up databases")
    db.exec(`
        create table database_information (
            version int primary key not null
        );

        INSERT INTO database_information (version)
        VALUES
        (0)
    `)
    current_version = get_db_version()
} finally {
    console.log('Current DB Version: ', current_version)
}

// Run all required Upgrades
Object.keys(database_migrations).sort().map(version => {
    let sql = database_migrations[version]
    if (version > current_version) {
        console.log('Ugrading DB to version', version)
        db.exec(sql)
        insert_db_version(version)
        current_version = get_db_version()
    }
})



