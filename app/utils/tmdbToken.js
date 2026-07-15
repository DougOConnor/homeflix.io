// TMDB API key resolution: environment first (production / Docker),
// falling back to the legacy gitignored api/auth.json for local dev.
let token = process.env.TMDB_TOKEN || null;

if (!token) {
    try {
        token = require('../api/auth.json').tmdb_token;
    } catch (e) {}
}

if (!token) {
    console.warn('WARNING: TMDB_TOKEN is not set — movie search, artwork, and showings will not work. ' +
        'Set the TMDB_TOKEN environment variable (see .env.example).');
}

module.exports = token;
