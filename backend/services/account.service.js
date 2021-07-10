const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const operatorAddress = ''; //Change it to your public address
const TOKEN_SECRET = 'OPERATOR'

module.exports = class AccountService {

    constructor() {
    }

    async login(address) {
        let success = false;
        let token = null;
        if(address == operatorAddress){
          success = true;
          token = jwt.sign({address: address}, TOKEN_SECRET, { expiresIn: '24h' });
        }
        return {
          success: success,
          result: success? token : null
        }
    }

    authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
  
        if (token == null) return res.sendStatus(401)
        jwt.verify(token, TOKEN_SECRET, (err, user) => {
          console.log(err)
  
          if (err) return res.sendStatus(403)
  
        //   req.user = users
  
          next()
        })
      }
      
}