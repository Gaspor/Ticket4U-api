const express = require("express");
const app = express();
const { query } = require("../../config/connection");
const { authenticateToken } = require("../../middleware/auth");
const { decodeUser } = require("../../config/decodeJWT");
const { verifyIsProducer } = require("../../utils");

app.post("/register", authenticateToken, async (req, res) => {
    let eventId = 0;

    try {
        const authInfos = req;
        const user = decodeUser(authInfos);
        const eventInfos = req.body;

        if (!eventInfos.category_id) {
            return res.status(400).json({
                error: false,
                message: "Category Not Found!"

            });
        }

        if (verifyIsProducer(user.id)) {
            const event = await query("INSERT INTO show(producerid, name, show_date, show_hour, image_url, show_url, description, location, tickets) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
                [
                    user.id,
                    eventInfos.name,
                    eventInfos.show_date,
                    eventInfos.show_hour,
                    eventInfos.image_url,
                    eventInfos.show_url,
                    eventInfos.description,
                    eventInfos.location,
                    eventInfos.tickets
                ]
            );

            eventId = event.rows[0].id;

            const eventCategory = await query("INSERT INTO show_category(id_show, id_category) VALUES($1, $2)",
                [
                    event.rows[0].id,
                    eventInfos.category_id
                ]
            );
            
            if (eventCategory.rowCount > 0) {
                return res.status(201).json({
                    error: false,
                    message: "Event created!"
    
                });
            }
        }
        
        return res.status(401).json({
            error: true,
            message: "Unauthorized!"
        
        });

    } catch (error) {
        if (error.code == 23503) {
            await query("DELETE FROM show WHERE id = $1", [eventId]);
                return res.status(400).json({
                    error: false,
                    message: "Invalid category!"
    
            });
        }

        return res.status(500).json({
            error: true,
            message: error.message
        
        });
    }
});

module.exports = app;
