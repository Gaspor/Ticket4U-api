require('dotenv').config();

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const { Pool } = require('pg');
const connectionString = 'postgres://' + process.env.DB_USERNAME + ':' +
                            process.env.DB_PASSWORD + '@' +
                            process.env.DB_SERVER + ':' +
                            process.env.DB_PORT + '/' +
                            process.env.DB_NAME
                            
const pool = new Pool({
    connectionString: connectionString
});

async function connect() {
    if (global.connection)
        return global.connection.connect();

    //apenas testando a conexão
    const client = await pool.connect();
    console.log("Criou pool de conexões no PostgreSQL!");

    await client.query("SET TIMEZONE TO 'America/Sao_Paulo';");
    const res = await client.query('SELECT NOW()');
    console.log(res.rows[0]);
    client.release();

    //guardando para usar sempre o mesmo
    global.connection = pool;
    return pool.connect();

}

module.exports = {
    connect,
    query: (text, params) => pool.query(text, params)

};