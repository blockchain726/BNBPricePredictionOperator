const express = require('express');
const accountController = require('../api/controllers/account.controller');

const apiAccount = express.Router();

apiAccount.post('/login', accountController.login);

module.exports = apiAccount;