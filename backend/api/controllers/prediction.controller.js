var PredictionService = require('../../services/prediction.service');

class PredictionController {
    constructor() {
        this.predictionService = new PredictionService();
    }

    async executeMarket(req, res) {
        try {
            let result = await this.predictionService.executeMarket(req, res);
            res.status(200).send(result);
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "An internal server error has occurred" });
        }

    }

    async pauseMarket(req, res) {
        try {
            let result = await this.predictionService.pauseMarket(req, res);
            res.status(200).send(result);
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "An internal server error has occurred" });
        }
    }

    async resumeMarket(req, res) {
        try {
            let result = await this.predictionService.resumeMarket(req, res);
            res.status(200).send(result);
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "An internal server error has occurred" });
        }
    }

    async claimTreasury(req, res) {
        try {
            let result = await this.predictionService.claimTreasury(req, res);
            res.status(200).send(result);
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "An internal server error has occurred" });
        }
    }

    async setTreasuryRate(req, res) {
        try {
            let result = await this.predictionService.setTreasuryRate(req, res);
            res.status(200).send(result);
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "An internal server error has occurred" });
        }
    }
}

var predictionController = new PredictionController();
module.exports = {
    executeMarket: function (req, res) { predictionController.executeMarket(req, res); },
    pauseMarket: function (req, res) { predictionController.pauseMarket(req, res); },
    resumeMarket: function (req, res) { predictionController.resumeMarket(req, res); },
    claimTreasury: function (req, res) { predictionController.claimTreasury(req, res); },
    setTreasuryRate: function (req, res) { predictionController.setTreasuryRate(req, res); }
}
