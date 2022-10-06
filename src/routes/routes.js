const express = require("express");
const routes = express();

/* Account */
routes.use('/', require('./register/register'));
routes.use('/', require('./login/login'));

/* Shows */
routes.use('/ticket', require('./show/show'));

module.exports = routes;
