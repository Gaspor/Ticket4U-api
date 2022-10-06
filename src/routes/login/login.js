const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const { jwtTokens } = require("./../../config/jwt");
const { query } = require("../../config/connection");
const { verifyIsClient, verifyIsProducer } = require("../../utils");

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userLogin = await query("SELECT * FROM account WHERE email = $1", [email]);
        
        if(userLogin.rows.length === 0) {
            return res.status(401).json({ 
                error: true, 
                message: "Email/Password is wrong!"

            });
        }
        
        const encryptedPassword = userLogin.rows[0].password;
        const decryptedPassword =  await bcrypt.compare(password, encryptedPassword);

        if (!decryptedPassword) {
            return res.status(401).json({ 
                error: true, 
                message: "Email/Password is wrong!"

            });
        }

        const user = userLogin.rows[0];
        
        if (await verifyIsProducer(user.id)) {
            user.cargo = "producer";
        
        }
        
        if (await verifyIsClient(user.id)) {
            user.cargo = "client";
        
        }

        const tokens = jwtTokens(user);
        return res.status(201).json({ 
            error: false,
            tokens: tokens, 
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                cargo: user.cargo

            }
        });

    } catch (error) {
        return res.status(500).json({ 
            error: true, 
            message: error.message 
        
        });
    }
});

module.exports = app;
