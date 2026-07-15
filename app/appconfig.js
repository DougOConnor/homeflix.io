
class AppConfig {

    constructor() {
        this.NODE_ENV = process.env.NODE_ENV || 'development';
        this.DATABASE_USERNAME = process.env.DATABASE_USERNAME;
        this.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
        this.DATABASE_PORT = process.env.DATABASE_PORT;
        this.DATABASE_CERT = process.env.DATABASE_CERT;
        this.DATABASE_HOST = process.env.DATABASE_HOST;
        this.DATABASE = process.env.DATABASE;
        

        // Check that all required environment variables are set
        const VARS = [
            'NODE_ENV',
            'DATABASE_USERNAME',
            'DATABASE_PASSWORD'
        ]
        VARS.forEach((v) => {
            if (!this[v]) {
                throw new Error(`Missing environment variable ${v}`);
            }
        });
    }
}

module.exports = AppConfig;