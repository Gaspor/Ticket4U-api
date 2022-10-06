const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const { jwtTokens } = require("./../../config/jwt");
const { query } = require("../../config/connection");

app.post('/register', async (req, res) => {
    try {
        const CNPJ = req.body.CNPJ;
        const isProducer = req.body.producer;

        if (!isProducer || (CNPJ && isProducer)) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            
            let newUser;

            if (isProducer) {
                if (CNPJ.length == 18) {
                    newUser = await query(
                        "INSERT INTO account(name, email, password) VALUES ($1, $2, $3) RETURNING *",
                        [req.body.name, req.body.email, hashedPassword]
                    );

                    const user = newUser.rows[0];
                    
                    await query("INSERT INTO producer(id, CNPJ) VALUES ($1, $2)", [user.id, CNPJ]);
                    user.cargo = "producer";

                    return res.status(201).json({
                        error: false,
                        tokens: jwtTokens(user),
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            cargo: user.cargo

                        }
                    });
                
                } else {
                    return res.status(400).json({
                        error: true,
                        message: "Error: Wrong CNPJ length"
                    
                    });
                }
            } else {
                newUser = await query(
                    "INSERT INTO account(name, email, password) VALUES ($1, $2, $3) RETURNING *",
                    [req.body.name, req.body.email, hashedPassword]
                );

                const user = newUser.rows[0];

                await query("INSERT INTO client(id) VALUES ($1)", [user.id]);
                user.cargo = "client";

                return res.status(201).json({ 
                    error: false, 
                    tokens: jwtTokens(user), 
                    user: { 
                        id: user.id, 
                        username: user.username, 
                        email: user.email, 
                        cargo: user.cargo 

                    }
                });
            }
        }
        
        return res.status(400).json({
            error: true,
            message: "Error: Producer without CNPJ"
        
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message
        
        });
    }
});

module.exports = app;
