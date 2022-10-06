const { query } = require("./config/connection");

async function verifyIsProducer(id = -1) {
    if (id != -1) {
        const sql = `SELECT * FROM producer WHERE id = ${id}`;
        return verifyUser(sql)

    }
    
    return false;
}

async function verifyIsClient(id = -1) {
    if (id != -1) {
        const sql = `SELECT * FROM client WHERE id = ${id}`;
        return verifyUser(sql);

    }

    return false;
}

async function verifyUser(sql) {
    const isUser = await query(sql);
    if (isUser.rows[0]) {
        return true;
    
    }

    return false;
}

module.exports = { verifyIsClient, verifyIsProducer }