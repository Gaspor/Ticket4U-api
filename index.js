const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api/v1", require("./src/routes/routes.js"));

app.listen(PORT, () => {
    console.log("Running on: ", PORT);

}).on("error", (error) => {
    console.log("Error: ", error.message);

});
