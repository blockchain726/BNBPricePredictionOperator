var AccountService = require('../../services/account.service');

class AccountController {
    constructor() {
        this.accountService = new AccountService();
    }
    async login(req, res) {
        try{
            let loginInfo = await this.accountService.login(req.body.address);
            res.status(200).send(loginInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }
    async authenticateToken(req, res, next){
        this.accountService.authenticateToken(req, res, next)
    }
}

var accountController = new AccountController();
module.exports = {
    login: function(req, res) { accountController.login(req, res); },
    authenticateToken: function(req, res, next) { accountController.authenticateToken(req, res, next); },
}