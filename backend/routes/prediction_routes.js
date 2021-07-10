const express = require('express');
const predictionController = require('../api/controllers/prediction.controller');
const accountController = require('../api/controllers/account.controller');

const apiPrediction = express.Router();

apiPrediction.post('/execute', accountController.authenticateToken, predictionController.executeMarket);
apiPrediction.post('/pause', accountController.authenticateToken, predictionController.pauseMarket);
apiPrediction.post('/resume', accountController.authenticateToken, predictionController.resumeMarket);
apiPrediction.post('/claim', accountController.authenticateToken, predictionController.claimTreasury);
apiPrediction.post('/treasury-rate', accountController.authenticateToken, predictionController.setTreasuryRate);

module.exports = apiPrediction;
